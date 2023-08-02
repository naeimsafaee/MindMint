const { postgres, redis } = require("../../databases");
const { Permission, Per } = postgres;

exports.hasPermission = async (id, permission) => {
	const getPermissions = await postgres.Permission.findOne({
		where: {
			name: permission,
		},
		include: [{ model: postgres.Manager, as: "managers", where: { id } }],
	});

	return getPermissions ? true : false;
};

exports.hasPermissionThroughRole = async (id, permission) => {
	const manager = await postgres.Manager.findByPk(id, {
		include: [
			{
				model: postgres.Role,
				nested: true,
				through: {
					attributes: [],
				},
				as: "roles",
			},
		],
	}).then((data) => JSON.parse(JSON.stringify(data)));

	const getPermissionsRoles = await postgres.Permission.findOne({
		where: {
			name: permission,
		},

		include: [
			{
				model: postgres.Role,

				through: {
					attributes: [],
				},

				as: "roles",
			},
		],
	}).then((data) => JSON.parse(JSON.stringify(data)));

	const data = getPermissionsRoles?.roles.filter(function (itemOne) {
		return manager?.roles.some(function (itemTwo) {
			return itemOne.id === itemTwo.id;
		});
	});

	return data?.length > 0 ? true : false;
};
exports.hasRole = async (id, role) => {
	const gerRole = await postgres.Role.findOne({
		where: {
			name: role,
		},
		include: [{ model: postgres.Manager, as: "managers", where: { id } }],
	});

	return gerRole ? true : false;
};
