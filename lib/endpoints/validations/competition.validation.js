const Joi = require("joi").extend(require("@joi/date"));

const getLeaderBoards = {
	query: {
		id: Joi.number().min(1).required(),
		leagueId: Joi.number().min(1),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
	},
};

const getCompetitionById = {
	query: {
		id: Joi.number(),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		sort: Joi.string().default("id"),
		status: Joi.string(),
	},
};

const getRankingDetails = {
	query: {
		id: Joi.number().min(1).required(),
		userId: Joi.number().min(1).required(),
	},
};

const getAssetData = {
	query: {
		searchQuery: Joi.string().allow(null, ""),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
	},
};

// Competition Task
const addFocus = {
	body: {
		leagueId: Joi.number(),
		assignedCardId: Joi.number().min(1).required(),
		period: Joi.number(),
	},
};

const endFocus = {
	body: {
		leagueId: Joi.number(),
		// cardId: Joi.number().required(),
		assignedCardId: Joi.number().min(1).required(),
		timer: Joi.string().max(200),
		violation: Joi.boolean().default(false),
	},
};

module.exports = {
	getLeaderBoards,
	getRankingDetails,
	getCompetitionById,
	getAssetData,
	addFocus,
	endFocus,
};
