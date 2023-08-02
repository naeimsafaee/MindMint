const Joi = require("joi");

const addCardType = {
	body: {
		name: Joi.string().required(),
		price: Joi.number(),
		status: Joi.valid("ACTIVE", "INACTIVE").default("ACTIVE"),
		swapConstant: Joi.number().min(0),
	},
};

const editCardType = {
	body: {
		id: Joi.number().required(),
		name: Joi.string(),
		price: Joi.number(),
		status: Joi.valid("ACTIVE", "INACTIVE"),
		swapConstant: Joi.number().min(0),
	},
};

const deleteCardType = {
	params: {
		id: Joi.number().required(),
	},
};

const getCardType = {
	params: {
		id: Joi.number().required(),
	},
};

const getCardTypes = {
	query: {
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("ASC"),
		sort: Joi.string().default("order").valid("createdAt", "updatedAt", "id", "name", "status", "order"),
		searchQuery: Joi.string().allow(null, ""),
		createdAt: Joi.date(),
		id: Joi.number().min(1),
		name: Joi.string(),
		status: Joi.array().items(Joi.string().valid("ACTIVE", "INACTIVE")),
	},
};

const getCardTypeByManager = {
	params: {
		id: Joi.number().required(),
	},
};

const getCardTypesByManager = {
	query: {
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		sort: Joi.string().default("id").valid("createdAt", "updatedAt", "id", "name", "status"),
		searchQuery: Joi.string().allow(null, ""),
		createdAt: Joi.date(),
		id: Joi.number().min(1),
		name: Joi.string(),
		price: Joi.number(),
		status: Joi.array().items(Joi.string().valid("ACTIVE", "INACTIVE")),
		swapConstant: Joi.number().min(0),
	},
};

module.exports = {
	addCardType,
	editCardType,
	deleteCardType,
	getCardType,
	getCardTypes,
	getCardTypeByManager,
	getCardTypesByManager,
};
