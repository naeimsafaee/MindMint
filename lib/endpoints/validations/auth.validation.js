const Joi = require("joi");

const managerLogin = {
	body: {
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	},
};

module.exports = {
	managerLogin,
};
