const {
	httpResponse: { response },
	httpStatus,
} = require("../../utils");
const { competitionService } = require("../../services");

/**
 * get user crypto competition results
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getResults = async (req, res) => {
	try {
		const { id, page, limit, status } = req.query;
		const data = await competitionService.getResults(id, req.userEntity.id, page, limit, status);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		console.log(e);
		return res.status(e.statusCode).json(e);
	}
};

/**
 * Add Focus
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.addFocus = async (req, res) => {
	try {
		const data = await competitionService.addFocus(req.userEntity.id, req.body);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		console.log(e);
		return res.status(e.statusCode).json(e);
	}
};

/**
 * end focus
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.endFocus = async (req, res) => {
	try {
		const data = await competitionService.endFocus(req.userEntity.id, req.body);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		console.log(e);
		return res.status(e.statusCode).json(e);
	}
};

/**
 * heartBeat
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.heartBeat = async (req, res) => {
	try {
		const data = await competitionService.heartBeat(req.userEntity.id, req.body);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		console.log(e);
		return res.status(e.statusCode).json(e);
	}
};
