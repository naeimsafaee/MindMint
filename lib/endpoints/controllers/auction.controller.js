
const {
	httpResponse: { response },
	httpStatus,
} = require("./../../utils");
const { auctionService } = require("./../../services");

/**
 * get all auction
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getAuctions = async (req, res) => {
	try {
		const data = await auctionService.getAll(req.query);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get all auction
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getAuction = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await auctionService.getOne(id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * add auction
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.addAuction = async (req, res) => {
	try {
		const { tokenId, start, end, basePrice, immediatePrice, bookingPrice, type } = req.body;
		const data = await auctionService.add(
			req.userEntity.id,
			tokenId,
			start,
			end,
			basePrice,
			immediatePrice,
			bookingPrice,
			type,
		);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * add auction
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.addAuctionManager = async (req, res) => {
	try {
		const io = req.app.get("socketIo");
		const data = await auctionService.addAuctionManager(req.body, io);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

/**
 * edit auction
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.editAuction = async (req, res) => {
	try {
		const io = req.app.get("socketIo");
		const { id, start, end, basePrice, immediatePrice, bookingPrice, type } = req.body;
		const data = await auctionService.edit(
			req.userEntity.id,
			id,
			start,
			end,
			basePrice,
			immediatePrice,
			bookingPrice,
			type,
			io,
		);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

/**
 * edit auction
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.editAuctionManager = async (req, res) => {
	try {
		const io = req.app.get("socketIo");
		const data = await auctionService.editAuctionManager(req.body, io);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

/**
 * delete auction
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.deleteAuction = async (req, res) => {
	try {
		const io = req.app.get("socketIo");
		const data = await auctionService.del(req.userEntity.id, req.params.id, io);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * delete auction
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.delAuctionManager = async (req, res) => {
	const io = req.app.get("socketIo");
	const data = await auctionService.delAuctionManager(req.params.id, io);
	return response({ res, statusCode: httpStatus.OK, data });
};

/**
 * get auction trades list Manager
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getAuctionTradesManager = async (req, res) => {
	try {
		const data = await auctionService.getAuctionTradesManager(req.query);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get auction trade Manager
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getAuctionTradeManager = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await auctionService.getAuctionTradeManager(id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get auction trades list User
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getAuctionTradesUser = async (req, res) => {
	try {
		const { auctionId, page, limit, order, sort } = req.query;
		const data = await auctionService.getAuctionTradesUser(auctionId, req.userEntity.id, page, limit, order, sort);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get auction trades list
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getAuctionTradeUser = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await auctionService.getAuctionTradeUser(id, req.userEntity.id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

exports.getAuctionList = async (req, res) => {
	try {
		const data = await auctionService.getAuctionList(req.query);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};


exports.getSingleAuction = async (req, res) => {
	try {
		const data = await auctionService.getSingleAuction(req.params.id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

exports.purchaseCard = async (req, res) => {
	const io = req.app.get("socketIo");
	const { cardId , type , address} = req.body;
	const data = await auctionService.purchaseCard(cardId , type , address, req.userEntity, io);
	return response({ res, statusCode: httpStatus.OK, data });
};


exports.getAllAuctions = async (req, res) => {
	try {
		const data = await auctionService.getAllAuctions(req.query);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};
