const NotAuthenticatedError = require("./NotAuthenticatedError");
const NotAuthorizedError = require("./NotAuthorizedError");

const NotFoundError = require("./NotFound");
const HumanError = require("./HumanError");
const InvalidRequestError = require("./InvalidRequestError");
const ConflictError = require("./Conflict");
const InternalError = require("./InternalError");

module.exports = {
	HumanError,
	InvalidRequestError,
	NotAuthenticatedError,
	NotFoundError,
	ConflictError,
	NotAuthorizedError,
	InternalError,
};
