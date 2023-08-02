const { tokenService } = require("../../services");
const {
	httpResponse: { response },
	httpStatus,
} = require("../../utils");

exports.getTokensByManager = async (req, res) => {
	try {
		const data = await tokenService.getTokensByManager(req.query);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

exports.getTokenByManager = async (req, res) => {
	try {
		const data = await tokenService.getTokenByManager(req.params.id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};
