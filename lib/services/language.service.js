const { postgres } = require("../databases");
const { NotFoundError, HumanError, InvalidRequestError, ConflictError } = require("./errorhandler");
const Errors = require("./errorhandler/MessageText");

/**
 * Get Languages For Public
 * @returns
 */
function getPublic(page, limit, order) {
	return new Promise(async (resolve, reject) => {
		let offset = 0 + (page - 1) * limit,
			query = {};

		let result = await postgres.Language.findAndCountAll({
			where: query,
			offset,
			limit,
			order: [["createdAt", order]],
		});

		resolve({
			total: result.count,
			pageSize: limit,
			page,
			data: result.rows,
		});
	});
}

/**
 * Get all Languages
 * @returns
 */
function getAllLanguages(data) {
	return new Promise(async (resolve, reject) => {
		let { id, page, limit, order, name, code, createdAt } = data;

		let result = {},
			query = {},
			offset = (page - 1) * limit;

		if (id) query.id = id;
		if (name) query.name = { [postgres.Op.iLike]: "%" + name + "%" };
		if (code) query.code = { [postgres.Op.iLike]: "%" + code + "%" };
		if (createdAt)
			query.createdAt = postgres.sequelize.where(
				postgres.sequelize.fn("date", postgres.sequelize.col("createdAt")),
				"=",
				createdAt,
			);

		result = await postgres.Language.findAndCountAll({
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
 *
 * @param {*} id
 * @returns
 */
function getLanguageById(id) {
	return new Promise(async (resolve, reject) => {
		let result = await postgres.Language.findByPk(id);

		if (!result)
			return reject(new NotFoundError(Errors.LANGUAGE_NOT_FOUND.MESSAGE, Errors.LANGUAGE_NOT_FOUND.CODE, { id }));

		return resolve(result);
	});
}

/**
 * Add Langauge
 * @param {*} name
 * @param {*} code
 * @param {*} flag
 * @returns
 */

function addlanguage(name, code, files) {
	return new Promise(async (resolve, reject) => {
		let data = { flag: null };

		if (Object.keys(files).length) {
			for (let key in files) {
				let file = files[key].shift();

				data[key] = [
					{
						name: file.newName,
						key: file.key,
						location: file.location,
					},
				];
			}
		}

		let result = await postgres.Language.create({
			name,
			code,
			...data,
		});

		if (!result) return reject(new HumanError(Errors.LANGUAGE_FAILED.MESSAGE, Errors.LANGUAGE_FAILED.CODE));

		return resolve("Successful");
	});
}

/**
 * Edit Language
 * @param {*} id
 * @param {*} name
 * @param {*} code

 * @returns
 */
function editLangauge(id, name, code, flag, files = {}) {
	return new Promise(async (resolve, reject) => {
		let update = {};

		if (Object.keys(files).length) {
			for (let key in files) {
				let file = files[key].shift();

				update[key] = [
					{
						name: file.newName,
						key: file.key,
						location: file.location,
					},
				];
			}
		}
		if (name) update.name = name;

		if (code) update.code = code;

		if (flag === "null") update.flag = null;

		let result = await postgres.Language.update(update, {
			where: { id: id },
		});

		if (!result.shift())
			return reject(new NotFoundError(Errors.LANGUAGE_NOT_FOUND.MESSAGE, Errors.LANGUAGE_NOT_FOUND.CODE, { id }));

		return resolve("Successful");
	});
}
/**
 * Delete Language
 * @param {*} id
 * @returns
 */
function deleteLanguage(id) {
	return new Promise(async (resolve, reject) => {
		let result = await postgres.Language.destroy({ where: { id } });

		if (!result)
			return reject(new NotFoundError(Errors.LANGUAGE_NOT_FOUND.MESSAGE, Errors.LANGUAGE_NOT_FOUND.CODE, { id }));

		return resolve("Successful");
	});
}
module.exports = {
	getPublic,
	getAllLanguages,
	getLanguageById,
	addlanguage,
	editLangauge,
	deleteLanguage,
};
