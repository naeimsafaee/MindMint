/*
| Author : Mohammad Ali Ghazi
| Email  : mohamadalghazy@gmail.com
| Date   : Sun Dec 12 2021
| Time   : 1:38:40 PM
 */

const Joi = require("joi");

const getAuctions = {
	query: {
		id: Joi.number().min(1),
		cardId: Joi.string(),
		cardTypeId: Joi.array().items(Joi.number().min(1)),
		userId: Joi.number().min(1),
		start: Joi.date(),
		end: Joi.date(),
		basePrice: Joi.number(),
		immediatePrice: Joi.number(),
		bookingPrice: Joi.number(),
		type: Joi.string().valid("NORMAL", "INITIAL"),
		status: Joi.array().items(Joi.string().valid("ACTIVE", "INACTIVE", "FINISHED")),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		sort: Joi.string().default("id"),
		createdAt: Joi.date(),
		searchQuery: Joi.string().allow(null, ""),
		user: Joi.string(),
		auctionType: Joi.string().valid("CHALLENGE"),
		orderUser: Joi.valid("DESC", "ASC"),
		sortUser: Joi.string(),
	},
};

const getAuction = {
	params: {
		id: Joi.number().min(1).required(),
	},
};

const addAuction = {
	body: {
		tokenId: Joi.number().min(1).required(),
		start: Joi.date().required(),
		end: Joi.date().required(),
		basePrice: Joi.number().min(0),
		immediatePrice: Joi.number().min(0).required(),
		bookingPrice: Joi.number().min(0),
		type: Joi.string().valid("NORMAL", "INITIAL").default("INITIAL"),
	},
};

const addAuctionManager = {
	body: {
		cardTypeId: Joi.number().min(1).required(),
		start: Joi.date().required(),
		end: Joi.date().required(),
		basePrice: Joi.number().min(0),
		immediatePrice: Joi.number().min(0),
		bookingPrice: Joi.number().min(0),
		type: Joi.string().valid("NORMAL", "INITIAL").default("INITIAL"),
		initialNumber: Joi.number().min(1).required(),
	},
};

const editAuction = {
	body: {
		id: Joi.number().min(1).required(),
		start: Joi.date(),
		end: Joi.date(),
		basePrice: Joi.number().min(0),
		immediatePrice: Joi.number().min(0),
		bookingPrice: Joi.number().min(0),
		type: Joi.string().valid("NORMAL", "INITIAL"),
		auctionType: Joi.string().valid("CHALLENGE"),
		assignCount: Joi.number(),
	},
};

const deleteAuction = {
	params: {
		id: Joi.number().min(1).required(),
	},
};

const getOffers = {
	query: {
		id: Joi.number().min(1),
		auctionId: Joi.number().min(1),
		userId: Joi.number().min(1),
		user: Joi.string(),
		status: Joi.array().valid(Joi.string().valid("CANCELED", "REGISTERED", "WON")),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		sort: Joi.string().default("id"),
		createdAt: Joi.date(),
		amount: Joi.number(),
		payer: Joi.string(),
		payee: Joi.string(),
		searchQuery: Joi.string().allow(null, ""),
	},
};

const getOffersManager = {
	query: {
		id: Joi.number().min(1),
		auctionId: Joi.number().min(1),
		userId: Joi.number().min(1),
		user: Joi.string(),
		status: Joi.array().valid(Joi.string().valid("CANCELED", "REGISTERED", "WON")),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		sort: Joi.string().default("id"),
		createdAt: Joi.date(),
		amount: Joi.number(),
		payer: Joi.string(),
		payee: Joi.string(),
		searchQuery: Joi.string().allow(null, ""),
	},
};

const getOffer = {
	query: {
		id: Joi.number().min(1),
	},
};

const deleteOffers = {
	params: {
		id: Joi.number().min(1).required(),
	},
};

const getAuctionTradesManager = {
	query: {
		id: Joi.number().min(1),
		auctionId: Joi.number().min(1),
		payerId: Joi.number().min(1),
		payeeId: Joi.number().min(1),
		cardTypeId: Joi.array().items(Joi.number().min(1)),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		sort: Joi.string().default("id"),
		createdAt: Joi.date(),
		amount: Joi.number(),
		fee: Joi.number().min(0),
		payer: Joi.string(),
		payee: Joi.string(),
		searchQuery: Joi.string().allow(null, ""),
		userId: Joi.number().min(1),
	},
};

const getAuctionTradeManager = {
	params: {
		id: Joi.number().min(1),
	},
};

const getAuctionTradesUser = {
	query: {
		auctionId: Joi.number().min(1),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		sort: Joi.string().default("id"),
	},
};

const getAuctionTradeUser = {
	params: {
		id: Joi.number().min(1),
	},
};

const getAuctionList = {
	query: {
		type: Joi.string().valid("NORMAL", "INITIAL"),
		cardTypeId: Joi.number(),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		min: Joi.number(),
		max: Joi.number(),
		sort: Joi.string().valid("createdAt", "end", "immediatePrice").default("immediatePrice"),
	},
};

const getAuctionOfferList = {
	query: {
		auctionId: Joi.number().min(1).required(),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
	},
};

const getSingleAuction = {
	params: {
		id: Joi.number().min(1).required(),
	},
};

const purchaseCard = {
	body: {
		cardId: Joi.string().required(),
		type: Joi.string().valid("MINT" , "ACCOUNT" , "CREDIT").required(),
		address: Joi.string()
			.regex(/^0x[a-fA-F0-9]{40}$/)
			.message("address is not valid")
			.required(),
	},
};

const getAuctionLog = {
	params: {
		id: Joi.number().min(1),
	},
};

const getAuctionLogs = {
	query: {
		id: Joi.number().min(1),
		auctionId: Joi.number().min(1),
		cardTypeId: Joi.array().items(Joi.number().min(1)),
		userName: Joi.string(),
		address: Joi.string(),
		immediatePrice: Joi.number().min(0),
		status: Joi.array().items(Joi.string().valid("PENDING", "FAILED", "FINISHED")),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		sort: Joi.string().valid("createdAt").default("createdAt"),
		searchQuery: Joi.string(),
	},
};

module.exports = {
	getAuctions,
	getAuction,
	addAuction,
	addAuctionManager,
	editAuction,
	deleteAuction,
	getOffers,
	getOffersManager,
	getOffer,
	deleteOffers,
	getAuctionTradesManager,
	getAuctionTradeManager,
	getAuctionTradesUser,
	getAuctionTradeUser,
	getAuctionList,
	getAuctionOfferList,
	getSingleAuction,
	purchaseCard,
	getAuctionLog,
	getAuctionLogs,
};
