const {
	httpResponse: { response, apiError },
	httpStatus,
} = require("./../../utils");
const { networkServices } = require("./../../services");

/**
 * Get manager network
 * @param {*} req
 * @param {*} res
 */
exports.network = async (req, res) => {
	try {
		const data = await networkServices.get(req.query);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * Get manager network Selector
 * @param {*} req
 * @param {*} res
 */
exports.networkSelector = async (req, res) => {
	const data = await networkServices.networkSelector(req.query);
	return response({ res, statusCode: httpStatus.OK, data });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.searchNetwork = async (req, res) => {
	const data = await networkServices.get(req.body);
	return response({ res, statusCode: httpStatus.OK, data });
};

/**
 * Add network for user
 * @param {*} req
 * @param {*} res
 */
exports.addNetwork = async (req, res) => {
	const { name, isDefault, type } = req.body;
	const data = await networkServices.set(name, isDefault, type);
	return response({ res, statusCode: httpStatus.CREATED, data });
};

/**
 * Add network for user
 * @param {*} req
 * @param {*} res
 */
exports.editNetwork = async (req, res) => {
	const data = await networkServices.edit(req.body);
	return response({ res, statusCode: httpStatus.ACCEPTED, data });
};

/**
 * Add network for user
 * @param {*} req
 * @param {*} res
 */
exports.deleteNetwork = async (req, res) => {
	const { id } = req.params;
	const data = await networkServices.del(id);
	return response({ res, statusCode: httpStatus.ACCEPTED, data });
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.findById = async (req, res) => {
	const { id } = req.params;
	const data = await networkServices.findById(id);
	return response({ res, statusCode: httpStatus.ACCEPTED, data });
};
