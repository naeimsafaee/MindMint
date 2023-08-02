const { postgres } = require("../../databases");
const { NotFoundError, HumanError } = require("../errorhandler");
const Errors = require("../errorhandler/MessageText");

const { default: axios } = require("axios");
const moment = require("moment");
const { sendPushToToken } = require("../notification.service");
const { getMainUserWallet } = require("../wallet.service");
const walletConfig = require("config").get("clients.wallet");

async function addAuctionManager(data, io) {
	return new Promise(async (resolve, reject) => {
		const { start, end, immediatePrice, initialNumber, cardTypeId, type } = data;

		const transaction = await postgres.sequelize.transaction();

		const cardType = await postgres.CardType.findByPk(cardTypeId);
		if (!cardType) return reject(new NotFoundError("Card type not found", 2029, { cardTypeId }));

		const findDuplicateCards = await postgres.AssignedCard.findAndCountAll({
			where: {
				userId: null,
				type: "TRANSFER",
				status: "INAUCTION",
				"$card.cardTypeId$": cardTypeId,
			},
			include: [postgres.Card],
			raw: true,
		});

		var cardsId = [];
		for (const value of findDuplicateCards.rows) {
			cardsId.push(value.cardId);
		}

		const freeAssignedCards = await postgres.AssignedCard.findAndCountAll({
			where: {
				cardId: { [postgres.Op.notIn]: cardsId },
				userId: null,
				type: "TRANSFER",
				status: "FREE",
				"$card.cardTypeId$": cardTypeId,
			},
			include: [postgres.Card],
			limit: initialNumber,
			raw: true,
		});

		if (freeAssignedCards.count === 0)
			return reject(new HumanError("There is no assigned card with this card type id", 2048));

		try {
			const assignedCards = freeAssignedCards.rows;
			const newAuctions = [];
			for (let i = 0; i < assignedCards.length; i++) {
				newAuctions.push({ assignedCardId: assignedCards[i].id, start, end, immediatePrice, type });
			}

			await postgres.Auction.bulkCreate(newAuctions, { transaction });

			const assignedCardsIds = assignedCards.map((as) => as.id);
			await postgres.AssignedCard.update(
				{ status: "INAUCTION" },
				{ where: { id: { [postgres.Op.in]: assignedCardsIds } }, transaction },
			);

			await transaction.commit();
			return resolve("Successful");
		} catch (error) {
			console.log(error);

			await transaction.rollback();
			return reject(new HumanError("An error occurred while registering the auction", 1051));
		}
	});
}

/**
 * add new auction by user
 * @param {*} userId
 * @param {*} assignedCardId
 * @param {*} start
 * @param {*} end
 * @param {*} basePrice
 * @param {*} immediatePrice
 * @param {*} bookingPrice
 * @param {*} type
 * @param {*} io
 */
async function add(userId, assignedCardId, start, end, basePrice, immediatePrice, bookingPrice, type, io, auctionType) {
	let assignCard = await postgres.AssignedCard.findOne({
		where: { userId, id: assignedCardId, status: "FREE", type: ["TRANSFER", "REWARD", "BOX"] },
		include: [{ model: postgres.Card, where: { isCommon: false } }],
	});

	if (!assignCard) throw new HumanError(Errors.AUCTION_FAILED.MESSAGE, Errors.AUCTION_FAILED.CODE);

	let result = await postgres.Auction.create(
		{
			userId,
			assignedCardId,
			start,
			end,
			basePrice,
			immediatePrice,
			bookingPrice,
			type: type ?? "NORMAL",
			auctionType,
		},
		{ returning: true },
	);

	if (!result) throw new HumanError(Errors.AUCTION_FAILED.MESSAGE, Errors.AUCTION_FAILED.CODE);

	await assignCard.update({ status: "INAUCTION" });

	io.to("Auction").emit("auction-create", JSON.stringify(result));

	return "Successful";
}

async function editAuctionManager(data, io) {
	return new Promise(async (resolve, reject) => {
		const { id, start, end, immediatePrice, type } = data;

		const transaction = await postgres.sequelize.transaction();

		try {
			const auction = await postgres.Auction.findOne({ where: { id } });
			if (!auction) {
				await transaction.rollback();
				return reject(new NotFoundError("auction not found", 1052, { id }));
			}

			const update = {};

			if (type) update.type = type;
			if (start) update.start = start;
			if (end) update.end = end;
			if (immediatePrice) update.immediatePrice = immediatePrice;

			const updatedAuction = await postgres.Auction.update(update, { where: { id }, transaction });

			if (!updatedAuction) {
				await transaction.rollback();
				return reject(new HumanError(Errors.UPDATE_FILED.MESSAGE, Errors.UPDATE_FILED.CODE));
			}

			await transaction.commit();

			return resolve("Successful");
		} catch (e) {
			await transaction.rollback();
			return reject(e);
		}
	});
}

/**
 * delete manager auction
 * @param {*} id
 * @param io
 * @returns
 */
async function delAuctionManager(id, io) {
	const auction = await postgres.Auction.findOne({ where: { id, status: { [postgres.Op.ne]: "FINISHED" } } });
	if (!auction) {
		return new NotFoundError(Errors.AUCTION_NOT_FOUND.MESSAGE, Errors.AUCTION_NOT_FOUND.CODE, { id });
	}

	await postgres.AssignedCard.update({ status: "FREE" }, { where: { id: auction.assignedCardId } });
	await auction.destroy();

	return "Successful";
}

/**
 * get auction trades list
 * @param {*} auctionId
 * @param payerId
 * @param payeeId
 * @param {*} page
 * @param {*} limit
 * @param {*} order
 * @param sort
 */
async function getAuctionTradesManager(data) {
	let query = {};
	let query2 = {};
	let query3 = {};
	const {
		id,
		auctionId,
		payerId,
		payeeId,
		cardTypeId,
		page,
		limit,
		order,
		sort,
		createdAt,
		payer,
		payee,
		amount,
		fee,
		searchQuery,
		userId,
	} = data;

	if (id) query.id = id;
	if (userId) {
		// query = {
		// 	[postgres.Op.or]: [
		// 		{ "$payer.id$": { [postgres.Op.like]: "%" + userId + "%" } },
		// 		{ "$payee.id$": { [postgres.Op.like]: "%" + userId + "%" } },
		// 	],
		// };
		query = {
			[postgres.Op.or]: {
				payerId: postgres.User.sequelize.where(
					postgres.User.sequelize.cast(postgres.User.sequelize.col("payerId"), "varchar"),
					{ [postgres.Op.match]: "%" + userId + "%" },
				),
				payeeId: postgres.User.sequelize.where(
					postgres.User.sequelize.cast(postgres.User.sequelize.col("payeeId"), "varchar"),
					{ [postgres.Op.match]: "%" + userId + "%" },
				),
			},
		};
	}
	if (auctionId) query.auctionId = auctionId;

	if (payerId) query.payerId = payerId;

	if (payeeId) query.payeeId = payeeId;
	if (amount) query.amount = amount;

	if (payer) query2.name = { [postgres.Op.iLike]: "%" + payer + "%" };
	if (payee) query3.name = { [postgres.Op.iLike]: "%" + payee + "%" };

	if (createdAt) query.createdAt = createdAt;

	let offset = (page - 1) * limit;

	let result = await postgres.UserAuctionTrade.findAndCountAll({
		where: query,
		limit,
		offset,
		order: [[sort, order]],
		include: [
			{
				where: query2,
				model: postgres.User,
				as: "payer",
				attributes: { exclude: ["password", "salt"] },
				required: false,
			},
			{
				where: query3,
				model: postgres.User,
				as: "payee",
				attributes: { exclude: ["password", "salt"] },
				required: false,
			},
			{
				model: postgres.Auction,
				as: "auction",
				include: [
					{
						model: postgres.AssignedCard,
						include: [
							{
								model: postgres.Card,
								include: [postgres.CardType],
							},
						],
					},
				],
			},
		],
	});

	return {
		total: result?.count,
		pageSize: limit,
		page,
		data: result.rows,
	};
}

/**
 * get auction trades list
 * @param {*} id
 */
async function getAuctionTradeManager(id) {
	let result = await postgres.UserAuctionTrade.findOne({
		where: { id },
		include: [
			{ model: postgres.User, as: "payer", attributes: { exclude: ["password", "salt"] } },
			{ model: postgres.User, as: "payee", attributes: { exclude: ["password", "salt"] } },
			{ model: postgres.Auction, as: "auction" },
		],
	});

	return result;
}

/**
 * get auction trades list
 * @param {*} auctionId
 * @param userId
 * @param {*} page
 * @param {*} limit
 * @param {*} order
 * @param sort
 */
async function getAuctionTradesUser(auctionId, userId, page, limit, order, sort) {
	let query = {
		[postgres.Op.or]: {
			payerId: userId,
			payeeId: userId,
		},
	};

	if (auctionId) query.auctionId = auctionId;

	let offset = (page - 1) * limit;

	let result = await postgres.UserAuctionTrade.findAndCountAll({
		where: query,
		limit,
		offset,
		order: [[sort, order]],
		include: [
			{ model: postgres.User, as: "payer", attributes: ["name", "avatar"] },
			{ model: postgres.User, as: "payee", attributes: ["name", "avatar"] },
			// { model: postgres.Auction, as: "auction" },
		],
	});

	return {
		total: result?.count,
		pageSize: limit,
		page,
		data: result.rows,
	};
}

/**
 * get auction trades list
 * @param id
 * @param userId
 */
async function getAuctionTradeUser(id, userId) {
	let query = {
		[postgres.Op.or]: {
			payerId: { [postgres.Op.iLike]: "%" + userId + "%" },
			payeeId: { [postgres.Op.iLike]: "%" + userId + "%" },
		},
		id,
	};
	let result = await postgres.UserAuctionTrade.findAndCountAll({
		where: query,
		include: [
			{ model: postgres.User, as: "payer", attributes: { exclude: ["password", "salt"] } },
			{ model: postgres.User, as: "payee", attributes: { exclude: ["password", "salt"] } },
			{ model: postgres.Auction, as: "auction" },
		],
	});

	return result;
}

async function getAuctionList({ cardTypeId, min, max, page, limit }) {
	let offset = (page - 1) * limit;

	let query = {
		leftAmount: { [postgres.Op.gt]: 0 },
		status: "ACTIVE",
	};

	if (cardTypeId) query.cardTypeId = cardTypeId;

	if (min || max) query.price = { [postgres.Op.between]: [min, max] };

	const items = await postgres.Card.findAndCountAll({
		where: query,
		include: [
			{
				model: postgres.CardType,
				required: true,
			},
		],
		limit,
		offset,
		order: [[postgres.CardType, "price", "ASC"]],
	});

	return {
		total: items.count,
		pageSize: limit,
		page,
		data: items.rows,
	};
}

async function getSingleAuction(id) {
	const items = await postgres.Card.findOne({
		where: { id: id },
		include: [
			{
				model: postgres.CardType,
				required: true,
			},
		],
	});

	return items;
}

async function purchaseCard(cardId, type, address, user, io) {
	const card = await postgres.Card.findOne({
		where: {
			id: cardId,
		},
		include: [
			{
				model: postgres.CardType,
				required: true,
			},
		],
	});

	if (!card) throw new HumanError("Nft not found!", 404);
	if (card.leftAmount <= 0) throw new HumanError("This nft is minted before", 400);

	if (type === "MINT") {
		const transaction = await postgres.sequelize.transaction();

		try {
			const newAuction = await postgres.Auction.create(
				{
					status: "ACTIVE",
					cardId: card.id,
					userId: user.id,
					price: card.cardType.price,
					mintType: "User",
					address: address,
				},
				{ transaction },
			);

			await card.decrement("leftAmount", {
				by: 1,
				transaction,
			});

			await transaction.commit();
		} catch (error) {
			await transaction.rollback();

			throw error;
		}
	} else if (type === "ACCOUNT") {
		const newAuction = await postgres.Auction.create({
			status: "ACTIVE",
			cardId: card.id,
			userId: user.id,
			price: card.cardType.price,
			mintType: "System",
			address: address,
		});

		let userWallet = await getMainUserWallet(user.id);

		if (+userWallet.amount < +card.cardType.price) throw new HumanError("low wallet amount", 400);

		const transaction = await postgres.sequelize.transaction();

		try {
			//todo Mint Request
			// if (process.env.NODE_ENV !== "development")

			await postgres.AssignedCard.create({
				userId: user.id,
				cardId: card.id,
				type: "IN_SYSTEM",
				usedCount: 0,
			});

			await card.decrement("leftAmount", {
				by: 1,
				transaction,
			});

			await userWallet.decrement("amount", { by: +card.cardType.price, transaction });

			await newAuction.update({ status: "FINISHED" }, { transaction });

			await postgres.UserAuctionTrade.create(
				{
					auctionId: newAuction.id,
					payerId: user.id,
					amount: +card.cardType.price,
				},
				{ transaction },
			);

			await assignAttributes(user.id, card, transaction);

			const msg = `User ${user?.name || user?.email || user.id} purchased ${
				card.name
			} with ${+newAuction.price} successfully.`;

			const notif = await postgres.ManagerNotification.create({
				title: "Card Purchase",
				description: msg,
				userId: user.id,
				tag: "Card Purchase",
			});

			if (io) {
				io.to(`Manager`).emit("notification", JSON.stringify(notif));

				io.to(`UserId:${user.id}`).emit("wallet", JSON.stringify(userWallet));
			}

			await postgres.UserNotification.create({
				title: "NFT Purchase",
				description: `You buy ${card.name} just now.`,
				userId: user.id,
			});

			sendPushToToken(
				user,
				{},
				{
					title: "NFT purchase",
					body: `You buy ${card.name} just now.`,
				},
			);

			const ghostCard = await postgres.Card.findOne({
				include: [
					{
						model: postgres.CardType,
						where: {
							name: "ghost",
						},
						required: true,
					},
				],
			});

			await postgres.AssignedCard.destroy({
				userId: user.id,
				cardId: ghostCard.id,
			});

			await transaction.commit();
		}
		catch (error) {
			await transaction.rollback();

			throw error;
		}
	} else {
		//"CREDIT"
	}

	return "Successful";
}

function assignAttributes(userId, card, transaction) {
	return new Promise(async (resolve, reject) => {
		try {
			let attributes = await postgres.Attribute.findAll({
				where: {
					cardTypeId: card.cardTypeId,
					type: "INITIAL",
				},
			});

			for (const attribute of attributes) {
				await postgres.UserAttribute.create(
					{
						userId,
						cardId: card.id,
						attributeId: attribute.id,
						amount: attribute.amount,
					},
					{ transaction },
				);
			}

			return resolve();
		} catch (error) {
			return reject(error);
		}
	});
}

// Get all Auctions new
async function getAllAuctions({ page, limit, order, sort }) {
	const offset = (page - 1) * limit;
	const query = {
		status: "ACTIVE",
		start: { [postgres.Op.lte]: Date.now() },
		end: { [postgres.Op.gte]: Date.now() },
	};

	const result = await postgres.Auction.findAndCountAll({
		where: query,
		limit,
		offset,
		order: [[sort, order]],
		include: [
			{
				model: postgres.AssignedCard,
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
			},
		],
	});

	return {
		total: result?.count,
		pageSize: limit,
		page,
		data: result.rows,
	};
}

module.exports = {
	addAuctionManager,
	add,
	editAuctionManager,
	delAuctionManager,
	getAuctionTradesManager,
	getAuctionTradeManager,
	getAuctionTradesUser,
	getAuctionTradeUser,
	getAuctionList,
	getSingleAuction,
	purchaseCard,
	getAllAuctions,
	assignAttributes,
};
