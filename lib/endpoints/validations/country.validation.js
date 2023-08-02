const Joi = require("joi");

const getOneCountry = {
	params: {
		id: Joi.number().required(),
	},
};

const getAllCountry = {
	query: {
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		sort: Joi.string().default("createdAt"),
		name: Joi.string(),
	},
};

module.exports = {
	getOneCountry,
	getAllCountry,
};
