const Joi = require("joi");

const getTokensByManager = {
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		sort: Joi.string().default("id"),
		order: Joi.string().valid("ASC", "DESC").default("DESC"),
		id: Joi.number().min(1),
		createdAt: Joi.date(),
		searchQuery: Joi.string().allow(null, ""),
	},
};

const getTokenByManager = {
	params: {
		id: Joi.number().required(),
	},
};

module.exports = {
	getTokensByManager,
	getTokenByManager,
};
