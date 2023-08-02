const Joi = require("joi");
const { join } = require("web3-token/dist/web3-token.common");

const getCards = {
	query: {
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		sort: Joi.string().default("id"),
		searchQuery: Joi.string().allow(null, ""),
		createdAt: Joi.date(),
		id: Joi.number().min(1),
		name: Joi.string(),
		description: Joi.string(),
		cardTypeId: Joi.array(),
		cardType: Joi.string(),
		edition: Joi.number(),
		chain: Joi.string().valid("BSC", "POLYGON"),
		allowedUsageNumber: Joi.number(),
		status: Joi.array().items(Joi.string().valid("ACTIVE", "INACTIVE")),
	},
};

const getCardByManager = {
	params: {
		id: Joi.number().required(),
	},
};

const getCardsByManager = {
	query: {
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		sort: Joi.string().default("id"),
		searchQuery: Joi.string().allow(null, ""),
		createdAt: Joi.date(),
		id: Joi.number().min(1),
		name: Joi.string(),
		description: Joi.string(),
		initialNumber: Joi.number(),
		assignedNumber: Joi.number(),
		cardType: Joi.string(),
		cardTypeId: Joi.number(),
		isCommon: Joi.boolean(),
		status: Joi.array().items(Joi.valid("CREATING")),
	},
};
const cardSelector = {
	query: {
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		searchQuery: Joi.string().allow(null, ""),
	},
};

const getCard = {
	params: {
		id: Joi.number().required(),
	},
};

const editCard = {
	body: {
		id: Joi.number().required(),
		name: Joi.string(),
		description: Joi.string(),
		cardTypeId: Joi.number(),
	},
};

const deleteCard = {
	params: {
		id: Joi.number().required(),
	},
};

const createAssignedCard = {
	body: {
		userId: Joi.number().required(),
		cardTypeId: Joi.number().required(),
	},
};

const getAssignedCard = {
	query: {
		id: Joi.number().min(1),
		userId: Joi.number(),
		card: Joi.string(),
		user: Joi.string(),
		cardTypeId: Joi.array(),
		tokenId: Joi.number(),
		type: Joi.array().items(Joi.valid("TRANSFER", "REWARD", "WITHDRAW", "SOLD", "BOX")),
		status: Joi.array().items(Joi.valid("FREE", "INGAME", "INAUCTION", "IN_BOX", "RESERVED")),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		sort: Joi.string().default("id"),
		orderCard: Joi.valid("DESC", "ASC"),
		sortCard: Joi.string(),
		orderUser: Joi.valid("DESC", "ASC"),
		sortUser: Joi.string(),
		createdAt: Joi.date(),
		searchQuery: Joi.string().allow(null, ""),
	},
};

const getCardTypes = {
	query: {
		title: Joi.string(),
		color: Joi.string(),
		status: Joi.array().items(Joi.string().valid("ACTIVE", "INACTIVE")),
		page: Joi.number().default(1).min(1),
		id: Joi.number().min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		sort: Joi.string().default("id"),
		searchQuery: Joi.string().allow(null, ""),
		createdAt: Joi.date(),
	},
};

const cardTypeSelector = {
	query: {
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		searchQuery: Joi.string().allow(null, ""),
	},
};

const getCardType = {
	params: {
		id: Joi.number().min(1).required(),
	},
};

const addCardType = {
	body: {
		title: Joi.string().required(),
		color: Joi.string().required(),
		status: Joi.valid("ACTIVE", "INACTIVE").default("ACTIVE"),
	},
};

const editCardType = {
	body: {
		id: Joi.number().required(),
		title: Joi.string(),
		color: Joi.string(),
		status: Joi.valid("ACTIVE", "INACTIVE"),
	},
};

const delCardType = {
	params: {
		id: Joi.number().required(),
	},
};

const cardTierSelector = {
	query: {
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		searchQuery: Joi.string().allow(null, ""),
	},
};

const getCardTier = {
	params: {
		id: Joi.number().min(1).required(),
	},
};

const addCardTier = {
	body: {
		title: Joi.string().required(),
		status: Joi.valid("ACTIVE", "INACTIVE").default("ACTIVE"),
	},
};

const editCardTier = {
	body: {
		id: Joi.number().required(),
		title: Joi.string(),
		status: Joi.valid("ACTIVE", "INACTIVE"),
	},
};

const delCardTier = {
	params: {
		id: Joi.number().required(),
	},
};

const getUserCard = {
	query: {
		status: Joi.array().valid("FREE", "INAUCTION", "INGAME"),
		cardTypeId: Joi.number().min(1),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
	},
};

const cardCount = {
	query: {
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		sort: Joi.string().default("id"),
		//
		playerId: Joi.string(),
		tier: Joi.string(),
		tierid: Joi.number(),
		tiertitle: Joi.string(),
		totalinitialnumber: Joi.number(),
		totalsssignednumber: Joi.number(),
		type: Joi.number(),
		typecolor: Joi.string(),
		typeid: Joi.string(),
		typetitle: Joi.string(),
	},
};

const check = {
	query: {
		cardTypeId: Joi.number().required(),
	},
};

module.exports = {
	getCards,
	cardSelector,
	getCard,
	editCard,
	deleteCard,
	getAssignedCard,
	getCardTypes,
	cardTypeSelector,
	getCardType,
	addCardType,
	editCardType,
	delCardType,
	cardTierSelector,
	getCardTier,
	addCardTier,
	editCardTier,
	delCardTier,
	getUserCard,
	//crypto-cards///
	////card count
	cardCount,
	getCardByManager,
	getCardsByManager,
	check,
	createAssignedCard,
};
