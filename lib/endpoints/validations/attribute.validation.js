const Joi = require("joi");

const addAttribute = {
	body: {
		cardTypeId: Joi.number().required(),
		name: Joi.string().valid("DOPAMINE", "SEROTONIN", "ANXIETY", "DAMAGE", "LEVEL").required(),
		type: Joi.string().valid("INITIAL", "FEE", "REWARD").required(),
		amount: Joi.number(),
	},
};

const editAttribute = {
	body: {
		id: Joi.number().required(),
		cardTypeId: Joi.number(),
		name: Joi.string().valid("DOPAMINE", "SEROTONIN", "ANXIETY", "DAMAGE", "LEVEL"),
		type: Joi.string().valid("INITIAL", "FEE", "REWARD"),
		amount: Joi.number(),
	},
};

const deleteAttribute = {
	params: {
		id: Joi.number().required(),
	},
};

const getAttribute = {
	params: {
		id: Joi.number().required(),
	},
};

const getAttributes = {
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		sort: Joi.string().default("id"),
		order: Joi.string().valid("ASC", "DESC").default("DESC"),
		cardTypeId: Joi.string(),
	},
};

const getAttributeByManager = {
	params: {
		id: Joi.number().required(),
	},
};

const getAttributesByManager = {
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		sort: Joi.string().default("id"),
		order: Joi.string().valid("ASC", "DESC").default("DESC"),
		createdAt: Joi.date(),
		searchQuery: Joi.string(),
		id: Joi.string(),
		name: Joi.array().items(Joi.valid("DOPAMINE", "SEROTONIN", "ANXIETY", "DAMAGE")),
		type: Joi.array().items(Joi.valid("INITIAL", "FEE", "REWARD")),
		status: Joi.array().items(Joi.valid("ACTIVE", "INACTIVE")),
		amount: Joi.string(),
		cardTypeId: Joi.array(),
		cardType: Joi.string(),
	},
};

const getUserAttribute = {
	params: {
		id: Joi.number().required(),
	},
};

const getUserAttributes = {
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		sort: Joi.string().default("id"),
		order: Joi.string().valid("ASC", "DESC").default("DESC"),
		createdAt: Joi.date(),
		searchQuery: Joi.string(),
		id: Joi.string(),
	},
};

const getUserAttributeByManager = {
	params: {
		id: Joi.number().required(),
	},
};

const getUserAttributesByManager = {
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		sort: Joi.string().default("id"),
		order: Joi.string().valid("ASC", "DESC").default("DESC"),
		attribute: Joi.array().items(Joi.valid("DOPAMINE", "SEROTONIN", "ANXIETY", "DAMAGE" , "LEVEL")),
		type: Joi.array().items(Joi.valid("INITIAL", "FEE", "REWARD", "BOX")),
		createdAt: Joi.date(),
		searchQuery: Joi.string(),
		id: Joi.string(),
		userId: Joi.string(),
		userName: Joi.string(),
		cardTypeId: Joi.array(),
		amount: Joi.string(),
	},
};

module.exports = {
	addAttribute,
	editAttribute,
	deleteAttribute,
	getAttribute,
	getAttributes,
	getAttributeByManager,
	getAttributesByManager,
	getUserAttribute,
	getUserAttributes,
	getUserAttributeByManager,
	getUserAttributesByManager,
};
