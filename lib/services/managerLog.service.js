const { postgres } = require("../databases");
const { NotFoundError, HumanError } = require("./errorhandler");
const Errors = require("./errorhandler/MessageText");
const { dateQueryBuilder } = require("../utils/dateQueryBuilder");

/**
 * get Manager Log list
 */
async function getManagerLogs(data) {
	const { page, limit, order, sort, createdAt, id, action, managerId, email, userName, fromDate, toDate } = data;

	const offset = (page - 1) * limit;

	const query = {};
	const query2 = {};

	if (createdAt) {
		const { start, end } = dateQueryBuilder(createdAt);
		query.createdAt = { [postgres.Op.gte]: start, [postgres.Op.lte]: end };
	}

	if (id) query.id = id;
	if (managerId) query.managerId = managerId;
	if (action) query.action = action;
	if (userName) query2.name = { [postgres.Op.iLike]: `%${userName}%` };
	if (email) query2.email = { [postgres.Op.iLike]: `%${email}%` };
	if (fromDate) query.createdAt = { [postgres.Op.gte]: fromDate };
	if (toDate) query.createdAt = { [postgres.Op.lte]: toDate };

	const result = await postgres.ManagerLog.findAndCountAll({
		where: query,
		limit,
		offset,
		order: [[sort, order]],
		include: [
			{
				model: postgres.Manager,
				where: query2,
				attributes: { exclude: ["password", "salt"] },
			},
		],
	});

	return {
		total: result.count,
		pageSize: limit,
		page,
		data: result.rows,
	};
}

/**
 * Find Manager Log By Id
 * @param {*} id
 * @returns
 */
function getManagerLogById(id) {
	return new Promise(async (resolve, reject) => {
		let result = await postgres.ManagerLog.findOne({
			where: { id },
			nest: true,
			include: [
				{
					model: postgres.Manager,
					attributes: { exclude: ["password", "salt"] },
				},
			],
		});

		if (!result)
			return reject(
				new NotFoundError(Errors.MANAGER_LOG_NOT_FOUND.MESSAGE, Errors.MANAGER_LOG_NOT_FOUND.CODE, { id }),
			);

		return resolve(result);
	});
}

module.exports = {
	getManagerLogs,
	getManagerLogById,
};
