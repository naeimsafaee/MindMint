const { jwt } = require("./../../../utils");
const { postgres } = require("./../../../databases");

module.exports = class User {
	constructor(token) {
		this.token = token;

		this.user = null;
	}

	async authentication() {
		const tokenArray = this.token?.split(" ");

		if (tokenArray?.[0] != "Bearer" || !tokenArray?.[1]) return null;

		const _token = tokenArray[1];

		//? Check token payload
		let payload = null;

		try {
			payload = jwt.verify(_token, null, "user");

			if (!payload?.id || payload.userType !== "user" || payload.tokenType !== "access") return null;
		} catch (e) {
			return null;
		}

		let user = await postgres.User.findOne({ where: { id: payload.id } });

		return user;
	}

	async managerAuthentication() {
		const tokenArray = this.token?.split(" ");

		if (tokenArray?.[0] != "Bearer" || !tokenArray?.[1]) return null;

		const _token = tokenArray[1];

		//? Check token payload
		let payload = null;

		try {
			payload = jwt.verify(_token, null, "manager");

			if (!payload?.id || payload.userType !== "manager" || payload.tokenType !== "access") return null;
		} catch (e) {
			return null;
		}

		let user = await postgres.Manager.findOne({ where: { id: payload.id } });

		return user;
	}
};
