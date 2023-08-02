const {
	httpResponse: { response },
	httpStatus,
} = require("../../../utils");
const { postgres } = require("../../../databases");
const { assignGhostCard } = require("../../../services/user.service");


exports.info = async (req, res) => {
	const user = await postgres.User.findOne({
		where: { id: req.userEntity.id },
		attributes: { exclude: ["password", "salt"] },
	});

	let GhostMode = await assignGhostCard(user);

	const data = {
		user: user,
		GhostMode: GhostMode,
	};

	return response({ res, statusCode: httpStatus.OK, data });
};
