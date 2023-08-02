const Joi = require("joi");

const network = {
	query: {
		id: Joi.number(),
		name: Joi.string(),
		isDefault: Joi.boolean(),
		type: Joi.string(),
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		sort: Joi.string().default("id"),
		searchQuery: Joi.string().allow(null, ""),
	},
};
const networkSelector = {
	query: {
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
		searchQuery: Joi.string().allow(null, ""),
	},
};

// const searchNetwork = {
//     body: {
//         id: Joi.number(),
//         name: Joi.string(),
//         isDefault: Joi.boolean(),
//         type: Joi.string(),
//         page: Joi.number().default(1).min(1),
//         limit: Joi.number().default(10).min(1).max(100),
//         order: Joi.valid('DESC', 'ASC').default('DESC'),
//     }
// }

const addNetwork = {
	body: {
		name: Joi.string().required(),
		isDefault: Joi.boolean().default(true),
		type: Joi.string().required(),
	},
};

const editNetwork = {
	body: {
		name: Joi.string(),
		isDefault: Joi.boolean(),
		type: Joi.string(),
		id: Joi.number().required(),
	},
};

const findById = {
	params: {
		id: Joi.number().required(),
	},
};

module.exports = {
	network,
	addNetwork,
	findById,
	editNetwork,
	networkSelector,
	// searchNetwork
};
