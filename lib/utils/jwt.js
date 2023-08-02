const JWT = require("jsonwebtoken");
const config = require("config");
const userConfig = config.get("authentication.user");
const agentConfig = config.get("authentication.agent");
const managerConfig = config.get("authentication.manager");
const publicConfig = config.get("authentication.public");

function generate(payload, secret, expiresIn, userType) {
	try {
		if (userType == "manager") {
			secret = managerConfig.secret;
		} else if (userType == "user") {
			secret = userConfig.secret;
		} else if (userType == "agent") {
			secret = agentConfig.secret;
		} else {
			secret = publicConfig.secret;
		}
		const token = JWT.sign(payload, secret, { expiresIn: expiresIn });
		return token;
	} catch (e) {
		return null;
	}
}

function decode() {
	try {
		const decoded = JWT.decode(token, { complete: true });
		return decoded;
	} catch (e) {
		return null;
	}
}

function verify(token, secret, userType) {
	try {
		if (userType == "manager") secret = managerConfig.secret;
		else if (userType == "user") secret = userConfig.secret;
		else if (userType == "agent") secret = agentConfig.secret;
		else secret = publicConfig.secret;
		const verified = JWT.verify(token, secret, { complete: true });
		return verified?.payload ?? null;
	} catch (e) {
		return null;
	}
}

class Token {
	constructor(userId, userType) {
		this.userId = userId;
		this.userType = userType;
		this.date = new Date();
		this.config = this.userType == "manager" ? managerConfig : userConfig;
		this.secret = this.config.secret;
		this.accessExpiresAt = +this.date + +this.config.accessExpiry * 1000;
		this.refreshExpiresAt = +this.date + +this.config.refreshExpiry * 1000;
		this.refreshExpiry = this.config.refreshExpiry;
		this.accessExpiry = this.config.accessExpiry;
	}

	generateRefresh() {
		return generate(
			{
				id: this.userId,
				userType: this.userType,
				tokenType: "refresh",
				expiresAt: this.refreshExpiresAt,
			},
			this.secret,
			this.refreshExpiry,
			this.userType,
		);
	}

	generateAccess() {
		return generate(
			{
				id: this.userId,
				userType: this.userType,
				tokenType: "access",
				expiresAt: this.accessExpiresAt,
			},
			this.secret,
			this.accessExpiry,
			this.userType,
		);
	}
	generateAccessUser() {
		return generate(
			{
				id: this.userId,
				userType: this.userType,
				tokenType: "access",
				expiresAt: this.accessExpiresAt,
			},
			this.secret,
			this.accessExpiry,
			this.userType,
		);
	}
}

module.exports = {
	generate,
	decode,
	verify,
	Token,
};
