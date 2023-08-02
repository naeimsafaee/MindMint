/*
| Author : Mohammad Ali Ghazi
| Email  : mohamadalghazy@gmail.com
| Date   : Sun Dec 12 2021
| Time   : 1:50:27 PM
 */

const Joi = require("joi");

// const getTransactions = {
// 	query: {
// 		id: Joi.number().min(1),
// 		page: Joi.number().min(1).default(1),
// 		limit: Joi.number().min(1).max(100).default(10),
// 		userId: Joi.number().min(1),
// 		assetNetworkId: Joi.number().min(1),
// 		assetId: Joi.number().min(1),
// 		type: Joi.array().items(Joi.valid("WITHDRAW", "DEPOSIT", "TRANSFER")),
// 		status: Joi.array().items(Joi.valid("AUDITING", "PENDING", "REJECTED", "DONE")),
// 		address: Joi.string(),
// 		tag: Joi.string(),
// 		txid: Joi.string(),
// 		info: Joi.string(),
// 		order: Joi.valid("DESC", "ASC").default("DESC"),
// 		fromDate: Joi.date().timestamp(),
// 		toDate: Joi.date().timestamp(),
// 	},
// };

const get = {
	query: {
		id: Joi.number().min(1),
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		type: Joi.array().items(Joi.valid("WITHDRAW", "DEPOSIT", "SWAP")),
		status: Joi.array().items(Joi.valid("AUDITING", "PENDING", "REJECTED", "DONE")),
		asset: Joi.string(),
		order: Joi.valid("DESC", "ASC", "asc", "desc").default("DESC"),
		sort: Joi.string().default("id"),
		createdAt: Joi.date(),
		user: Joi.string(),
		userId: Joi.number(),
		amount: Joi.number().min(1),
		previousBalance: Joi.number().min(1),
		index: Joi.number().min(0),
		searchQuery: Joi.string().allow(null, ""),
	},
};

const getFinantialReport = {
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		type: Joi.array().items(Joi.valid("WITHDRAW", "DEPOSIT")),
		status: Joi.array().items(Joi.valid("AUDITING", "PENDING", "REJECTED", "DONE")),
		asset: Joi.string(),
		order: Joi.valid("DESC", "ASC", "asc", "desc").default("DESC"),
		sort: Joi.string().default("id"),
		user: Joi.string(),
		userId: Joi.number(),
		fromDate: Joi.date(),
		toDate: Joi.date(),
	},
};

// const search = {
//     body: {
//         id: Joi.number().min(1),
//         page: Joi.number().min(1).default(1),
//         limit: Joi.number().min(1).max(100).default(10),
//         userId: Joi.number().min(1),
//         assetNetworkId: Joi.number().min(1),
//         type: Joi.array().items(Joi.valid("WITHDRAW", "DEPOSIT")),
//         status: Joi.array().items(Joi.valid("AUDITING", "PENDING", "REJECTED", "DONE")),
//         address: Joi.string(),
//         tag: Joi.string(),
//         txid: Joi.string(),
//         info: Joi.string(),
//         order: Joi.valid('DESC', 'ASC').default('DESC'),
//         fromDate: Joi.date().timestamp(),
//         toDate: Joi.date().timestamp(),
//     }
// }

const edit = {
	body: {
		id: Joi.number().required(),
		status: Joi.valid("AUDITING", "PENDING", "REJECTED", "DONE"),
		index: Joi.number().integer().min(0),
	},
};

const getById = {
	params: {
		id: Joi.number().required(),
	},
};

const getSwaps = {
	query: {
		id: Joi.number().min(1),
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		user: Joi.string(),
		assetIn: Joi.string(),
		assetOut: Joi.string(),
		balanceIn: Joi.string(),
		amountOut: Joi.string(),
		fee: Joi.string(),
		txId: Joi.string(),
		sort: Joi.string().default("createdAt"),
		order: Joi.string().default("DESC"),
		createdAt: Joi.string(),
		searchQuery: Joi.string(),
		userId: Joi.number(),
	},
};

module.exports = {
	// getTransactions,
	get,
	getFinantialReport,
	edit,
	// search,
	getById,
	getSwaps,
};
