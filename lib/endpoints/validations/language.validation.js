const Joi = require("joi");

const getLanguages = {
	query: {
		id: Joi.number(),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		name: Joi.string(),
		code: Joi.string(),
	},
};
const languageSelector = {
	query: {
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		searchQuery: Joi.string().allow(null, ""),
		createdAt: Joi.date(),
	},
};
const addLanguage = {
	body: {
		name: Joi.string(),
		code: Joi.string(),
	},
};
const editLanguage = {
	body: {
		id: Joi.number().required(),
		name: Joi.string(),
		code: Joi.string(),
	},
};
const findLanguageById = {
	params: {
		id: Joi.number().required(),
	},
};
module.exports = {
	getLanguages,
	addLanguage,
	findLanguageById,
	editLanguage,
	languageSelector,
};
