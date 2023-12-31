const Joi = require("joi");

const assetNetwork = {
	query: {
		id: Joi.number().min(1),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		assetId: Joi.number(),
		networkId: Joi.number(),
		withdrawFee: Joi.number(),
		depositFee: Joi.number(),
		canDeposit: Joi.boolean(),
		canWithdraw: Joi.boolean(),
		feeType: Joi.array().items(Joi.valid("FEE", "GAS")),

		network: Joi.string(),
		asset: Joi.string(),
		isActive: Joi.string(),
		fee: Joi.number(),
		gasPrice: Joi.number(),
		sort: Joi.string().default("id"),
		gasLimit: Joi.number(),
		minConfirm: Joi.number(),
		unlockConfirm: Joi.number(),
		withdrawMin: Joi.number(),
		depositMin: Joi.number(),
		apiCode: Joi.string(),
		createdAt: Joi.date(),
		searchQuery: Joi.string().allow(null, ""),
	},
};
const assetNetworkSelector = {
	query: {
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		searchQuery: Joi.string().allow(null, ""),
	},
};

// const searchAssetNetwork = {
//     body: {
//         id: Joi.number().min(1),
//         page: Joi.number().default(1).min(1),
//         limit: Joi.number().default(10).min(1).max(100),
//         order: Joi.valid('DESC', 'ASC').default('DESC'),
//         assetId: Joi.number(),
//         networkId: Joi.number(),
//         withdrawFee: Joi.number(),
//         depositFee: Joi.number(),
//         canDeposit: Joi.boolean(),
//         canWithdraw: Joi.boolean(),
//         feeType: Joi.array().items(Joi.valid("FEE", "GAS"))
//     }
// }

const addAssetNetwork = {
	body: {
		assetId: Joi.number(),
		networkId: Joi.number(),
		isActive: Joi.boolean(),
		withdrawFee: Joi.number(),
		depositFee: Joi.number(),
		fee: Joi.number(),
		gasPrice: Joi.number(),
		gasLimit: Joi.number(),
		minConfirm: Joi.number(),
		unlockConfirm: Joi.number(),
		canDeposit: Joi.boolean(),
		canWithdraw: Joi.boolean(),
		withdrawMin: Joi.number(),
		depositMin: Joi.number(),
		withdrawDescription: Joi.string(),
		depositDescription: Joi.string(),
		specialTips: Joi.string(),
		feeType: Joi.valid("FEE", "GAS"),
		apiCode: Joi.string(),
	},
};

const editAssetNetwork = {
	body: {
		id: Joi.number().required(),
		assetId: Joi.number(),
		networkId: Joi.number(),
		isActive: Joi.boolean(),
		withdrawFee: Joi.number(),
		depositFee: Joi.number(),
		fee: Joi.number(),
		gasPrice: Joi.number(),
		gasLimit: Joi.number(),
		minConfirm: Joi.number(),
		unlockConfirm: Joi.number(),
		canDeposit: Joi.boolean(),
		canWithdraw: Joi.boolean(),
		withdrawMin: Joi.number(),
		depositMin: Joi.number(),
		withdrawDescription: Joi.string(),
		depositDescription: Joi.string(),
		specialTips: Joi.string(),
		feeType: Joi.valid("FEE", "GAS"),
		apiCode: Joi.string(),
	},
};

const findById = {
	params: {
		id: Joi.number().required(),
	},
};

module.exports = {
	assetNetwork,
	assetNetworkSelector,
	addAssetNetwork,
	editAssetNetwork,
	// searchAssetNetwork,
	findById,
};
