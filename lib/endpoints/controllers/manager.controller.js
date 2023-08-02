/*
| Author : Mohammad Ali Ghazi
| Email  : mohamadalghazy@gmail.com
| Date   : Sun Dec 05 2021
| Time   : 1:45:38 PM
 */

const {
	httpResponse: { response },
	httpStatus,
} = require("./../../utils");
const { managerService, notificationServices } = require("./../../services");

/**
 * get manager info
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.info = async (req, res) => {
	try {
		const data = await managerService.info(req.userEntity.id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get manager list
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getManagers = async (req, res) => {
	try {
		const data = await managerService.getManagers();
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * manager login
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.login = async (req, res) => {
	const { email, password } = req.body;
	const data = await managerService.login(email, password);
	return response({ res, statusCode: httpStatus.OK, data });
};

exports.checkManagerLoginCode = async (req, res) => {
	const { email, code } = req.body;

	const data = await managerService.checkManagerLoginCode(email, code);
	return response({ res, statusCode: httpStatus.OK, data });
};

/**
 * manager forget password request
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.forgetPassword = async (req, res) => {
	try {
		const { email, mobile } = req.body;
		const data = await managerService.forgetPassword(email, mobile);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * manager reset password request
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.resetPassword = async (req, res) => {
	try {
		const { token, password } = req.body;
		const data = await managerService.resetPassword(token, password);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * manager login or any thing else verify
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.verify = async (req, res) => {
	try {
		const { token, code } = req.body;
		const data = await managerService.verify(token, code);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * manager refresh token
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.refreshToken = async (req, res) => {
	try {
		const data = await managerService.refreshToken(req.sessionEntity, req.userEntity);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * manager logout
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.logout = async (req, res) => {
	try {
		const data = await managerService.logout(req.sessionEntity);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

///////////////////////////////// Setting CRUD /////////////////////////////////////////////////
/**
 * Add Setting
 * @param {*} req
 * @param {*} res
 */
exports.addSetting = async (req, res) => {
	try {
		const data = await managerService.addSetting(req.body);
		return response({ res, statusCode: httpStatus.CREATED, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * Edit Setting
 * @param {*} req
 * @param {*} res
 */
exports.editSetting = async (req, res) => {
	try {
		const data = managerService.editSetting(req.body);
		return response({ res, statusCode: httpStatus.ACCEPTED, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * Get Settings
 * @param {*} req
 * @param {*} res
 */
exports.getSettings = async (req, res) => {
	try {
		const data = await managerService.getSettings(req.query);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * Find Setting By Id
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.findSettingById = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await managerService.findSettingById(id);
		return response({ res, statusCode: httpStatus.ACCEPTED, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * Delete Setting
 * @param {*} req
 * @param {*} res
 */
exports.deleteSetting = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await managerService.deleteSetting(id);
		return response({ res, statusCode: httpStatus.ACCEPTED, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

///////////////////////////////// Wallet RU /////////////////////////////////////////////////
/**
 * Edit Wallet
 * @param {*} req
 * @param {*} res
 */
exports.editWallet = async (req, res) => {
	try {
		const data = managerService.editWallet(req.body);
		return response({ res, statusCode: httpStatus.ACCEPTED, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * Get Wallets
 * @param {*} req
 * @param {*} res
 */
exports.getWallets = async (req, res) => {
	try {
		const data = await managerService.getWallets(req.query);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		// console.log(e);
		return res.status(e.statusCode).json(e);
	}
};

/**
 * Get Wallets
 * @param {*} req
 * @param {*} res
 */
exports.getTotalWallets = async (req, res) => {
	try {
		const data = await managerService.getTotalWallets(req.query);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		// console.log(e);
		return res.status(e.statusCode).json(e);
	}
};

/**
 * Find Wallet By Id
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.findWalletById = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await managerService.findWalletById(id);
		return response({ res, statusCode: httpStatus.ACCEPTED, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get User Chart
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.UserChart = async (req, res) => {
	const { fromDate, toDate } = req.query;

	const data = await managerService.UserChart(fromDate, toDate);
	return response({ res, statusCode: httpStatus.ACCEPTED, data });
};

/** *
 * get UserAuctionTrade Chart
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.AuctionTradesChart = async (req, res) => {
	const { fromDate, toDate, game } = req.query;

	const data = await managerService.AuctionTradesChart(fromDate, toDate, game);
	return response({ res, statusCode: httpStatus.ACCEPTED, data });
};

/**

 * Get Manager private notification

 * @param {*} req

 * @param {*} res

 */

exports.notification = async (req, res) => {
	try {
		const { type, page, limit, status } = req.query;

		const data = await managerService.getNotification(type, page, limit, status);

		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**

 * Change Manager notification status

 * @param {*} req

 * @param {*} res

 */

exports.notificationStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await managerService.changeNotificationStatus(id);

		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

// Create Permission
/**
 * Insert init Permission
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.bulk = async (req, res) => {
	try {
		const data = await managerService.bulk();
		return response({ res, statusCode: httpStatus.ACCEPTED, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

// Role
/**
 * create Role
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.createRole = async (req, res) => {
	try {
		const { name, nickName, permissions } = req.body;

		const data = await managerService.createRole(name, nickName, permissions);
		return response({ res, statusCode: httpStatus.ACCEPTED, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get Roles
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getRoles = async (req, res) => {
	try {
		const data = await managerService.getRoles(req.query);
		return response({ res, statusCode: httpStatus.ACCEPTED, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

exports.findRoleById = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await managerService.findRoleById(id);
		return response({ res, statusCode: httpStatus.ACCEPTED, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * delete Role
 * @param {*} req
 * @param {*} res
 */
exports.deleteRole = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await managerService.deleteRole(id);
		return response({ res, statusCode: httpStatus.ACCEPTED, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * update Role
 * @param {*} req
 * @param {*} res
 */
exports.updateRole = async (req, res) => {
	try {
		const data = await managerService.updateRole(req.body);
		return response({ res, statusCode: httpStatus.ACCEPTED, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

// Manager
/**
 * Get Managers
 * @param {*} req
 * @param {*} res
 */
exports.getManagers = async (req, res) => {
	try {
		const data = await managerService.getManagers(req.query);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * Add Managers
 * @param {*} req
 * @param {*} res
 */
exports.addManagers = async (req, res) => {
	try {
		const data = await managerService.addManagers(req.body, req.files);
		return response({ res, statusCode: httpStatus.CREATED, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * edit Managers
 * @param {*} req
 * @param {*} res
 */
exports.editManagers = async (req, res) => {
	try {
		const data = await managerService.editManagers(req.body, req.files);
		return response({ res, statusCode: httpStatus.ACCEPTED, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * delete Managers
 * @param {*} req
 * @param {*} res
 */
exports.deleteManagers = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await managerService.deleteManagers(id);
		return response({ res, statusCode: httpStatus.ACCEPTED, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * find Managers by id
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.findManagerById = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await managerService.findManagerById(id);
		return response({ res, statusCode: httpStatus.ACCEPTED, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

exports.getAllPermissions = async (req, res) => {
	try {
		const data = await managerService.getAllPermissions(req.query);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

exports.transfer = async (req, res) => {
	const data = await managerService.transfer(req.body.cardTypeId, req.body.count);
	return response({ res, statusCode: httpStatus.OK, data });
};

exports.sendPushNotification = async (req, res) => {
	try {
		const data = await notificationServices.sendPushNotification(req.body);

		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};
