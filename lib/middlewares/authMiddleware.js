const { httpResponse, jwt } = require("./../utils");
const { redis, postgres } = require("./../databases");
const { NotAuthenticatedError } = require("../services/errorhandler");
const Errors = require("../services/errorhandler/MessageText");
const { encryption } = require("./../utils");

function throwError() {
	throw new NotAuthenticatedError(Errors.UNAUTHORIZED.CODE, Errors.UNAUTHORIZED.MESSAGE);
}

const userAuth = (userType, tokenType, requestType) => async (req, res, next) => {
	try {
		//? Check token existance
		let authorization = req?.headers?.authorization ?? null;

		if (!authorization) throwError();

		const tokenArray = authorization?.split(" ");
		if (tokenArray[0] != "Bearer" || !tokenArray[1]) throwError();

		let token = tokenArray[1];

		//? Check token payload
		let payload = null;

		try {
			payload = jwt.verify(token, null, userType);
			if (!payload?.id || userType !== payload.userType || tokenType !== payload.tokenType) throwError();
		} catch (e) {
			throwError();
		}

		//? find user
		let user = null,
			sessionModel,
			session;

		if (userType == "user") {
			user = await postgres.User.findOne({ where: { id: payload.id } });

			sessionModel = postgres.UserSession;
		}

		if (userType == "agent") {
			user = await postgres.User.findOne({ where: { id: payload.id, level: "AGENT" } });

			sessionModel = postgres.AgentSession;
		}

		if (userType == "manager") {
			user = await postgres.Manager.findOne({ where: { id: payload.id } });

			sessionModel = postgres.ManagerSession;
		}
		if (!user) throwError();

		if (tokenType == "refresh")
			session = await sessionModel.findOne({
				where: { refreshToken: token, refreshExpiresAt: { [postgres.Op.gt]: +new Date() } },
			});
		else {
			session = await sessionModel.findOne({
				where: { userId: payload.id, accessExpiresAt: { [postgres.Op.gt]: +new Date() } },
			});
		}

		if (!session) throwError();

		if (encryption.decrypt(session.accessToken) !== token) {
			throwError();
		}

		if (userType === "user") {
			const deviceType = req.get("device-type") ? "app" : "pc";
			const deviceId = req.get("device-id");

			const devices = JSON.parse(session.devices);

			const result = devices[deviceType].filter((device) => device.deviceId === deviceId);

			if (!result.length) {
				throwError();
			}
		}

		req.sessionEntity = session;

		req.userEntity = user;

		next();
	} catch (e) {
		if (!e.statusCode) e = { statusCode: 500, status: "Internal Error", message: e.message };
		return res.status(e.statusCode).json(e);
	}
};

const checkAccess = (req, res, next) => {
	try {
		let authorization = req?.headers?.["x-api-key"] ?? req?.headers?.authorization ?? null;

		if (!authorization) throwError();

		const tokenArray = authorization?.split(" ");

		if (tokenArray[0] != "Bearer" || !tokenArray[1]) throwError();

		token = tokenArray[1];

		if (token !== "49E9F731-4F72-428C-A099-130533D2A55A") throwError();

		next();
	} catch (error) {
		return res.status(error.statusCode).json(error);
	}
};

module.exports = {
	userAuthMiddleware: userAuth("user", "access"),
	userAuthRefreshMiddleware: userAuth("user", "refresh"),
	agentAuthMiddleware: userAuth("agent", "access"),
	agentAuthRefreshMiddleware: userAuth("agent", "refresh"),
	managerAuthMiddleware: userAuth("manager", "access"),
	managerAuthRefreshMiddleware: userAuth("manager", "refresh"),
	checkAccess,
};
