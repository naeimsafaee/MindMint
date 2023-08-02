const {
	httpResponse: { response, apiError },
	httpStatus,
} = require("../../utils");
const { managerLogService } = require("../../services");

/**
 * get manager log list
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getManagerLogs = async (req, res) => {
	console.log("hello");
	const data = await managerLogService.getManagerLogs(req.query);
	return response({ res, statusCode: httpStatus.OK, data });
};

/**
 * Find manager log By Id
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getManagerLogById = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await managerLogService.getManagerLogById(id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};
