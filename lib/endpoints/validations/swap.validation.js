const Joi = require("joi");

const swap = {
	body: {
		fromToken: Joi.string().required(),
		toToken: Joi.string().required(),
		balanceIn: Joi.number().positive().required(),
		agent: Joi.string().required(),
	},
};

const swapFee = {
	body: {
		fromTokenId: Joi.string().required(),
		toTokenId: Joi.string().required(),
	},
};

const swapPrice = {
	body: {
		fromToken: Joi.string().required(),
		toToken: Joi.string().required(),
		slippage: Joi.number().min(0).max(50),
		balanceIn: Joi.number().positive().required(),
		origin: Joi.string().required(),
	},
};

const activeSwapByManager = {
	params: {
		id: Joi.number().required(),
	},
};

module.exports = {
	swap,
	swapPrice,
	activeSwapByManager,
	swapFee,
};
