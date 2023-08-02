const Joi = require("joi");

const index = {
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(20).default(10),
		order: Joi.valid("DESC", "ASC", "asc", "desc").default("DESC"),
		sort: Joi.string(),
	},
};

const store = {
	body: {
		caption: Joi.string().required(),
		// file: Joi.required()
	},
};

const profile = {
	query: {
		page: Joi.number().min(1).default(1),
		limit: Joi.number().min(1).max(20).default(10),
		userId: Joi.number().required(),
		type: Joi.string().valid("camera", "post").required().default("post"),
	},
};

module.exports = {
	index,
	store,
	profile,
};
