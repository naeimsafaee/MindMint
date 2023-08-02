const {
	httpResponse: { response, apiError },
	httpStatus,
} = require("../../utils");
const { cardService } = require("../../services");

/**
 * get card list
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getCards = async (req, res) => {
	const data = await cardService.getCards(req.query);
	return response({ res, statusCode: httpStatus.OK, data });
};

exports.getCardsByManager = async (req, res) => {
	try {
		const data = await cardService.getCardsByManager(req.query);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

exports.getCardByManager = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await cardService.getCardByManager(id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

/**
 * Card Selector
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.cardSelector = async (req, res) => {
	try {
		const { page, limit, order, searchQuery } = req.query;
		const data = await cardService.cardSelector(page, limit, order, searchQuery);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get one card
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getCard = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await cardService.getCard(id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

/**
 * edit card
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.editCard = async (req, res) => {
	try {
		const data = await cardService.editCard(req.body);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

/**
 * delete card
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.deleteCard = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await cardService.deleteCard(id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get assigned card list
 */
exports.createAssignedCard = async (req, res) => {
	const data = await cardService.createAssignedCard(req.body);
	return response({ res, statusCode: httpStatus.OK, data });
};

/**
 * get assigned card list
 */
exports.getAssignedCard = async (req, res) => {
	const data = await cardService.getAssignedCard(req.query);
	return response({ res, statusCode: httpStatus.OK, data });
};

/**
 * get card types
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getCardTypes = async (req, res) => {
	try {
		const { title, color, status, page, limit, order, sort, searchQuery, createdAt, id } = req.query;
		const data = await cardService.getCardTypes(
			title,
			color,
			status,
			page,
			limit,
			order,
			sort,
			searchQuery,
			createdAt,
			id,
		);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * CardType Selector
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.cardTypeSelector = async (req, res) => {
	try {
		const { page, limit, order, searchQuery } = req.query;
		const data = await cardService.cardTypeSelector(page, limit, order, searchQuery);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get card type
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getCardType = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await cardService.getCardType(id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * add card type
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.addCardType = async (req, res) => {
	try {
		const { title, color, status } = req.body;
		const data = await cardService.addCardType(title, color, status);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * edit card type
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.editCardType = async (req, res) => {
	try {
		const { id, title, color, status } = req.body;
		const data = await cardService.editCardType(id, title, color, status);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * delete card type
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.delCardType = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await cardService.delCardType(id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * CardTier Selector
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.cardTierSelector = async (req, res) => {
	try {
		const { page, limit, order, searchQuery } = req.query;
		const data = await cardService.cardTierSelector(page, limit, order, searchQuery);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get card tier
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getCardTier = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await cardService.getCardTier(id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * add card tier
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.addCardTier = async (req, res) => {
	try {
		const { title, color, status } = req.body;
		const data = await cardService.addCardTier(title, status);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * edit card tier
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.editCardTier = async (req, res) => {
	try {
		const { id, title, color, status } = req.body;
		const data = await cardService.editCardTier(id, title, color, status);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * delete card tier
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.delCardTier = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await cardService.delCardTier(id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

exports.getUserCard = async (req, res) => {
	const { status, cardTypeId, page, limit, order } = req.query;
	const data = await cardService.getUserCard(req.userEntity.id, status, cardTypeId, page, limit, order);
	return response({ res, statusCode: httpStatus.OK, data });
};

/**
 * get user single card
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getSingleCard = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await cardService.getSingleCard(id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

///////////////////////////////////////////
//////////////////crypto controller///////
/////////////////////////////////////////

/**
 * card count
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.cardCount = async (req, res) => {
	try {
		const {
			page,
			limit,
			order,
			sort,
			//search
			playerId,
			tier,
			tierid,
			tiertitle,
			totalinitialnumber,
			totalsssignednumber,
			type,
			typecolor,
			typeid,
			typetitle,
		} = req.query;
		const data = await cardService.cardCount(
			page,
			limit,
			order,
			sort,
			//search
			playerId,
			tier,
			tierid,
			tiertitle,
			totalinitialnumber,
			totalsssignednumber,
			type,
			typecolor,
			typeid,
			typetitle,
		);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

exports.check = async (req, res) => {
	try {
		const data = await cardService.check(req.query, req.userEntity);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

exports.cardStatistic = async (req, res) => {
	try {
		const data = await cardService.cardsStatistic();
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

exports.tickets = async (req, res) => {
	try {
		const data = await cardService.tickets();
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};
