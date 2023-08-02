const { postgres } = require("../databases");
const { HumanError } = require("./errorhandler/index");
const Errors = require("./errorhandler/MessageText");
const { getPagingData } = require("../utils/pagination");

//slice Winners
function sliceWinners(tier, number) {
	let from, to;

	[from, to] = tier.split("-");

	if (parseInt(from) === parseInt(number)) return true;

	return parseInt(number) > parseInt(from) && parseInt(number) <= parseInt(to);
}

async function increaseDopamine(userId, cardId, cardTypeId, name, transaction) {
	let userAttribute = await postgres.UserAttribute.findOne({
		where: {
			userId,
			cardId,
			type: "INITIAL",
		},
		include: [
			{
				model: postgres.Attribute,
				where: {
					cardTypeId,
					type: "INITIAL",
					name,
				},
				required: true,
			},
		],
	});

	if (!userAttribute) return false;

	let feeAttribute = await postgres.Attribute.findOne({
		where: {
			cardTypeId,
			name,
			type: "FEE",
		},
	});

	if (!feeAttribute) return true;

	if (+userAttribute.amount >= feeAttribute.maxAllowed) return { isRewarded: false };

	await userAttribute.increment("amount", {
		by: 1,
		transaction,
	});

	await postgres.UserAttribute.create(
		{
			userId,
			cardId,
			attributeId: feeAttribute.id,
			type: "FEE",
			amount: 1,
		},
		{ transaction },
	);

	return true;
}

/**
 * get user competition results
 * @param {*} id
 * @param {*} userdId
 * @returns
 */
function getResults(id, userdId, page, limit, status) {
	return new Promise(async (resolve, reject) => {
		try {
			let query = {};

			if (userdId) {
				query.userId = userdId;
			}

			if (status == "OPEN") {
				query.status = "OPEN";
			}

			if (status == "CLOSE") {
				query.status = "CLOSE";
			}

			let offset = (page - 1) * limit;
			let result = await postgres.MatchParticipant.findAndCountAll({
				limit,
				offset,
				where: query,
				order: [["createdAt", "DESC"]],
			});
			resolve(getPagingData(result, page, limit));
		} catch (e) {
			console.log(e);
			reject("no bro i can not found");
		}
	});
}

// Competition Task

/**
 * Create focus for user
 */
async function addFocus(userId, data) {
	return new Promise(async (resolve, reject) => {
		const { assignedCardId, period } = data;

		const transaction = await postgres.sequelize.transaction();

		try {
			const findAssignedCard = await postgres.AssignedCard.findOne({
				where: {
					userId,
					status: "INGAME",
				},
				transaction,
			});

			if (findAssignedCard) {
				return reject(new HumanError("User is in focus now!", Errors.CANNOT_JOIN_COMPETITION.CODE));
			}

			const assignedCard = await postgres.AssignedCard.findOne({
				where: {
					id: assignedCardId,
					userId,
				},
				include: [
					{
						model: postgres.Card,
						include: [
							{
								model: postgres.CardType,
							},
						],
					},
				],
				transaction,
			});

			if (!assignedCard) {
				return reject(new HumanError("Assigned Card not found!", Errors.ITEM_NOT_FOUND.CODE));
			}

			const cardTypeId = assignedCard.card.cardTypeId;

			const prize = await postgres.Prize.findOne({
				where: { cardTypeId },
				transaction,
			});

			const result = await increaseDopamine(userId, assignedCard.cardId, cardTypeId, "DOPAMINE", transaction);

			await postgres.MatchParticipant.create(
				{
					userId,
					cardId: assignedCard.cardId,
					assignedCardId: assignedCard.id,
					assetId: prize.assetId,
					prize: typeof result === "object" ? 0 : prize.amount,
					period,
					firstBeat: new Date().getTime(),
					lastBeat: new Date().getTime(),
				},
				{ transaction },
			);

			await assignedCard.update({ status: "INGAME" }, {}, { transaction });

			await transaction.commit();
		} catch (error) {
			// console.log(error);
			await transaction.rollback();
		}

		return resolve({
			status: "started",
			message: "startingFocus",
		});
	});
}

/**
 * end focus
 */
async function endFocus(userId, data) {
	return new Promise(async (resolve, reject) => {
		let { assignedCardId, timer: appTimer, violation } = data;

		const assignedCard = await postgres.AssignedCard.findOne({
			where: {
				id: assignedCardId,
				userId,
				status: "INGAME",
			},
			include: [
				{
					model: postgres.Card,
				},
			],
		});

		if (!assignedCard) {
			return reject(new HumanError("assigned Card not found!", Errors.ITEM_NOT_FOUND.CODE));
		}

		const transaction = await postgres.sequelize.transaction();

		if (violation) {
			return reject(await closeFocusDueToViolation(userId, assignedCardId, transaction));
		}

		try {
			const newMatchParticipant = await postgres.MatchParticipant.findOne({
				where: {
					userId,
					assignedCardId,
					status: "OPEN",
				},
				include: [
					{
						model: postgres.User,
						required: true,
					},
					{
						model: postgres.AssignedCard,
						required: true,
					},
					{
						model: postgres.Card,
						required: true,
						include: [
							{
								model: postgres.CardType,
								required: true,
							},
						],
					},
				],
				nest: true,
				raw: true,
			});

			// calculate focus time
			let startDate = newMatchParticipant.firstBeat;
			let now = new Date().getTime();

			const timer = diff_minutes(startDate, now);

			// console.log("timer is " + timer);

			let prevBeat = newMatchParticipant.lastBeat;
			const comparisonDate = diff_minutes(prevBeat, now);
			// console.log("comparisonDate is " + comparisonDate);

			//check time comparison
			if (comparisonDate >= 10) {
				return reject(await closeFocusDueToViolation(userId, assignedCardId, transaction));
			}

			await postgres.MatchParticipant.update(
				{
					status: "CLOSE",
					timer,
				},
				{
					where: {
						userId,
						assignedCardId: assignedCardId,
						status: "OPEN",
					},
					transaction,
					returning: true,
				},
			);

			await assignedCard.update({ status: "FREE" }, {}, transaction);

			let prize;
			if (+newMatchParticipant.prize !== 0) {
				prize = await postgres.Prize.findOne({
					where: { cardTypeId: newMatchParticipant.card.cardType.id },
					include: [
						{
							model: postgres.Asset,
						},
					],
					transaction,
				});

				let duration;
				if (process.env.NODE_ENV === "development") {
					duration = parseInt(parseInt(appTimer.split(":")[0]) * 4 + parseInt(appTimer.split(":")[1]) / 15);
				} else {
					duration = parseInt(appTimer.split(":")[0]);
				}

				prize.amount = +prize.amount * duration;

				let systemWallet = await postgres.SystemWallet.findOne({
					where: { assetId: prize.assetId },
					transaction,
				});

				let userWallet = await postgres.UserWallet.findOne({
					where: { userId: newMatchParticipant.userId, assetId: prize.assetId },
					transaction,
				});

				if (!userWallet) {
					userWallet = await postgres.UserWallet.create(
						{
							where: { userId: newMatchParticipant.userId, assetId: prize.assetId },
						},
						{ transaction, returning: true },
					);
				}

				await systemWallet.decrement("amount", { by: +prize.amount, transaction });

				await userWallet.increment("amount", { by: +prize.amount, transaction });

				await postgres.UserPrize.create(
					{
						userId: newMatchParticipant.userId,
						cardTypeId: newMatchParticipant.card.cardTypeId,
						assetId: prize.assetId,
						amount: prize.amount,
					},
					{
						transaction,
					},
				);
			}

			await transaction.commit();

			return resolve({
				status: "ended",
				message: "endWithRewards",
				prize,
			});
		} catch (error) {
			console.log(error);
			await transaction.rollback();
		}

		return resolve({
			status: "ended",
			message: "endWithoutRewards",
		});
	});
}

/**
 * Heart Beat
 */
async function heartBeat(userId, data) {
	return new Promise(async (resolve, reject) => {
		const { assignedCardId } = data;

		const assignedCard = await postgres.AssignedCard.findOne({
			where: {
				id: assignedCardId,
				userId,
				status: "INGAME",
			},
			include: [
				{
					model: postgres.Card,
				},
			],
		});

		if (!assignedCard) {
			return reject(new HumanError("assigned Card not found!", Errors.ITEM_NOT_FOUND.CODE));
		}

		const newMatchParticipant = await postgres.MatchParticipant.findOne({
			where: {
				userId,
				assignedCardId,
				status: "OPEN",
			},
		});

		const transaction = await postgres.sequelize.transaction();

		try {
			// calculate focus time

			let startDate = newMatchParticipant.firstBeat;

			// console.log("first beat", startDate);
			let now = new Date().getTime();
			// console.log("end date normal", now);

			const timer = diff_minutes(startDate, now);

			// console.log("timer is " + timer);

			let prevBeat = newMatchParticipant.lastBeat;
			// console.log("last beat", prevBeat);
			const comparisonDate = diff_minutes(prevBeat, now);
			// console.log("comparisonDate is " + comparisonDate);

			if (parseInt(comparisonDate) >= 10) {
				return reject(await closeFocusDueToViolation(userId, assignedCardId, transaction));
			}

			await postgres.MatchParticipant.update(
				{
					timer,
					lastBeat: new Date().getTime(),
				},
				{
					where: {
						userId,
						assignedCardId,
						status: "OPEN",
					},
					transaction,
					returning: true,
				},
			);

			await transaction.commit();
		} catch (error) {
			// console.log(error);
			await transaction.rollback();
		}

		return resolve("successful");
	});
}

function diff_minutes(d2, d1) {
	return Math.abs(Math.round((parseInt(d2) - parseInt(d1)) / 60000));
}

async function closeFocusDueToViolation(userId, assignedCardId, transaction) {
	await postgres.MatchParticipant.update(
		{
			status: "CLOSE",
		},
		{
			where: {
				userId,
				assignedCardId,
				status: "OPEN",
			},
			transaction,
			returning: true,
		},
	);

	await postgres.AssignedCard.update(
		{
			status: "FREE",
		},
		{
			where: {
				id: assignedCardId,
				userId,
			},
			transaction,
		},
	);

	await transaction.commit();

	return new HumanError("Your focus was closed due to a violation", Errors.ITEM_NOT_FOUND.CODE, {
		id: assignedCardId,
	});
}

module.exports = {
	sliceWinners,
	getResults,
	addFocus,
	endFocus,
	heartBeat,
};
