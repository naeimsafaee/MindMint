const { postgres } = require("./../databases");
const { notification } = require("../data/constans");
const { NotFoundError, HumanError } = require("./errorhandler");
const Errors = require("./errorhandler/MessageText");
const FCM = require("fcm-push");
const config = require("config");

const { mail, sms } = require("./../utils");
const { events } = require("../data/constans");

function get(type, page = 1, limit = 10, status, userId = null) {
	return new Promise(async (resolve, reject) => {
		let offset = 0 + (page - 1) * limit,
			query = { userId };

		if (type === "public") query.userId = null;

		if (typeof status === "boolean") query.status = status;

		let result = await postgres.UserNotification.findAll({
			where: query,
			limit: limit,
			offset,
			order: [["createdAt", "DESC"]],
			attributes: { exclude: ["deletedAt", "updatedAt"] },
		});

		resolve({
			total: result.length,
			pageSize: limit,
			page,
			data: result,
		});
	});
}

function updatePushToken(token, userId) {
	return new Promise(async (resolve, reject) => {
		await postgres.User.update(
			{
				pushToken: token ? token : null,
			},
			{
				where: {
					id: userId,
				},
			},
		);

		return resolve({
			message: "ok",
		});
	});
}

function changeStatus(userId, notification_id, model = "UserNotification") {
	return new Promise(async (resolve, reject) => {
		let query = { userId };

		if (notification_id) query.id = notification_id;

		model = model === "UserNotification" ? postgres.UserNotification : postgres.ManagerNotification;

		await model.update({ status: true }, { where: query });

		return resolve("Successful");
	});
}

async function readNotification(userId, notification_id) {
	let query = {};

	query.userId = userId;
	query.id = { [postgres.Op.in]: notification_id };

	await postgres.UserNotification.update({ status: true }, { where: query });
	return await postgres.UserNotification.findAll({ where: query });
}

function set(
	userId = null,
	title = "",
	description = "",
	tag = "",
	link = "",
	image = "",
	flash = false,
	model = "UserNotification",
) {
	return new Promise(async (resolve, reject) => {
		try {
			model = model === "UserNotification" ? postgres.UserNotification : postgres.ManagerNotification;

			await model.create({
				userId,
				title,
				description,
				tag,
				link,
				image,
				flash,
				status: false,
			});

			return resolve("Successful");
		} catch (e) {
			console.log(e);
			reject(e);
		}
	});
}

function addEvent(args, result, name, type) {
	return new Promise(async (resolve, reject) => {
		// if (name === events.users.add) set(null, "Create New User", "", "", "", "", true, "ManagerNotification");

		if (name === events.balance.irr)
			set(null, "Charge With IRR Gateway", "", "", "", "", true, "ManagerNotification");

		if (name === events.kyc.add) set(null, "Create New KYC", "", "", "", "", true, "ManagerNotification");

		if (name === events.withdraw.add) set(null, "Create New Withdraw", "", "", "", "", true, "ManagerNotification");

		resolve(true);
	});
}

/**
 * send web and push notification to user
 * @param {*} args
 * @param {*} result
 * @param {*} name
 * @param {*} type
 * @returns
 */
function addUserEvent(args, result, name, type) {
	return new Promise(async (resolve, reject) => {
		let { userId, assetId, amount, nftName, nftAmount } = args;

		if (!userId) return resolve(false);

		let user = await postgres.User.findOne({ where: { id: userId } });

		if (!user) return resolve(false);

		// let assetNetwork = await postgres.AssetNetwork.findOne({
		// 	where: { id: assetNetworkId },
		// 	nest: true,
		// 	include: [{ model: postgres.Asset, as: "asset" }],
		// });
		let asset;
		if (assetId)
			asset = await postgres.Asset.findOne({
				where: { id: assetId },
				raw: true,
			});

		if (name === events.withdraw.completed) {
			let msg = `Withdraw Request For ${amount} ${asset?.coin} is completed`;

			set(userId, msg, "", "", "", "", true, "UserNotification");

			//send push notification
			sendPushToToken(user, {}, { title: "Withdraw", body: msg });

			//send notice email or sms
			if (user.email) mail(user.email, null, "NOTICES", { title: "Withdraw", text: msg });
			//else sms.notice(user.mobile, msg);
		}

		if (name === events.deposit.add) {
			let msg = `Deposit Request For ${amount} ${asset?.coin} is completed`;

			set(userId, msg, "", "", "", "", true, "UserNotification");

			//send push notification
			sendPushToToken(user, {}, { title: "Deposit", body: msg });

			//send notice email or sms
			if (user.email) mail(user.email, null, "NOTICES", { title: "Deposit", text: msg });
			//	else sms.notice(user.mobile, msg);
		}

		if (name === events.card.purchase) {
			let msg = `Your bought ${nftName} with amount of ${nftAmount} ETH.`;
			set(userId, msg, "", "", "", "", true, "UserNotification");

			//send push notification
			sendPushToToken(user, {}, { title: "Card purchase", body: msg });

			//send notice email or sms
			if (user.email)
				mail(user.email, null, "NOTICES_CARD_PURCHASE", { nft_code: nftName, nft_amount: nftAmount });
			//	else sms.notice(user.mobile, msg);
		}

		resolve(true);
	});
}

/**
 * send web and push notification to user if withdraw request is rejected
 * @param {*} args
 * @param {*} result
 * @param {*} name
 * @param {*} type
 * @returns
 */
function addRejectEvent(args, result, name, type) {
	return new Promise(async (resolve, reject) => {
		let { userId, assetNetworkId, amount } = args;

		if (!userId) return resolve(false);

		let user = await postgres.User.findOne({ where: { id: userId } });

		if (!user) return resolve(false);

		let assetNetwork = await postgres.AssetNetwork.findOne({
			where: { id: assetNetworkId },
			nest: true,
			include: [{ model: postgres.Asset, as: "asset" }],
		});

		let msg = `Withdraw Request For ${amount} ${assetNetwork?.asset?.coin} is rejected!`;

		set(userId, msg, "", "", "", "", true, "UserNotification");

		//send push notification
		sendPushToToken(user, {}, { title: "Withdraw", body: msg });

		//send notice email or sms
		if (user.email) mail(user.email, null, "NOTICES", { title: "Withdraw", text: msg });
		else sms.notice(user.mobile, msg);

		resolve(true);
	});
}

function sendPushToToken(user, data = {}, notification = {}) {
	return new Promise(async (resolve, reject) => {
		let fcm = new FCM(config.get("services.pushNotification.serverKey"));

		if (!user.pushToken) return resolve();

		const message = {
			to: user.pushToken,
			collapse_key: "Mindmint",
			data: data,
			notification: notification,
		};

		fcm.send(message)
			.then((response) => {
				console.log("Successfully sent with response: ", response);

				resolve();
			})
			.catch((err) => {
				console.log("Something has gone wrong with firebase!", err);

				resolve();
			});
	});
}

function sendPushNotification(data) {
	return new Promise(async (resolve, reject) => {
		const { hasNft, noNft, pushTokens, isFocusing, title, body } = data;
		let tokens = [];

		if (pushTokens.length) {
			tokens = [...pushTokens];
		} else if (hasNft) {
			const users = await postgres.AssignedCard.findAll({
				attributes: ["userId"],
				include: [
					{
						model: postgres.User,
						where: {
							pushToken: { [postgres.Op.ne]: null },
						},
						attributes: ["pushToken"],
					},
				],
				group: ["userId", "user.id"],
			});

			for (let u of users) {
				tokens.push(u.user.dataValues.pushToken);
			}
		} else if (noNft) {
			const usersWithNft = [];

			const users = await postgres.AssignedCard.findAll({
				attributes: ["userId"],
				group: ["userId"],
				having: {
					userId: { [postgres.Op.ne]: null },
				},
			});

			for (let u of users) {
				usersWithNft.push(u.dataValues.userId);
			}

			const doc = await postgres.User.findAll({
				where: {
					pushToken: { [postgres.Op.ne]: null },
					id: { [postgres.Op.notIn]: usersWithNft },
				},
				attributes: ["pushToken"],
			});

			for (let d of doc) {
				tokens.push(d.dataValues.pushToken);
			}
		} else if (isFocusing) {
			const users = await postgres.MatchParticipant.findAll({
				where: {
					status: "OPEN",
				},
				include: [
					{
						model: postgres.User,
						attributes: ["pushToken"],
						where: {
							pushToken: { [postgres.Op.ne]: null },
						},
					},
				],
				attributes: ["userId"],
				group: ["userId", "user.id"],
			});

			for (let u of users) {
				tokens.push(u.user.dataValues.pushToken);
			}
		} else {
			const users = await postgres.User.findAll({
				where: {
					pushToken: { [postgres.Op.ne]: null },
				},
				attributes: ["pushToken"],
			});

			for (let u of users) {
				tokens.push(u.dataValues.pushToken);
			}
		}

		let fcm = new FCM(config.get("services.pushNotification.serverKey"));

		const message = {
			registration_ids: tokens,
			collapse_key: "Mindmint",
			data: {},
			notification: {
				title,
				body,
			},
		};

		fcm.send(message)
			.then((response) => {
				console.log("Successfully sent with response: ", response);

				resolve();
			})
			.catch((err) => {
				console.log("Something has gone wrong with firebase!", err);

				resolve();
			});
	});
}

module.exports = {
	get,
	changeStatus,
	sendPushToToken,
	updatePushToken,
	addRejectEvent,
	addUserEvent,
	addEvent,
	readNotification,
	sendPushNotification,
};
