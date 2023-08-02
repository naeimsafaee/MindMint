/*
| Author : Mohammad Ali Ghazi
| Email  : mohamadalghazy@gmail.com
| Date   : Wed Sep 08 2021
| Time   : 7:12:20 PM
 */

const Joi = require("joi");

// const searchFee = {
//     body: {
//         id: Joi.number().min(1),
//         page: Joi.number().min(1).default(1),
//         limit: Joi.number().min(1).max(100).default(10),
//         order: Joi.valid('DESC', 'ASC').default('DESC'),
//         userType: Joi.array().items(Joi.valid("NORMAL", "VIP")),
//         userLevel: Joi.number(),
//         minTradesVolume: Joi.number(),
//         makerFee: Joi.number(),
//         takerFee: Joi.number(),
//         depositFee: Joi.number(),
//         withdrawFee: Joi.number(),
//         referralReward: Joi.number()
//     }
// }

const getAll = {
	query: {
		id: Joi.number().min(1),
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		userType: Joi.array().items(Joi.valid("NORMAL", "AGENT")),
		userLevel: Joi.number(),
		userCount: Joi.number().min(0),
		targetPrice: Joi.number().min(0),
		reward: Joi.number().min(0),
		depositFee: Joi.number(),
		withdrawFee: Joi.number(),
		referralReward: Joi.number(),
		sort: Joi.string().default("id"),
	},
};

const addFees = {
	body: {
		userType: Joi.valid("NORMAL", "VIP").required(),
		userLevel: Joi.number().required(),
		depositFee: Joi.number().required(),
		withdrawFee: Joi.number().required(),
		referralReward: Joi.number().required(),
	},
};

const editFees = {
	body: {
		id: Joi.number().required(),
		userType: Joi.valid("NORMAL", "VIP"),
		userLevel: Joi.number(),
		depositFee: Joi.number(),
		withdrawFee: Joi.number(),
		referralReward: Joi.number(),
	},
};

const feeById = {
	params: {
		id: Joi.number().min(1).required(),
	},
};

module.exports = {
	// searchFee,
	addFees,
	editFees,
	feeById,
	getAll,
};
