/*
| Author : Mohammad Ali Ghazi
| Email  : mohamadalghazy@gmail.com
| Date   : Sat Dec 04 2021
| Time   : 11:48:00 AM
 */

const Joi = require("joi");

const depositRequest = {
	body: {
		assetNetworkId: Joi.number().integer().min(1).required(),
	},
};

const createUsersWallet = {
	body: {
		assetNetworkId: Joi.number().integer().min(1).required(),
	},
};

const depositList = {
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(10).max(100).default(10),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		assetNetworkId: Joi.number().integer().min(1),
		address: Joi.string(),
		tag: Joi.string(),
		status: Joi.array().valid(Joi.valid("AUDITING", "PENDING", "REJECTED", "DONE")),
		txid: Joi.string(),
		info: Joi.string(),
		account: Joi.valid("ALGOTREX"),
		assetId: Joi.number().integer().min(1),
		index: Joi.number().integer().min(0),
	},
	params: {
		id: Joi.number().integer().min(1),
	},
};

const confirmWithdraw = {
	body: {
		token: Joi.string().max(300).required(),
		code: Joi.string().length(4).required(),
	},
};

const withdrawRequest = {
	body: {
		id: Joi.number().positive().required(),
		address: Joi.string()
			.regex(/^0x[a-fA-F0-9]{40}$/)
			.message(" is not valid")
			.required(),
		amount: Joi.number().positive().required(),
		tag: Joi.string(),
		from_agent_panel: Joi.boolean(),
		save: Joi.boolean().default(false),
	},
};

const createSwap = {
	body: {
		assetId: Joi.number().min(1),
		baseId: Joi.number().min(1),
		amount: Joi.number(),
		slippage: Joi.number().min(0).max(50),
		chainId: Joi.number().valid(1, 56).required(),
	},
};

const getSwapRate = {
	query: {
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
	},
};

const getAddress = {
	body: {
		assetId: Joi.number().positive().required(),
		networkId: Joi.number().positive().required(),
	},
};

const getAssetSingle = {
	params: {
		id: Joi.number().required(),
	},
};

module.exports = {
	depositRequest,
	depositList,
	confirmWithdraw,
	withdrawRequest,
	createSwap,
	getSwapRate,
	getAddress,
	getAssetSingle,
	createUsersWallet,
};
