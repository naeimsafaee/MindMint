const { postgres } = require("../databases");

exports.managerLog = (permission) => async (req, res, next) => {
	try {
		await new postgres.ManagerLog({
			managerId: req.userEntity.id,
			action: permission,
		}).save();

		next();
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};
