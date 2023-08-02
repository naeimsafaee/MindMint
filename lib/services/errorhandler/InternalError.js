const { INTERNAL_SERVER_ERROR } = require("./StatusCode");

module.exports = class Internal extends Error {
	status;
	statusCode;
	message;
	fields;

	constructor(errors, code, fields) {
		super("Internal");

		Error.captureStackTrace(this, Internal);

		this.status = INTERNAL_SERVER_ERROR.status;
		this.statusCode = INTERNAL_SERVER_ERROR.code;
		this.lang = {
			code,
		};
		this.message = errors;
		this.fields = fields;
	}
};
