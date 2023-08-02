const Joi = require("joi");

const store = {
	body: {
		stakeId: Joi.number().required(),
		userAmount: Joi.number().required(),
	},
};
const update = {
	params: {
		id: Joi.number().required(),
	},
};

module.exports = {
	store,
	update,
};
