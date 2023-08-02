/*
 | Author : Mohammad Ali Ghazi
 | Email  : mohamadalghazy@gmail.com
 | Date   : Tue Sep 07 2021
 | Time   : 8:38:18 PM
 */

const {
	httpResponse: { response, apiError },
	httpStatus,
} = require("../../utils");
const { departmentService } = require("../../services");
const { categoryService } = require("./../../services");

/**
 * Get department
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.addDepartment = async (req, res) => {
	const { name, description, headManagerId, managersId } = req.body;
	const data = await departmentService.addDepartment(name, description, headManagerId, managersId);
	return response({ res, statusCode: httpStatus.OK, data });
};
/////////////////////////////////////////////////////////////////
/**
 * edit department
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.editDepartment = async (req, res) => {
	const { id, name, description, headManagerId, managersId /*,addedManagersId, removedManagersId*/ } = req.body;
	const data = await departmentService.editDepartment(
		id,
		name,
		description,
		headManagerId,
		managersId,
		// addedManagersId,
		// removedManagersId,
	);
	return response({ res, statusCode: httpStatus.ACCEPTED, data });
};

/**
 * Get a department
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getDepartment = async (req, res) => {
	const { id } = req.params;
	const data = await departmentService.getDepartment(id);
	return response({ res, statusCode: httpStatus.OK, data });
};

/**
 * Get all departments
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getDepartments = async (req, res) => {
	const { page, limit, order, searchQuery} = req.query;
	const data = await departmentService.getDepartments(page, limit, order, searchQuery);
	return response({ res, statusCode: httpStatus.OK, data });
};

/**
 * delete department
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.deleteDepartment = async (req, res) => {
	const { id } = req.params;
	const data = await departmentService.deleteDepartment(id);
	return response({ res, statusCode: httpStatus.ACCEPTED, data });
};

/**
 * Department Selector
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.departmentSelector = async (req, res) => {
	// TODO images
	const { page, limit, order, searchQuery } = req.query;
	const data = await departmentService.departmentSelector(page, limit, order, searchQuery);
	return response({ res, statusCode: httpStatus.OK, data });
};
