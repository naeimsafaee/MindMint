const {
	httpResponse: { response, apiError },
	httpStatus,
} = require("../../utils");
const { languageService } = require("../../services");

/**
 * Get Languages
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getAllLanguages = async (req, res) => {
	try {
		const data = await languageService.getAllLanguages(req.query);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * find and return language by id
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getLanguageById = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await languageService.getLanguageById(id);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * add language
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.addLanguage = async (req, res) => {
	try {
		const { name, code } = req.body;
		const data = await languageService.addlanguage(name, code, req.files);
		return response({ res, statusCode: httpStatus.CREATED, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * Edit Language
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.editLangauge = async (req, res) => {
	try {
		const { id, name, code, flag } = req.body;
		const data = await languageService.editLangauge(id, name, code, flag, req.files);
		return response({ res, statusCode: httpStatus.ACCEPTED, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * Delete Langauge
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.deleteLanguage = async (req, res) => {
	try {
		const { id } = req.params;
		const data = await languageService.deleteLanguage(id);
		return response({ res, statusCode: httpStatus.ACCEPTED, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};
