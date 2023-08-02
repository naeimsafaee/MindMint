/*
| Author : Mohammad Ali Ghazi
| Email  : mohamadalghazy@gmail.com
| Date   : Wed Apr 20 2022
| Time   : 11:36:07 AM
 */

const Joi = require("joi");

const login = {
	body: {
		mobile: Joi.string().min(8).max(20),
		email: Joi.string().email(),
		password: Joi.string()
			.regex(/^(?=.*?[a-z])(?=.*?[0-9]).{8,64}$/)
			.required(),
	},
};

const statistic = {
	query: {
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
	},
};

const statisticDetails = {
	query: {
		userId: Joi.number().min(1).required(),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
	},
};

module.exports = {
	login,
	statistic,
	statisticDetails,
};
