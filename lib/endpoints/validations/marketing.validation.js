const Joi = require("joi");

const createEmailMarketing = {
	body: {
		templateId: Joi.string().required(),
		type: Joi.string().required(),
		dial_code: Joi.string().allow(null, ""),
	},
};

module.exports = {
	createEmailMarketing,
};
