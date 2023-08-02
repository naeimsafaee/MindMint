/*
| Author : Mohammad Ali Ghazi
| Email  : mohamadalghazy@gmail.com
| Date   : Sun Dec 12 2021
| Time   : 1:50:47 PM
 */

const {
	httpResponse: { response, apiError },
	httpStatus,
} = require("./../../utils");
const { transactionService } = require("./../../services");
//
// /**
//  * get user transaction list
//  * @param {*} req
//  * @param {*} res
//  * @returns
//  */
// exports.getTransactions = async (req, res) => {
// 	try {
// 		const data = await transactionService.get(req.query);
// 		return response({ res, statusCode: httpStatus.OK, data });
// 	} catch (e) {
// 		return res.status(e.statusCode).json(e);
// 	}
// };

/**
 * Get users wallets
 */
exports.get = async (req, res) => {
	const data = await transactionService.get(req.query);
	return response({ res, statusCode: httpStatus.OK, data });
};

/**
 * Get finantial report
 */
exports.getFinantialReport = async (req, res) => {
	const data = await transactionService.getFinantialReport(req.query);
	return response({ res, statusCode: httpStatus.OK, data });
};

/**
 * search in user transactions
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.search = async (req, res) => {
	try {
		const data = await transactionService.get(req.body);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get user transactions by id
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getById = async (req, res) => {
	try {
		let { id } = req.params;
		const data = await transactionService.getById(id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

exports.edit = async (req, res) => {
	const io = req.app.get("socketIo");
	const { id, status, index } = req.body;
	const data = await transactionService.edit(id, status, index, io);
	return response({ res, statusCode: httpStatus.OK, data });
};

exports.getBalances = async (req, res) => {
	try {
		let data;
		if (process.env.NODE_ENV === "development")
			data = [
				{
					currency: "BUSD_BSC",
					index: 0,
					address: "0xc8940c73195ece2043c2094d63250c3d0af3136a",
					balance: 391.90126346610595,
					value: 392.68506599303817,
				},
			];
		else data = await transactionService.getBalances(req.query);

		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

exports.getSwaps = async (req, res) => {
	try {
		const data = await transactionService.getSwaps(req.query);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};
