/*
| Author : Mohammad Ali Ghazi
| Email  : mohamadalghazy@gmail.com
| Date   : Fri Dec 17 2021
| Time   : 12:01:57 AM
 */

const { postgres } = require("../../../databases");
const { NotFoundError, HumanError } = require("../../errorhandler");
const Errors = require("../../errorhandler/MessageText");
const { InvalidRequestError } = require("../../errorhandler");
const { dateQueryBuilder } = require("../../../utils/dateQueryBuilder");

async function getPrizes(data) {
	const {
		page,
		limit,
		order,
		id,
		title,
		createdAt,
		sort,
		searchQuery,
		asset,
		cardTypeId,
		cardTypeName,
		tier,
		amount,
	} = data;
	let query = {};
	let query1 = {};

	if (id) query.id = id;
	if (tier) query.tier = tier;
	if (title) query.title = { [postgres.Op.in]: title };
	if (parseFloat(amount) >= 0) query.amount = amount;
	if (cardTypeName) query1.name = cardTypeName;
	if (cardTypeId) query.cardTypeId = { [postgres.Op.in]: cardTypeId };
	if (asset) query["$asset.name$"] = { [postgres.Op.iLike]: "%" + asset + "%" };

	if (createdAt) {
		const { start, end } = dateQueryBuilder(createdAt);
		query.createdAt = { [postgres.Op.gte]: start, [postgres.Op.lte]: end };
	}

	if (searchQuery) {
		query = {
			[postgres.Op.or]: [{ title: { [postgres.Op.like]: "%" + searchQuery + "%" } }],
		};
	}
	let result = await postgres.Prize.findAndCountAll({
		where: query,
		include: [
			{
				model: postgres.CardType,
				where: query1,
			},
			{
				model: postgres.Asset,
			},
		],
		limit: limit,
		offset: (page - 1) * limit,
		order: [["amount", "DESC"]],
	});

	return {
		total: result.count,
		pageSize: limit,
		page,
		data: result.rows,
	};
}

/**
 * get Prize
 */
async function getPrize(id) {
	let result = await postgres.Prize.findOne({
		where: { id },
		include: [
			{
				model: postgres.CardType,
			},
			{
				model: postgres.Asset,
			},
		],
	});

	return result;
}

/**
 * add Prize
 */
async function addPrize(title, tier, amount, assetId, cardTypeId) {
	const asset = await postgres.Asset.findOne({ where: { id: assetId } });
	if (!asset) return new HumanError("the asset does not exist", 400);

	const cardType = await postgres.CardType.findOne({ where: { id: cardTypeId } });
	if (!cardType) return new HumanError("the cardType does not exist", 400);

	return await postgres.Prize.create({ title, tier, amount, assetId, cardTypeId });
}

/**
 * update Prize
 */
async function editPrize(id, title, tier, amount, assetId, cardTypeId) {
	const asset = await postgres.Asset.findOne({ where: { id: assetId } });
	if (!asset) return new InvalidRequestError("the asset does not exist", 400);

	const cardType = await postgres.CardType.findOne({ where: { id: cardTypeId } });
	if (!cardType) return new HumanError("the cardType does not exist", 400);

	let update = {};

	if (title) update.title = title;
	if (tier) update.tier = tier;
	if (amount) update.amount = amount;
	if (assetId) update.assetId = assetId;
	if (cardTypeId) update.cardTypeId = cardTypeId;
	await postgres.Prize.update(update, { where: { id } });

	return await postgres.Prize.findOne({
		where: { id: id },
		include: [
			{
				model: postgres.CardType,
			},
			{
				model: postgres.Asset,
			},
		],
	});
}

/**
 * delete Prize
 */
async function delPrize(id) {
	let result = await postgres.Prize.destroy({ where: { id } });

	if (!result) return reject(new HumanError(Errors.DELETE_FAILED.MESSAGE, Errors.DELETE_FAILED.CODE, { id: id }));

	return "Successful";
}

/**
 * get user Prize list
 */
function getUserPrize(userId, PrizeId, cardTypeId, cardTierId, page, limit, order) {
	return new Promise(async (resolve, reject) => {
		let query = {};

		if (PrizeId) query.PrizeId = PrizeId;

		if (userId) query.userId = userId;

		if (cardTypeId) query.cardTypeId = cardTypeId;

		if (cardTierId) query.cardTierId = cardTierId;

		let result = await postgres.UserPrize.findAndCountAll({
			where: query,
			limit: limit,
			offset: (page - 1) * limit,
			order: [["createdAt", order]],
		});

		resolve({
			total: result.count,
			pageSize: limit,
			page,
			data: result.rows,
		});
	});
}

/**
 * get user Prize list manager from model userPrize
 * @param {*} data
 * @returns
 */
function getUserPrizeManager(data) {
	return new Promise(async (resolve, reject) => {
		const {
			id,
			page,
			limit,
			searchQuery,
			order,
			sort,
			userId,
			cardTypeId,
			cardTierId,
			amount,
			cardNumber,
			tier,
			user,
			asset,
			type,
		} = data;

		let query = {};

		if (id) query.id = id;
		if (userId) query.userId = userId;
		if (tier) query.tier = tier;
		if (cardTypeId) query.cardTypeId = cardTypeId;
		if (cardTierId) query.cardTierId = cardTierId;
		if (amount) query.amount = amount;
		if (cardNumber) query.cardNumber = cardNumber;

		let query2 = {};
		let query3 = {};
		let query6 = {};
		let query7 = {};

		if (user) query6.name = { [postgres.Op.iLike]: "%" + user + "%" };
		if (tier) query2.title = { [postgres.Op.iLike]: "%" + tier + "%" };
		if (type) query3.title = { [postgres.Op.iLike]: "%" + type + "%" };
		if (asset) query7.name = { [postgres.Op.iLike]: "%" + asset + "%" };

		if (searchQuery) {
			query = {
				[postgres.Op.or]: [
					//	{ title: { [postgres.Op.like]: "%" + searchQuery + "%" } },
					{ "$cardTier.title$": { [postgres.Op.like]: "%" + searchQuery + "%" } },
					{ "$cardType.title$": { [postgres.Op.like]: "%" + searchQuery + "%" } },
				],
			};
		}

		let result = await postgres.UserPrize.findAndCountAll({
			where: query,
			limit: limit,
			offset: (page - 1) * limit,
			order: [[sort, order]],
			include: [
				{
					where: query3,
					model: postgres.CardType,
				},
				{
					where: query7,
					model: postgres.Asset,
				},
				{
					where: query6,
					model: postgres.User,
				},
			],
		});

		resolve({
			total: result.count,
			pageSize: limit,
			page,
			data: result.rows,
		});
	});
}

module.exports = {
	getPrizes,
	getPrize,
	addPrize,
	editPrize,
	delPrize,
	getUserPrizeManager,
};
