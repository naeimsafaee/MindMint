const {
	httpResponse: { response, apiError },
	httpStatus,
} = require("../../../../utils");
const { prizeService } = require("../../../../services");
const { tokenPrizeService } = require("../../../../services");

///////////////// prize ///////////////////

/**
 * get Prize list
 */
exports.getPrizes = async (req, res) => {
	const data = await prizeService.getPrizes(req.query);
	return response({ res, statusCode: httpStatus.OK, data });
};

/**
 * get Prize
 */
exports.getPrize = async (req, res) => {
	const { id } = req.params;
	const data = await prizeService.getPrize(id);
	return response({ res, statusCode: httpStatus.OK, data });
};

/**
 * add Prize
 */
exports.addPrize = async (req, res) => {
	const { title, tier, amount, assetId, cardTypeId } = req.body;
	const data = await prizeService.addPrize(title, tier, amount, assetId, cardTypeId);
	return response({ res, statusCode: httpStatus.OK, data });
};

/**
 * edit Prize
 */
exports.editPrize = async (req, res) => {
	const { id } = req.params;
	const { title, tier, amount, assetId, cardTypeId } = req.body;
	const data = await prizeService.editPrize(id, title, tier, amount, assetId, cardTypeId);
	return response({ res, statusCode: httpStatus.OK, data });
};

/**
 * delete Prize
 */
exports.delPrize = async (req, res) => {
	const { id } = req.params;
	const data = await prizeService.delPrize(id);
	return response({ res, statusCode: httpStatus.OK, data });
};

/**
 * get user Prize list
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getUserPrizeManager = async (req, res) => {
	try {
		const data = await prizeService.getUserPrizeManager(req.query);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

///////////////// prize pool  ///////////////////

/**
 * get prize pool
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getPrizePools = async (req, res) => {
	try {
		const { prizeId, page, limit, order, id, title, createdAt, tier, type, price, searchQuery, sort, assetId } =
			req.query;
		const data = await prizeService.getPrizePools(
			prizeId,
			page,
			limit,
			order,
			id,
			title,
			createdAt,
			tier,
			type,
			price,
			searchQuery,
			sort,
			assetId,
		);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get prize pool
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getPrizePool = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await prizeService.getPrizePool(id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * add Prize pool
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.addPrizePool = async (req, res) => {
	try {
		const { prizeId, tier, amount, number, cardTypeId, cardTierId, assetId } = req.body;
		const data = await prizeService.addPrizePool(prizeId, tier, amount, number, cardTypeId, cardTierId, assetId);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * edit Prize pool
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.editPrizePool = async (req, res) => {
	try {
		const { id, prizeId, tier, amount, number, cardTypeId, cardTierId, assetId } = req.body;
		const data = await prizeService.editPrizePool(
			id,
			prizeId,
			tier,
			amount,
			number,
			cardTypeId,
			cardTierId,
			assetId,
		);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * delete Prize Pool
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.delPrizePool = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await prizeService.delPrizePool(id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};
