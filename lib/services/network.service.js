const { postgres } = require("./../databases");
const { NotFoundError, HumanError, InvalidRequestError, ConflictError } = require("./errorhandler");
const Errors = require("./errorhandler/MessageText");
/**
 * Get all network from user and manager
 * @param {*} id
 * @param {*} page
 * @param {*} limit
 * @returns
 */
function get(data) {
	return new Promise(async (resolve, reject) => {
		let { id, page, limit, order, name, type, isDefault, sort, searchQuery } = data;

		let result = {},
			query = {},
			offset = (page - 1) * limit;


		if (searchQuery) {
			query = {
				[postgres.Op.or]: {
					name: { [postgres.Op.iLike]: "%" + searchQuery + "%" },
					type: { [postgres.Op.iLike]: "%" + searchQuery + "%" },
				},
			};
		}

		if (id) query.id = id;

		if (name) query.name = { [postgres.Op.iLike]: "%" + name + "%" };

		if (type) query.type = { [postgres.Op.iLike]: "%" + type + "%" };

		if (typeof isDefault === "boolean") query.isDefault = isDefault;

		result = await postgres.Network.findAndCountAll({
			where: query,
			limit,
			offset,
			order: [[sort, order]],
			raw: true,
		});

		resolve({
			total: result.count ?? 0,
			pageSize: limit,
			page,
			data: result.rows,
		});
	});
}

/**
 * Get all network selector from user and manager
 * @param {*} id
 * @param {*} page
 * @param {*} limit
 * @returns
 */
function networkSelector(data) {
	return new Promise(async (resolve, reject) => {
		let { searchQuery, page, limit, order } = data;

		let query = {};
		if (searchQuery) {
			query = {
				[postgres.Op.or]: {
					name: { [postgres.Op.iLike]: "%" + searchQuery + "%" },
					type: { [postgres.Op.iLike]: "%" + searchQuery + "%" },
				},
			};
		} else {
			query = {};
		}
		let result = {},
			offset = (page - 1) * limit;

		result = await postgres.Network.findAndCountAll({
			where: query,
			limit,
			offset,
			order: [["createdAt", order]],
			raw: true,
		});

		resolve({
			total: result.count ?? 0,
			pageSize: limit,
			page,
			data: result.rows,
		});
	});
}

/**
 * Set asset network
 * @param {*} name
 * @param {*} isDefault
 * @param {*} type
 * @returns
 */

function set(name, isDefault, type) {
	return new Promise(async (resolve, reject) => {
		let result = await postgres.Network.create({ name, isDefault, type });

		if (!result) return reject(new HumanError(Errors.NETWORK_FAILED.MESSAGE, Errors.NETWORK_FAILED.CODE));

		return resolve("Successful");
	});
}

/**
 * Edit asset network to the user and manager
 * @param {*} id
 * @param {*} name
 * @param {*} isDefault
 * @param {*} type

 * @returns
 */
function edit(data) {
	return new Promise(async (resolve, reject) => {
		let result = await postgres.Network.update(data, {
			where: { id: data.id },
		});

		if (!result.shift())
			return reject(
				new NotFoundError(Errors.NETWORK_NOT_FOUND.MESSAGE, Errors.NETWORK_NOT_FOUND.CODE, { id: data.id }),
			);

		return resolve("Successful");
	});
}

/**
 * Delete public and private networks to the user and manager
 * @param {*} id
 * @returns
 */
function del(id) {
	return new Promise(async (resolve, reject) => {
		let result = await postgres.Network.destroy({ where: { id } });

		if (!result)
			return reject(new NotFoundError(Errors.NETWORK_NOT_FOUND.MESSAGE, Errors.NETWORK_NOT_FOUND.CODE, { id }));

		return resolve("Successful");
	});
}

/**
 *
 * @param {*} id
 * @returns
 */
function findById(id) {
	return new Promise(async (resolve, reject) => {
		let result = await postgres.Network.findByPk(id);

		if (!result)
			return reject(new NotFoundError(Errors.NETWORK_NOT_FOUND.MESSAGE, Errors.NETWORK_NOT_FOUND.CODE, { id }));

		return resolve(result);
	});
}

module.exports = {
	set,
	get,
	edit,
	del,
	findById,
	networkSelector,
};
