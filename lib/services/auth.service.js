const { HumanError, NotFoundError, InvalidRequestError } = require("./errorhandler");
const Errors = require("./errorhandler/MessageText");
const { password, jwt } = require("./../utils");
// const Web3 = require("web3");
const { postgres } = require("../databases");

// function emptyAddress() {
// 	throw new InvalidRequestError(Errors.EMPTY_ADDRESS.CODE, Errors.EMPTY_ADDRESS.MESSAGE);
// }

// function invalidAddress() {
// 	throw new InvalidRequestError(Errors.INVALID_ADDRESS.CODE, Errors.INVALID_ADDRESS.MESSAGE);
// }

const managerLogin = async (email, _password) => {
	return new Promise(async (resolve, reject) => {
		const manager = await postgres.Manager.findOne({ where: { email } });
		if (!manager)
			return reject(new NotFoundError(Errors.USER_NOT_FOUND.MESSAGE, Errors.USER_NOT_FOUND.CODE, { email }));

		const checkPassword = await password.validate(_password, manager.salt, manager.password);

		if (!checkPassword && email)
			return reject(
				new HumanError(Errors.EMAIL_AND_PASSWORD_INCORRECT.MESSAGE, Errors.EMAIL_AND_PASSWORD_INCORRECT.CODE),
			);

		// generate user auth token
		const _token = new jwt.Token(manager.id, "manager");

		const refreshToken = _token.generateRefresh();
		const accessToken = _token.generateAccess();

		await postgres.ManagerSession.create({
			manager: manager.id,
			accessToken,
			refreshToken,
			accessExpiresAt: _token.accessExpiresAt,
			refreshExpiresAt: _token.refreshExpiresAt,
		});

		resolve({
			refreshToken: {
				token: refreshToken,
				expiresAt: _token.refreshExpiresAt,
			},
			accessToken: {
				token: accessToken,
				expiresAt: _token.accessExpiresAt,
			},
		});
	});
};
// const userRegister = async (req) => {
// 	const address = req.body.address;

// 	if (!address) return emptyAddress();

// 	const isAddressValid = Web3.utils.isAddress(address);
// 	if (!isAddressValid) return invalidAddress();

// 	let user = await postgres.User.findOne({ where: { address } });
// 	if (!user) user = await new postgres.User({ address }).save();

// 	return user;
// };

module.exports = {
	managerLogin,
	// userRegister,
};
