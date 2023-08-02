const Joi = require("joi");

const riskToReward = {
	params: {
		id: Joi.string().required(),
	},
};

const growthMeasurement = {
	params: {
		id: Joi.string().required(),
	},
};

module.exports = { riskToReward, growthMeasurement };
