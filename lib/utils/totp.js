const totp = require("totp-generator");
const otpGenerator = require("otp-generator");
var base32 = require("hi-base32");

const generate = () => {
	return base32.encode(otpGenerator.generate(15, { alphabets: true }), "RFC4648", {
		padding: false,
	});
};

const isValid = (token, key) => {
	const code = totp(token);
	return code == key;
};

module.exports = {
	generate,
	isValid,
};
