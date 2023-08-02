/*
| Author : Mohammad Ali Ghazi
| Email  : mohamadalghazy@gmail.com
| Date   : Fri Dec 17 2021
| Time   : 11:32:32 AM
 */

const Joi = require("joi");

const getPrizes = {
	query: {
		status: Joi.valid("ACTIVE", "INACTIVE"),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		id: Joi.number(),
		title: Joi.string(),
		createdAt: Joi.date(),
		searchQuery: Joi.string().allow(null, ""),
		sort: Joi.string().default("id"),
		type: Joi.valid("CHALLENGE"),
		cardTypeId: Joi.array(),
		cardTypeName: Joi.string(),
		asset: Joi.string(),
		tier: Joi.string(),
		amount: Joi.number(),
	},
};

const getPrize = {
	params: {
		id: Joi.number().min(1),
	},
};

const getTokenPrizes = {
	query: {
		status: Joi.array().items(Joi.valid("ACTIVE", "INACTIVE")),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		id: Joi.number(),
		createdAt: Joi.date(),
		sort: Joi.string().default("id"),
		cardTypeId: Joi.array(),
		cardTypeName: Joi.string(),
		asset: Joi.string(),
		amount: Joi.number(),
		assetId: Joi.number().min(1),
	},
};

const getTokenPrize = {
	params: {
		id: Joi.number().min(1),
	},
};

const addPrize = {
	body: {
		title: Joi.string().required(),
		tier: Joi.string().required(),
		amount: Joi.number().required(),
		assetId: Joi.number().required(),
		cardTypeId: Joi.number().required(),
	},
};

const addTokenPrize = {
	body: {
		cardTypeId: Joi.number().min(1).required(),
		assetId: Joi.number().min(1).required(),
		amount: Joi.number().required(),
		status: Joi.valid("ACTIVE", "INACTIVE").default("ACTIVE"),
	},
};

const editPrize = {
	params: {
		id: Joi.number().required(),
	},
	body: {
		title: Joi.string().required(),
		tier: Joi.string().required(),
		amount: Joi.number().required(),
		assetId: Joi.number().required(),
		cardTypeId: Joi.number().required(),
	},
};

const editTokenPrize = {
	params: {
		id: Joi.number().required(),
	},
	body: {
		cardTypeId: Joi.number().min(1),
		assetId: Joi.number().min(1),
		amount: Joi.number(),
		status: Joi.valid("ACTIVE", "INACTIVE"),
	},
};

const delPrize = {
	params: {
		id: Joi.number().required(),
	},
};

const getPrizePools = {
	query: {
		prizeId: Joi.number().min(1),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		createdAt: Joi.date(),
		id: Joi.number(),
		amount: Joi.number(),
		tier: Joi.string(),
		type: Joi.string(),
		price: Joi.string(),
		searchQuery: Joi.string().allow(null, ""),
		sort: Joi.string().default("id"),
		assetId: Joi.number(),
	},
};

const getPrizePool = {
	params: {
		id: Joi.number().min(1),
	},
};

const addPrizePool = {
	body: {
		prizeId: Joi.number().min(1).required(),
		tier: Joi.string().required(),
		cardTypeId: Joi.number().min(1),
		cardTierId: Joi.number().min(1),
		amount: Joi.number(),
		number: Joi.number(),
		assetId: Joi.number(),
	},
};

const editPrizePool = {
	body: {
		id: Joi.number().required(),
		prizeId: Joi.number().min(1),
		tier: Joi.string(),
		cardTypeId: Joi.number().min(1),
		cardTierId: Joi.number().min(1),
		amount: Joi.number(),
		number: Joi.number(),
		assetId: Joi.number().min(1),
	},
};

const delPrizePool = {
	params: {
		id: Joi.number().required(),
	},
};

const getUserPrizeManager = {
	query: {
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		id: Joi.number(),
		createdAt: Joi.date(),
		searchQuery: Joi.string().allow(null, ""),
		sort: Joi.string().default("id"),
		cardTypeId: Joi.number().min(1),
		cardTierId: Joi.number().min(1),
		amount: Joi.number(),
		cardNumber: Joi.number(),
		userId: Joi.number(),
		assetId: Joi.number().min(1),
		asset: Joi.string(),
		type: Joi.string(),
		tier: Joi.string(),
		user: Joi.string(),
	},
};

module.exports = {
	getPrizes,
	getPrize,
	addPrize,
	editPrize,
	delPrize,
	getPrizePools,
	getPrizePool,
	addPrizePool,
	editPrizePool,
	delPrizePool,
	getUserPrizeManager,
	getTokenPrizes,
	addTokenPrize,
	editTokenPrize,
	getTokenPrize,
};
