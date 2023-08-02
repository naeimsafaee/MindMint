/*
 | Author : Mohammad Ali Ghazi
 | Email  : mohamadalghazy@gmail.com
 | Date   : Tue Sep 07 2021
 | Time   : 8:38:34 PM
 */

const Joi = require("joi");

const addDepartment = {
	body: {
		name: Joi.string(),
		description: Joi.string(),
		headManagerId: Joi.number(),
		managersId: Joi.array(),
	},
};

const editDepartment = {
	body: {
		id: Joi.number().required(),
		name: Joi.string(),
		description: Joi.string(),
		headManagerId: Joi.number(),
		managersId: Joi.array(),
		// addedManagersId: Joi.array(),
		// removedManagersId: Joi.array(),
	},
};

const getDepartments = {
	query: {
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		searchQuery: Joi.string().allow(null, ""),
	},
};

const getDepartment = {
	params: {
		id: Joi.number().min(1).required(),
	},
};

const deleteDepartment = {
	params: {
		id: Joi.number().min(1).required(),
	},
};

const departmentSelector = {
	query: {
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		searchQuery: Joi.string().allow(null, ""),
	},
};

module.exports = {
	addDepartment,
	editDepartment,
	getDepartment,
	deleteDepartment,
	departmentSelector,
	getDepartments,
};
