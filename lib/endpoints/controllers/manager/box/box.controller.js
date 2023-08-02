const {
	httpResponse: { response },
	httpStatus,
} = require("../../../../utils");
const { boxService } = require("../../../../services");

exports.addBox = async (req, res) => {
	try {
		const data = await boxService.addBox(req.body);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

/**
 * edit box
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.editBox = async (req, res) => {
	try {
		const data = await boxService.editBox(req.body);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

/**
 * delete box
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.deleteBox = async (req, res) => {
	try {
		const data = await boxService.deleteBox(req.params);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

/**
 * add box setting
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.addBoxSetting = async (req, res) => {
	const data = await boxService.addBoxSetting(req.body);
	return response({ res, statusCode: httpStatus.CREATED, data });
};

/**
 * edit box setting
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.editBoxSetting = async (req, res) => {
	try {
		const data = await boxService.editBoxSetting(req.body);
		return response({ res, statusCode: httpStatus.ACCEPTED, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

/**
 * delete box setting
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.deleteBoxSetting = async (req, res) => {
	try {
		const data = await boxService.deleteBoxSetting(req.params);
		return response({ res, statusCode: httpStatus.ACCEPTED, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get box setting by mananger
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getBoxSettingByManager = async (req, res) => {
	try {
		const data = await boxService.getBoxSettingByManager(req.params);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get box settings by mananger
 */
exports.getBoxSettingsByManager = async (req, res) => {
	const data = await boxService.getBoxSettingsByManager(req.query);
	return response({ res, statusCode: httpStatus.OK, data });
};

exports.getUserBoxByManager = async (req, res) => {
	try {
		const data = await boxService.getUserBoxByManager(req.params);
		return res.send({
			data: data,
		});
	} catch (e) {
		return res.status(500).json(e.message);
	}
};

exports.createUserBoxesByManager = async (req, res) => {
	const data = await boxService.createUserBoxesByManager(req.body);
	return res.send({ data: data });
};

exports.getUserBoxesByManager = async (req, res) => {
	try {
		const data = await boxService.getUserBoxesByManager(req.query);
		return res.send({
			data: data,
		});
	} catch (e) {
		return res.status(500).json(e);
	}
};

/**
 * get user box
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getUserBox = async (req, res) => {
	try {
		const data = await boxService.getUserBox(req.params, req.userEntity);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get user boxes
 */
exports.getUserBoxes = async (req, res) => {
	try {
		const data = await boxService.getUserBoxes(req.query, req.userEntity);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(500).json(e);
	}
};

exports.getBoxAuction = async (req, res) => {
	const data = await boxService.getBoxAuction(req.params);
	return response({ res, statusCode: httpStatus.OK, data });
};

exports.getBoxAuctions = async (req, res) => {
	const data = await boxService.getBoxAuctions(req.query);
	return response({ res, statusCode: httpStatus.OK, data });
};

/**
 * get box auction by manager
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getBoxAuctionByManager = async (req, res) => {
	try {
		const data = await boxService.getBoxAuctionByManager(req.params);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get box auctions by manager
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getBoxAuctionsByManager = async (req, res) => {
	const data = await boxService.getBoxAuctionsByManager(req.query);
	return response({ res, statusCode: httpStatus.OK, data });
};

/**
 * get box by manager
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getBoxByManager = async (req, res) => {
	try {
		const data = await boxService.getBoxByManager(req.params);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get boxes by manager
 */
exports.getBoxesByManager = async (req, res) => {
	const data = await boxService.getBoxesByManager(req.query);
	return response({ res, statusCode: httpStatus.OK, data });
};

/**
 * get box trade by manager
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getBoxTradeByManager = async (req, res) => {
	try {
		const data = await boxService.getBoxTradeByManager(req.params);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get boxes trades by manager
 */
exports.getBoxTradesByManager = async (req, res) => {
	const data = await boxService.getBoxTradesByManager(req.query);
	return response({ res, statusCode: httpStatus.OK, data });
};

exports.purchaseBox = async (req, res) => {
	try {
		let io = req.app.get("socketIo");

		const data = await boxService.purchaseBox(req.body, req.userEntity.id, io);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

exports.OpenGiftBox = async (req, res) => {
	const data = await boxService.OpenGiftBox(req.body, req.userEntity.id);
	return response({ res, statusCode: httpStatus.OK, data });
};

/**
 * confirm box nft
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.boxConfirmNft = async (req, res) => {
	try {
		const data = await boxService.boxConfirmNft(req.body, req.userEntity.id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

/**
 * reserved cards
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.reservedCards = async (req, res) => {
	try {
		const data = await boxService.reservedCards(req.query, req.userEntity.id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

/**
 * reserved cards by manager
 */
exports.reservedCardsByManager = async (req, res) => {
	const data = await boxService.reservedCardsByManager(req.query);
	return response({ res, statusCode: httpStatus.OK, data });
};
