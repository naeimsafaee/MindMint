const {
	httpResponse: { response },
	httpStatus,
} = require("../../utils");

const { authService } = require("./../../services");

exports.managerLogin = async (req, res) => {
	try {
		const { email, password } = req.body;
		const data = await authService.managerLogin(email, password);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

exports.userRegister = async (req, res) => {
	try {
		const data = await authService.userRegister(req);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		// console.log(e);
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

// exports.getUserInfo = async (req, res) => {
// 	try {
// 		return response({ res, statusCode: httpStatus.OK, data: req.userEntity });
// 	} catch (e) {
// 		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
// 		return res.status(e.statusCode).json(e);
// 	}
// };
