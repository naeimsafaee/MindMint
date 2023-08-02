const {
	httpResponse: { response },
	httpStatus,
} = require("../../utils");
const { countryService } = require("../../services");

exports.getAllCountry = async (req, res) => {
	try {
		const data = await countryService.getAllCountry(req.query);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

exports.getOneCountry = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await countryService.getOneCountry(id);
		return response({ res, statusCode: httpStatus.ACCEPTED, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

exports.testRef = async (req, res) => {
	try {
		const data = await countryService.testRef();
		return response({ res, statusCode: httpStatus.ACCEPTED, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};
