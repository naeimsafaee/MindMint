const {
	httpResponse: { response },
	httpStatus,
} = require("../../utils");
const { swapService } = require("../../services");
const { postgres } = require("../../databases");

exports.swap = async (req, res) => {
	const data = await swapService.swap(req.userEntity.id, req.body, req);
	return response({ res, statusCode: httpStatus.OK, data });
};

exports.price = async (req, res) => {
	const data = await swapService.price(req.body);
	return response({ res, statusCode: httpStatus.OK, data });
};

exports.fee = async (req, res) => {
	const data = await swapService.fee(req.body, req.userEntity.id);
	return response({ res, statusCode: httpStatus.OK, data });
};

// active or deactivate swap
exports.activation = async (req, res) => {
	try {
		const data = await swapService.activation(req.params);
		return res.send({
			data: data,
		});
	} catch (e) {
		return res.status(500).json(e.message);
	}
};
