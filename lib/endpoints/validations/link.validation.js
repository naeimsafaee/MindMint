const Joi = require("joi");

const addLink = {
	body: {
		name: Joi.string().required(),
		type: Joi.valid("REGISTER").default("REGISTER"),
	},
};

const editLink = {
	body: {
		id: Joi.number().required(),
		name: Joi.string(),
		type: Joi.valid("REGISTER").default("REGISTER"),
	},
};

const deleteLink = {
	params: {
		id: Joi.number().required(),
	},
};

const getLink = {
	params: {
		id: Joi.number().required(),
	},
};

const getLinks = {
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		sort: Joi.string().default("id"),
		order: Joi.string().valid("ASC", "DESC").default("DESC"),
		name: Joi.string(),
	},
};

const getLinkByManager = {
	params: {
		id: Joi.number().required(),
	},
};

const getLinksByManager = {
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		sort: Joi.string().default("id"),
		order: Joi.string().valid("ASC", "DESC").default("DESC"),
		name: Joi.string(),
	},
};

const getStatistics = {
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		sort: Joi.string().default("id"),
		order: Joi.string().valid("ASC", "DESC").default("DESC"),
		searchQuery: Joi.string(),
	},
};

const getLinkStatistics = {
	params: {
		id: Joi.number().required(),
	},
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		sort: Joi.string().default("id"),
		order: Joi.string().valid("ASC", "DESC").default("DESC"),
	},
};

const getCommissionsChart = {
	query: {
		start: Joi.date().required(),
		end: Joi.date().required(),
	},
};

const getRegisterChart = {
	query: {
		start: Joi.date().required(),
		end: Joi.date().required(),
	},
};

const getClickChart = {
	query: {
		start: Joi.date().required(),
		end: Joi.date().required(),
	},
};

const directReferral = {
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		sort: Joi.string().default("id"),
		order: Joi.string().valid("ASC", "DESC").default("DESC"),
		searchQuery: Joi.string(),
	},
};

const clientCommission = {
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(100).default(10),
		sort: Joi.string().default("id"),
		order: Joi.string().valid("ASC", "DESC").default("DESC"),
		start: Joi.date(),
		end: Joi.date(),
	},
};

module.exports = {
	addLink,
	editLink,
	deleteLink,
	getLink,
	getLinks,
	getLinkByManager,
	getLinksByManager,
	getStatistics,
	getLinkStatistics,
	getCommissionsChart,
	getRegisterChart,
	getClickChart,
	directReferral,
	clientCommission,
};
