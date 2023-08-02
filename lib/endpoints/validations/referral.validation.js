const Joi = require("joi");

const referralRewards = {
	query: {
		id: Joi.number().min(1),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		sort: Joi.string().default("id"),
		createdAt: Joi.date(),

		type: Joi.string().valid("SUBSCRIPTION", "TICKET"),
		user: Joi.string(),
		referredUser: Joi.string(),
	},
};

module.exports = {
	referralRewards,
};
