const Joi = require("joi");

const addBox = {
	body: {
		name: Joi.string().required(),
		cardTypeId: Joi.number().min(1).required(),
		initialNumber: Joi.number().default(1),
		price: Joi.number().required(),
		assetId: Joi.number().required(),
		level: Joi.number().required().min(1).max(5),
	},
};

const editBox = {
	body: {
		id: Joi.number().required(),
		name: Joi.string(),
		price: Joi.number(),
		assetId: Joi.number().required(),
	},
};

const deleteBox = {
	params: {
		id: Joi.number().required(),
	},
};

const addBoxSetting = {
	body: {
		name: Joi.string().required(),
		cardTypeId: Joi.number().min(1).required(),
		amounts: Joi.array().min(1).max(3).required(),
		type: Joi.string().valid("DOPAMINE", "SEROTONIN", "ANXIETY", "DAMAGE").required(),
		level: Joi.number().min(1).max(5).required(),
	},
};

const editBoxSetting = {
	body: {
		id: Joi.string().required(),
		name: Joi.string(),
		cardTypeId: Joi.number().min(1),
		amounts: Joi.array().min(1),
		type: Joi.string().valid("DOPAMINE", "SEROTONIN", "ANXIETY", "DAMAGE"),
	},
};

const deleteBoxSetting = {
	params: {
		id: Joi.number().required(),
	},
};

const getBoxSettingByManager = {
	params: {
		id: Joi.number().required(),
	},
};

const getBoxSettingsByManager = {
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		sort: Joi.string().default("id"),
		order: Joi.string().valid("ASC", "DESC").default("DESC"),
		createdAt: Joi.date(),
		searchQuery: Joi.string(),
		id: Joi.string(),
		name: Joi.string(),
		type: Joi.array().items(Joi.valid("DOPAMINE", "SEROTONIN", "ANXIETY", "DAMAGE")),
		cardTypeId: Joi.array(),
		cardType: Joi.string(),
	},
};

const getUserBoxByManager = {
	params: {
		userId: Joi.string().required(),
	},
};

const getUserBoxesByManager = {
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		sort: Joi.string().default("id"),
		order: Joi.string().valid("ASC", "DESC").default("DESC"),
		createdAt: Joi.date(),
		searchQuery: Joi.string(),
		id: Joi.string(),
		name: Joi.string(),
		type: Joi.array().items(Joi.valid("DOPAMINE", "SEROTONIN", "ANXIETY", "DAMAGE")),
		cardTypeId: Joi.string(),
		cardType: Joi.string(),
		userId: Joi.string(),
	},
};

const createUserBox = {
	body: {
		userId: Joi.number().required(),
		cardTypeId: Joi.number().required(),
	},
};

const getUserBox = {
	params: {
		id: Joi.number().required(),
	},
};

const getUserBoxes = {
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		sort: Joi.string().default("id"),
		order: Joi.string().valid("ASC", "DESC").default("DESC"),
		createdAt: Joi.date(),
		searchQuery: Joi.string(),
		id: Joi.string(),
		name: Joi.string(),
		type: Joi.array().items(Joi.valid("DOPAMINE", "SEROTONIN", "ANXIETY", "DAMAGE")),
		cardTypeId: Joi.string(),
		cardType: Joi.string(),
	},
};

const getBoxAuction = {
	params: {
		id: Joi.number().required(),
	},
};

const getBoxAuctions = {
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		sort: Joi.string().default("price").valid("price"),
		order: Joi.string().valid("ASC", "DESC").default("ASC"),
		cardTypeId: Joi.string(),
		min: Joi.number().default(0.1),
		max: Joi.number().default(10000),
	},
};

const getBoxAuctionByManager = {
	params: {
		id: Joi.number().required(),
	},
};

const getBoxAuctionsByManager = {
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		sort: Joi.string().default("id"),
		order: Joi.string().valid("ASC", "DESC").default("DESC"),
		createdAt: Joi.date(),
		searchQuery: Joi.string(),
		id: Joi.string(),
		name: Joi.string(),
		cardTypeId: Joi.string(),
		cardType: Joi.string(),
		status: Joi.array().items(Joi.valid("ACTIVE", "INACTIVE", "FINISHED")),
		asset: Joi.string(),
		price: Joi.number(),
	},
};

const getBoxByManager = {
	params: {
		id: Joi.number().required(),
	},
};

const getBoxesByManager = {
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		sort: Joi.string().default("id"),
		order: Joi.string().valid("ASC", "DESC").default("DESC"),
		status: Joi.array(),
		createdAt: Joi.date(),
		searchQuery: Joi.string(),
		id: Joi.string(),
		name: Joi.string(),
		price: Joi.string(),
		cardTypeId: Joi.array(),
		cardType: Joi.array(),
		batteryAmount: Joi.string(),
		negativeAmount: Joi.string(),
		referralCount: Joi.string(),
	},
};

const getBoxTradeByManager = {
	params: {
		id: Joi.number().required(),
	},
};

const getBoxTradesByManager = {
	query: {
		userName: Joi.string(),

		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		sort: Joi.string().default("id"),
		order: Joi.string().valid("ASC", "DESC").default("DESC"),
		createdAt: Joi.date(),
		searchQuery: Joi.string(),
		id: Joi.string(),
		name: Joi.string(),
		price: Joi.string(),
		cardTypeId: Joi.string(),
		cardType: Joi.string(),
		amount: Joi.string(),
	},
};

const purchaseBox = {
	body: {
		boxAuctionId: Joi.number().required(),
	},
};

const boxConfirmNft = {
	body: {
		cardId: Joi.number().required(),
		address: Joi.string()
			.regex(/^0x[a-fA-F0-9]{40}$/)
			.message(" is not valid")
			.required(),
	},
};

const reservedCards = {
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		sort: Joi.string().default("id"),
		order: Joi.string().valid("ASC", "DESC").default("DESC"),
		createdAt: Joi.date(),
		searchQuery: Joi.string(),
	},
};

const reservedCardsByManager = {
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		sort: Joi.string().default("id"),
		order: Joi.string().valid("ASC", "DESC").default("DESC"),
		createdAt: Joi.date(),
		searchQuery: Joi.string(),
		userId: Joi.number(),
		userName: Joi.string(),
	},
};

module.exports = {
	// Box
	addBox,
	editBox,
	deleteBox,
	getBoxByManager,
	getBoxesByManager,

	// Box Setting
	addBoxSetting,
	editBoxSetting,
	deleteBoxSetting,
	getBoxSettingByManager,
	getBoxSettingsByManager,

	// User Box
	getUserBox,
	getUserBoxes,
	getUserBoxByManager,
	getUserBoxesByManager,

	// Box Auction
	getBoxAuction,
	getBoxAuctions,
	getBoxAuctionByManager,
	getBoxAuctionsByManager,

	// Box Trade
	getBoxTradeByManager,
	getBoxTradesByManager,

	purchaseBox,
	boxConfirmNft,
	reservedCards,
	reservedCardsByManager,
	createUserBox,
};
