const { hasPermissionThroughRole, hasPermission } = require("../services/permission");
const { NotAuthorizedError } = require("../services/errorhandler");
const Errors = require("../services/errorhandler/MessageText");
function throwError() {
	throw new NotAuthorizedError(Errors.NOT_AUTHORIZE.CODE, Errors.NOT_AUTHORIZE.MESSAGE);
}
exports.permissionMiddleware = (permission) => async (req, res, next) => {
	try {
		if (req.userEntity.isSuperadmin) return next();

		const userHasPermissionThroughRole = await hasPermissionThroughRole(req.userEntity?.id, permission);
		const userHasPermission = await hasPermission(req.userEntity?.id, permission);

		if (userHasPermissionThroughRole || userHasPermission) {
			next();
		} else {
			throwError();
		}
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};
