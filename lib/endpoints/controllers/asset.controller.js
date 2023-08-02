/*
| Author : Mohammad Ali Ghazi
| Email  : mohamadalghazy@gmail.com
| Date   : Sat Dec 04 2021
| Time   : 10:56:38 AM
 */

const {
	httpResponse: { response, apiError },
	httpStatus,
} = require("./../../utils");
const { assetService, walletServices, gatewayServices } = require("./../../services");

/**
 * create wallet for old users
 * @param {*} req
 * @param {*} res
 */
exports.createUsersWallet = async (req, res) => {
	try {
		await assetService.createWalletForUsersByAsset(req.body);
		return response({ res, statusCode: httpStatus.OK });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get user wallet amount
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getWallets = async (req, res) => {
	try {
		const data = await assetService.getWallets(req.userEntity.id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get assets list
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getAssets = async (req, res) => {
	try {
		const data = await assetService.getAssets();
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get asset
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getAssetSingle = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await assetService.getAssetSingle(id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 *
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.depositRequest = async (req, res) => {
	try {
		const data = await walletServices.getDepositAddress({ ...req.body, userId: req.userEntity.id });
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get user transaction list
 * @param req
 * @param res
 * @returns {Promise<*>}
 */
exports.depositList = async (req, res) => {
	try {
		const data = await assetService.readTransactions({
			type: ["DEPOSIT", "TRANSFER"],
			...req.params,
			...req.query,
			userId: req.userEntity.id,
		});
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		// console.log(e);
		return res.status(e.statusCode).json(e);
	}
};

/**
 * user withdraw list
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.withdrawList = async (req, res) => {
	try {
		const data = await assetService.readTransactions({
			type: "WITHDRAW",
			...req.params,
			...req.query,
			userId: req.userEntity.id,
		});
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

exports.confirmWithdraw = async (req, res) => {
	const io = req.app.get("socketIo");
	const data = await assetService.confirmWithdraw(req.body, req.userEntity, io);
	return response({ res, statusCode: httpStatus.OK, data });
};

exports.withdrawRequest = async (req, res) => {
	const io = req.app.get("socketIo");
	const data = await assetService.withdrawRequest({ ...req.body, user: req.userEntity }, io);
	return response({ res, statusCode: httpStatus.OK, data });
};

exports.getSwapRate = async (req, res) => {
	const { page, limit } = req.query;
	const data = await assetService.getSwapRate(page, limit);
	return response({ res, statusCode: httpStatus.OK, data });
};
