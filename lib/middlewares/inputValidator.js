const Joi = require("joi");
const { pick } = require("../utils");

const validate = (schema) => (req, res, next) => {
	const validSchema = pick(schema, ["params", "query", "body"]);

	const object = pick(req, Object.keys(validSchema));

	const { value, error } = Joi.compile(validSchema)
		.prefs({ errors: { label: "key" } })
		.validate(object);

	if (error && error.details && error.details.length > 0) {
		let errorMessage = error.details[0].message.replace('"', "").replace('"', "");

		return res.status(400).json({
			message: "",
			error: errorMessage,
		});
	}
	Object.assign(req, value);
	return next();
};

module.exports = validate;
