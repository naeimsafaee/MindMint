const Joi = require("joi");

const getLanguages = {
	query: {
		page: Joi.number().default(1).min(1),
		limit: Joi.number().default(10).min(1).max(100),
		order: Joi.valid("DESC", "ASC").default("DESC"),
	},
};

const getAsset = {
	query: {
		type: Joi.string().valid("TOKEN", "COIN", "FIAT"),
	},
};

const addSocket = {
	body: {
		roomId: Joi.string().required(),
		eventName: Joi.string().required(),
		data: Joi.string().required(),
	},
};

const calculator = {
	body: {
		cardTypeId: Joi.number().required(),
		rankPosition: Joi.number().required(),
		cameraLevel: Joi.number().required(),
		days: Joi.number().required().min(1),
	},
};

module.exports = {
	getLanguages,
	getAsset,
	addSocket,
	calculator,
};
