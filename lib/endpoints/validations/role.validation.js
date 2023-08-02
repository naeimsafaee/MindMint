const Joi = require("joi");

const getRoles = {
	query: {
		id: Joi.number(),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		name: Joi.string(),
		nickName: Joi.string(),
	},
};
const roleSelector = {
	query: {
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		searchQuery: Joi.string().allow(null, ""),
	},
};
const addRole = {
	body: {
		name: Joi.string(),
		nickName: Joi.string(),
		permissions: Joi.array(),
	},
};
const editRole = {
	body: {
		id: Joi.number().required(),
		name: Joi.string(),
		nickName: Joi.string(),
		permissions: Joi.array(),
	},
};
const findRoleById = {
	params: {
		id: Joi.number().required(),
	},
};
module.exports = {
	getRoles,
	addRole,
	findRoleById,
	editRole,
	roleSelector,
};
