/*
| Author : Mohammad Ali Ghazi
| Email  : mohamadalghazy@gmail.com
| Date   : Sun Dec 05 2021
| Time   : 1:47:16 PM
 */

const Joi = require("joi");

const login = {
	body: {
		email: Joi.string().email().required(),
		password: Joi.string()
			// .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,64}$/)
			.required(),
	},
};

const checkManagerLoginCode = {
	body: {
		email: Joi.string().email().required(),
		code: Joi.number().required(),
	},
};

const verify = {
	body: {
		token: Joi.string().max(500).required(),
		code: Joi.string().length(4).required(),
	},
};

const forgetPassword = {
	body: {
		mobile: Joi.string().min(8).max(20),
		email: Joi.string().email(),
	},
};

const resetPassword = {
	body: {
		token: Joi.string().max(500).required(),
		password: Joi.string()
			.regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,64}$/)
			.required(),
	},
};

///////////////////////////////// Setting CRUD /////////////////////////////////////////////////
const addSetting = {
	body: {
		type: Joi.string(),
		key: Joi.string(),
		value: Joi.string(),
	},
};

const editSetting = {
	body: {
		id: Joi.number().required(),
		type: Joi.string(),
		key: Joi.string(),
		value: Joi.string(),
	},
};

const getSettings = {
	query: {
		id: Joi.number().min(1),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		type: Joi.string(),
		key: Joi.string(),
		value: Joi.string(),
		sort: Joi.string().default("id"),
		createdAt: Joi.date(),
	},
};

const findSettingById = {
	params: {
		id: Joi.number().required(),
	},
};

///////////////////////////////// Wallet RU /////////////////////////////////////////////////
const editWallet = {
	body: {
		id: Joi.number().required(),
		// assetId: Joi.number(),
		// userId: Joi.number(),
		amount: Joi.number(),
		// frozen: Joi.number(),
		// pending: Joi.number(),
		isLocked: Joi.boolean(),
	},
};

const getWallets = {
	query: {
		id: Joi.number().min(1),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC", "asc", "desc").default("DESC"),
		assetId: Joi.number(),
		userId: Joi.number(),
		amount: Joi.number(),
		frozen: Joi.number(),
		pending: Joi.number(),
		isLocked: Joi.boolean(),
		sort: Joi.string().default("id"),
		user: Joi.string(),
		asset: Joi.string(),
		createdAt: Joi.date(),
		searchQuery: Joi.string().allow(null, ""),
	},
};

const getTotalWallets = {
	query: {
		id: Joi.number().min(1),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC", "asc", "desc").default("DESC"),
		assetId: Joi.number(),
		userId: Joi.number(),
		amount: Joi.number(),
		frozen: Joi.number(),
		pending: Joi.number(),
		isLocked: Joi.boolean(),
		sort: Joi.string().default("id"),
		user: Joi.string(),
		asset: Joi.string(),
		searchQuery: Joi.string().allow(null, ""),
	},
};

const findWalletById = {
	params: {
		id: Joi.number().required(),
	},
};

const getSelector = {
	query: {
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		searchQuery: Joi.string().allow(null, ""),
	},
};

const getStatistics = {
	query: {
		fromDate: Joi.date().timestamp(),
		toDate: Joi.date().timestamp(),
	},
};

const getManagers = {
	query: {
		id: Joi.number(),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		name: Joi.string(),
		mobile: Joi.string(),
		email: Joi.string(),
		status: Joi.array().items(Joi.valid("1", "2")),
		rule: Joi.array().items(Joi.valid("1", "2", "3")),
	},
};

const addManagers = {
	body: {
		name: Joi.string().allow(null).empty(),
		mobile: Joi.string().allow(null).empty(),
		email: Joi.string().allow(null).empty(),
		password: Joi.string().required(),
		status: Joi.valid("1", "2"),
		roleId: Joi.number(),
	},
};

const editManagers = {
	body: {
		id: Joi.number().required(),
		name: Joi.string().allow(null).empty(),
		mobile: Joi.string().allow(null).empty(),
		email: Joi.string().allow(null).empty(),
		password: Joi.string().allow(null).empty(),
		status: Joi.valid("1", "2"),
		roleId: Joi.number(),
	},
};

const findManagerById = {
	params: {
		id: Joi.number().required(),
	},
};

const getAllPermissions = {
	query: {
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		sort: Joi.string().default("createdAt"),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		name: Joi.string().allow("", null),
		nickName: Joi.string(),
	},
};

const transferValidation = {
	body: {
		cardTypeId: Joi.number().required(),
		count: Joi.number().required().max(100),
	},
};

const sendPushNotification = {
	body: {
		pushTokens: Joi.array().required(),
		hasNft: Joi.bool().default(false),
		noNft: Joi.bool().default(false),
		isFocusing: Joi.bool().default(false),
		title: Joi.string().required(),
		body: Joi.string().required(),
	},
};

module.exports = {
	login,
	verify,
	forgetPassword,
	resetPassword,
	addSetting,
	editSetting,
	getSettings,
	findSettingById,
	editWallet,
	getWallets,
	getTotalWallets,
	findWalletById,
	getSelector,
	getStatistics,
	addManagers,
	editManagers,
	getManagers,
	findManagerById,
	getAllPermissions,
	checkManagerLoginCode,
	transferValidation,
	sendPushNotification,
};
