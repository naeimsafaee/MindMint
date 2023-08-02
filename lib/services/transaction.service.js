/*
| Author : Mohammad Ali Ghazi
| Email  : mohamadalghazy@gmail.com
| Date   : Tue Sep 14 2021
| Time   : 2:55:46 PM
 */

const em = require("exact-math");
const { postgres } = require("../databases");
const walletService = require("./wallet.service");
const { NotFoundError, HumanError, InvalidRequestError, ConflictError } = require("./errorhandler");
const Errors = require("./errorhandler/MessageText");
const hooks = require("../hooks");
const { events } = require("../data/constans");
const axios = require("axios");
const { dateQueryBuilder } = require("../utils/dateQueryBuilder");
const walletConfig = require("config").get("clients.wallet");

/**
 *  Get user transactions Data and filter it by id, ...
 */
async function get(data) {
	let {
		id,
		type,
		status,
		info,
		asset,
		order,
		page,
		limit,
		sort,
		createdAt,
		user,
		amount,
		previousBalance,
		index,
		searchQuery,
		userId,
	} = data;

	let offset = 0 + (page - 1) * limit,
		query = {};
	let query2 = {};
	let query3 = {};

	if (id) query.id = id;
	if (type) query.type = { [postgres.Op.in]: type };

	if (status) query.status = { [postgres.Op.in]: status };
	if (asset) query3.name = { [postgres.Op.iLike]: `%${asset}%` };
	if (userId) query.userId = userId;
	if (info) query.info = { [postgres.Op.like]: `%${info}%` };
	else query.info = { [postgres.Op.or]: { [postgres.Op.ne]: "FEE", [postgres.Op.eq]: null } };

	if (user) query2.name = { [postgres.Op.iLike]: "%" + user + "%" };
	if (amount) query.amount = amount;
	if (previousBalance) query.previousBalance = previousBalance;
	if (index) query.index = index;

	if (createdAt) {
		const { start, end } = dateQueryBuilder(createdAt);
		query.createdAt = { [postgres.Op.gte]: start, [postgres.Op.lte]: end };
	}

	if (searchQuery) {
		query = {
			[postgres.Op.or]: [
				{ "$user.mobile$": { [postgres.Op.like]: "%" + searchQuery + "%" } },
				{ "$user.email$": { [postgres.Op.like]: "%" + searchQuery + "%" } },
				{ "$user.name$": { [postgres.Op.like]: "%" + searchQuery + "%" } },
				{ "$asset.name$": { [postgres.Op.like]: "%" + searchQuery + "%" } },
				{ "$asset.coin$": { [postgres.Op.like]: "%" + searchQuery + "%" } },
			],
		};
	}

	let result = await postgres.UserTransaction.findAndCountAll({
		where: query,
		offset,
		limit,
		order: [[sort, order]],
		nest: true,
		include: [
			{
				model: postgres.User,
				where: query2,
				require: true,
				as: "user",
				attributes: { exclude: ["password", "salt"] },
			},
			{
				model: postgres.Asset,
				where: query3,
				as: "asset",
			},
		],
		raw: true,
	});

	return {
		total: result.count,
		pageSize: limit,
		page,
		data: result.rows,
	};
}

/**
 *  Get finantial report based on asset
 */
async function getFinantialReport(data) {
	let { type, status, info, asset, order, page, limit, sort, user, userId, fromDate, toDate } = data;

	let offset = 0 + (page - 1) * limit,
		query = {};
	let query2 = {};
	let query3 = {};

	if (type) query.type = { [postgres.Op.in]: type };
	if (fromDate) query.createdAt = { [postgres.Op.gte]: fromDate };
	if (toDate) query.createdAt = { [postgres.Op.lte]: toDate };

	if (status) query.status = { [postgres.Op.in]: status };
	if (asset) query3.name = { [postgres.Op.iLike]: `%${asset}%` };
	if (userId) query.userId = userId;
	if (info) query.info = { [postgres.Op.like]: `%${info}%` };
	else query.info = { [postgres.Op.or]: { [postgres.Op.ne]: "FEE", [postgres.Op.eq]: null } };

	if (user) query2.name = { [postgres.Op.iLike]: "%" + user + "%" };

	let result = await postgres.UserTransaction.findAndCountAll({
		attributes: [
			"userId",
			"assetId",
			"type",
			[postgres.sequelize.fn("sum", postgres.sequelize.col("amount")), "totalAmount"],
		],
		group: ["userId", "user.id", "asset.id", "assetId", "userTransaction.type"],
		where: query,
		offset,
		limit,
		// order: [[sort, order]],
		nest: true,
		include: [
			{
				model: postgres.User,
				where: query2,
				require: true,
				as: "user",
				attributes: ["id", "name", "email"],
			},
			{
				model: postgres.Asset,
				where: query3,
				attributes: ["id", "name", "coin", "icon"],
				as: "asset",
			},
		],
		raw: true,
	});

	return {
		total: result.rows.length,
		pageSize: limit,
		page,
		data: result.rows,
	};
}

async function edit(id, status, index, io) {
	let transaction = await postgres.UserTransaction.findOne({
		where: { id, status: "AUDITING" },
		include: [
			{
				model: postgres.AssetNetwork,
				as: "assetNetworks",
				include: [
					{ model: postgres.Asset, as: "asset" },
					{ model: postgres.Network, as: "network" },
				],
			},
		],
	});

	if (!transaction) throw new HumanError("Already edited", 400);

	try {
		if (status === "PENDING") {
			let { amount, fee, gasPrice, gasLimit, address, tag } = transaction;

			let body = {
				currency: transaction?.assetNetworks?.apiCode,
				paymentId: id,
				amount: +amount,
				fee: +fee,
				gasPrice: 5,
				gasLimit: 400000, //+gasLimit,
				address,
				index,
				clientId: 1,
			};

			if (tag && tag.length) body.tag = tag;

			const res = await walletService.postWithdrawRequest(body);

			transaction.index = index;
			transaction.txid = res?.txId;
		} else if (status === "REJECTED") {
			let wallet = await postgres.UserWallet.findOne({
				where: { userId: transaction?.userId, assetId: transaction?.assetNetworks?.asset?.id },
			});

			const totalAmount = em.add(+transaction?.amount, +transaction?.withdrawFee);
			wallet.pending = em.sub(+wallet.pending, totalAmount);
			wallet.amount = em.add(+wallet.amount, totalAmount);
			await wallet.save();

			hooks.trigger([events.withdraw.reject], "after", transaction);
		}

		transaction.status = status;
		await transaction.save();
	} catch (err) {
		throw err;
	}

	return "Successful";
}

/**
 * get user transaction by id
 * @param {*} id
 * @returns
 */
function getById(id) {
	return new Promise(async (resolve, reject) => {
		let result = await postgres.UserTransaction.findOne({
			where: { id },
			include: [
				{
					model: postgres.AssetNetwork,
					as: "assetNetworks",
					include: [
						{
							model: postgres.Asset,
							as: "asset",
						},
						{
							model: postgres.Network,
							as: "network",
						},
					],
				},
				{ model: postgres.User, as: "user", attributes: { exclude: ["password", "salt"] } },
			],
		});

		if (!result)
			return reject(
				new NotFoundError(Errors.TRANSACTION_NOT_FOUND.MESSAGE, Errors.TRANSACTION_NOT_FOUND.CODE, { id }),
			);

		return resolve(result);
	});
}

function getBalances(query) {
	return new Promise(async (resolve, reject) => {
		const { assetNetworkId, index } = query;

		let assetNetwork = await postgres.AssetNetwork.findByPk(assetNetworkId);

		let {
			data: { data },
		} = await axios.get(`${walletConfig.url}/api/v1/wallet`, { headers: { "x-api-key": walletConfig.apiKey } });

		if ((assetNetworkId && !assetNetwork) || !data?.length)
			return reject(new NotFoundError(Errors.TRANSACTION_NOT_FOUND.MESSAGE, Errors.TRANSACTION_NOT_FOUND.CODE));

		return resolve(
			data.filter(
				(item) =>
					(assetNetwork ? assetNetwork.apiCode == item.currency : true) &&
					(index ? item.index == index : true) &&
					item.balance > 0,
			),
		);
	});
}

function getSwaps(data) {
	return new Promise(async (resolve, reject) => {
		let {
			id,
			page,
			limit,
			user,
			assetIn,
			assetOut,
			balanceIn,
			amountOut,
			fee,
			txId,
			// fromDate,
			// toDate,
			sort,
			order,
			createdAt,
			searchQuery,
			userId,
		} = data;

		let offset = (parseInt(page) - 1) * parseInt(limit),
			query = {};
		let query2 = {};
		let query3 = {};
		let query4 = {};

		if (searchQuery)
			query = {
				[postgres.Op.or]: [
					//	{ title: { [postgres.Op.like]: "%" + searchQuery + "%" } },
					{ "$user.name$": { [postgres.Op.like]: "%" + searchQuery + "%" } },
					{ "$user.email$": { [postgres.Op.like]: "%" + searchQuery + "%" } },
					{ "$user.mobile$": { [postgres.Op.like]: "%" + searchQuery + "%" } },
					{ "$assetIn.name$": { [postgres.Op.like]: "%" + searchQuery + "%" } },
					{ "$assetIn.coin$": { [postgres.Op.like]: "%" + searchQuery + "%" } },
					{ "$assetOut.name$": { [postgres.Op.like]: "%" + searchQuery + "%" } },
					{ "$assetOut.coin$": { [postgres.Op.like]: "%" + searchQuery + "%" } },
				],
			};

		if (id) query.id = id;
		if (txId) query.txId = { [postgres.Op.like]: "%" + txId + "%" };
		if (fee) query.fee = fee;
		if (createdAt) query.createdAt = createdAt;

		if (userId) query.userId = userId;

		if (user)
			query[postgres.Op.or] = [
				{ "$user.name$": { [postgres.Op.iLike]: `%${user}%` } },
				{ "$user.email$": { [postgres.Op.iLike]: `%${user}%` } },
			];
		// if (user)
		//            query2.email = { [postgres.Op.iLike]: "%" + userId + "%" };
		//

		if (assetIn) {
			query3 = {
				[postgres.Op.or]: [
					{ coin: { [postgres.Op.iLike]: "%" + assetIn + "%" } },
					{ name: { [postgres.Op.iLike]: "%" + assetIn + "%" } },
				],
			};
		}

		if (assetOut) {
			query4 = {
				[postgres.Op.or]: [
					{ coin: { [postgres.Op.iLike]: "%" + assetOut + "%" } },
					{ name: { [postgres.Op.iLike]: "%" + assetOut + "%" } },
				],
			};
		}

		if (balanceIn) query.balanceIn = balanceIn;
		if (amountOut) query.amountOut = amountOut;

		// if (fromDate || toDate) query.createdAt = {};
		// if (fromDate) query.createdAt[postgres.Op.gte] = fromDate;
		// if (toDate) query.createdAt[postgres.Op.lte] = toDate;

		let result = await postgres.SwapTransaction.findAll({
			where: query,
			offset,
			limit,
			order: [[sort, order]],
			include: [
				{
					model: postgres.User,
					as: "user",
					require: true,
					where: query2,
					attributes: { exclude: ["password", "salt"] },
				},
				{
					model: postgres.Asset,
					as: "assetIn",
					require: true,
					where: query3,
				},
				{
					model: postgres.Asset,
					as: "assetOut",
					require: true,
					where: query4,
				},
			],
		});

		return resolve({
			total: result.length,
			pageSize: limit,
			page,
			data: result,
		});
	});
}

module.exports = {
	get,
	getFinantialReport,
	edit,
	getById,
	getBalances,
	getSwaps,
};
