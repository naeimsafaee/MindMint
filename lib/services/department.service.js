const { HumanError, NotFoundError } = require("../services/errorhandler/index");
const Errors = require("../services/errorhandler/MessageText");
const { postgres } = require("./../databases");

async function addDepartment(name, description, headManagerId, managersId) {
	try {
		const _headManager = await postgres.Manager.findOne({ where: { id: headManagerId }, raw: true });
		if (!_headManager) throw new HumanError(Errors.MANAGER_NOT_FOUND.MESSAGE, Errors.MANAGER_NOT_FOUND.CODE);

		const _department = await postgres.Department.build({
			name,
			...(description && { description: description }),
			headManagerId,
		}).save();
		const findAllManagers = await postgres.Manager.findAll({ where: { id: managersId } });

		await _department.addManagers(findAllManagers);

		return _department;
	} catch (e) {
		console.log("error => ", e);
	}
}

async function editDepartment(id, name, description, headManagerId, managersId) {
	let result;

	result = await postgres.Department.findOne({
		where: {
			id,
		},
		include: [{ model: postgres.Manager, as: "managers" }],
	});
	if (!result) {
		throw new NotFoundError(Errors.DEPARTMENT_NOT_FOUND.MESSAGE, Errors.DEPARTMENT_NOT_FOUND.CODE, { id });
	}
	if (name) result.name = name;
	if (description) result.description = description;
	if (headManagerId) result.headManagerId = headManagerId;
	// await result.removeManagers(result.managers);
	// await result.addManagers(managersId);
	if (result.managers)
		await result.managers.forEach((value) => {
			// console.log("manager remove => ", value.id);
			result.removeManagers(value.id);
		});
	if (managersId) {
		await managersId.forEach((value) => {
			// console.log("managerId add => ", value);
			result.addManagers(value);
		});
	}
	await result.save();

	return result;
}

async function getDepartment(id) {
	const _department = await postgres.Department.findOne({
		where: {
			id,
		},
		include: [
			{
				model: postgres.Manager,
				as: "headManager",
			},
		],
	});
	const department = await postgres.Department.findOne({
		where: {
			id,
		},
		nest: true,
		include: [
			{
				model: postgres.Manager,
				as: "headManager",
			},
		],
		raw: true,
	});
	department.headManager = _department.headManager;
	department.managers = await _department.getManagers();

	return department;
}

async function getDepartments(page, limit, order, searchQuery) {
	let offset = (page - 1) * limit;

	let where = {};

	if (searchQuery) {
		where = {
			[postgres.Op.or]: [
				{ name: { [postgres.Op.like]: "%" + searchQuery + "%" } },
				{ "$headManager.name$": { [postgres.Op.like]: "%" + searchQuery + "%" } },
				{ "$headManager.mobile$": { [postgres.Op.like]: "%" + searchQuery + "%" } },
				{ "$headManager.email$": { [postgres.Op.like]: "%" + searchQuery + "%" } },
			],
		};
	}

	const _departments = await postgres.Department.findAll({
		where,
		limit,
		offset,
		include: [
			{
				model: postgres.Manager,
				as: "headManager",
			},
		],
		order: [["createdAt", order]],
	});
	const departments = await postgres.Department.findAndCountAll({
		where,
		limit,
		offset,
		nest: true,
		include: [
			{
				model: postgres.Manager,
				as: "headManager",
			},
		],
		order: [["createdAt", order]],
		raw: true,
	});
	for (let i = 0; i < _departments.length; i++) {
		departments.rows[i].headManager = _departments[i].headManager;
		departments.rows[i].managers = await _departments[i].getManagers();
	}

	return {
		total: departments.count,
		pageSize: limit,
		page,
		data: departments.rows,
	};
}

///////////////////////////////////////////////////////////////////

async function deleteDepartment(id) {
	const result = await postgres.Department.destroy({ where: { id } });
	if (!result) throw new NotFoundError(Errors.DEPARTMENT_NOT_FOUND.MESSAGE, Errors.DEPARTMENT_NOT_FOUND.CODE, { id });
	return result;
}

async function departmentSelector(page, limit, order, searchQuery) {
	let query = {};
	if (searchQuery) {
		query = {
			[postgres.Op.or]: {
				name: { [postgres.Op.iLike]: "%" + searchQuery + "%" },
				description: { [postgres.Op.iLike]: "%" + searchQuery + "%" },
			},
		};
	} else {
		query = {};
	}
	let result,
		offset = (page - 1) * limit;
	try {
		result = await postgres.Department.findAndCountAll({
			where: query,
			limit,
			offset,
			order: [["createdAt", order]],
			attributes: ["id", "name", "description"],
			raw: true,
		});
	} catch (e) {
		console.log("e => ", e);
	}

	return {
		total: result.count,
		pageSize: limit,
		page,
		data: result.rows,
	};
}

module.exports = {
	addDepartment,
	editDepartment,
	getDepartments,
	getDepartment,
	deleteDepartment,
	departmentSelector,
};
