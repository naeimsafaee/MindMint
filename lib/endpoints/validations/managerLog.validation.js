const Joi = require("joi");

const getManagerLogs = {
	query: {
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		sort: Joi.string().default("id"),
		id: Joi.number().min(1),
		managerId: Joi.number().min(1),
		action: Joi.string(),
		email: Joi.string().email(),
		userName: Joi.string(),
		fromDate: Joi.date(),
		toDate: Joi.date(),
	},
};

const getManagerLogById = {
	params: {
		id: Joi.number().required(),
	},
};

module.exports = {
	getManagerLogs,
	getManagerLogById,
};
