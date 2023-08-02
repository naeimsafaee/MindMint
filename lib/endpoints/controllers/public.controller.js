const {
	httpResponse: { response },
	httpStatus,
} = require("./../../utils");
const { languageService, assetService, statisticService } = require("./../../services");
const { postgres } = require("../../databases");
const moment = require("moment");

exports.attributes = async (req, res) => {
	const fileName = req.params.filename;

	if (fileName.indexOf(".json")) {
		const edition = fileName.split(".")[0];

		const card = await postgres.Card.findOne({
			where: { tokenId: edition },
			include: [
				{
					model: postgres.CardType,
					required: true,
				},
			],
			paranoid: false,
		});

		let attributes = card.attributes;

		if (card.deletedAt)
			return res.send({
				image: "Notfound.png",
				attributes: [
					{
						trait_type: "Status",
						value: "Deactivated",
					},
				],
			});

		return res.send({
			name: card.name,
			description: card.description,
			image: card.ipfsImage,
			dna: card.serialNumber,
			edition: card.edition,
			category: card.cardType.name,
			date: moment(card.createdAt).unix(),
			attributes: attributes,
		});
	} else {
		return res.status(404).send({});
	}
};

/**
 * Get all categories
 */
exports.getLanguages = async (req, res) => {
	try {
		const { page, limit, order } = req.query;
		const data = await languageService.getPublic(page, limit, order);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * get asset list
 */
exports.getAsset = async (req, res) => {
	try {
		const data = await assetService.getAsset(req.query);
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * send data from socket by games
 */
exports.addSocket = async (req, res) => {
	try {
		const { roomId, eventName, data } = req.body;

		let io = req.app.get("socketIo");

		io.to(roomId).emit(eventName, data);

		return response({ res, statusCode: httpStatus.OK, data: "Successfull" });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

/**
 * check system status
 * maintenance
 */
exports.checkSystemStatus = async (req, res) => {
	const data = await statisticService.checkSystemStatus();
	return res.send({
		data: data,
	});
};

/**
 * check system status
 */
exports.checkSystemHealth = async (req, res) => {
	const data = await statisticService.checkSystemHealth(req, res);
};

exports.getAppVersion = async (req, res) => {
	try {
		const data = await statisticService.getAppVersion();
		return response({ res, statusCode: httpStatus.OK, data });
	} catch (e) {
		return res.status(e.statusCode).json(e);
	}
};

//calculator
exports.calculator = async (req, res) => {
	const data = await statisticService.calculator(req.body);
	return response({ res, statusCode: httpStatus.OK, data });
};

// App Config
exports.getAppConfigs = async (req, res) => {
	let configs = {};

	const iosConfigs = await postgres.AppConfig.findAll({
		where: { type: "IOS" },
		attributes: ["key", "value", "updatedAt"],
	});
	configs["IOS"] = iosConfigs;

	const androidConfigs = await postgres.AppConfig.findAll({
		where: { type: "ANDROID" },
		attributes: ["key", "value", "updatedAt"],
	});
	configs["ANDROID"] = androidConfigs;

	return response({ res, statusCode: httpStatus.OK, data: configs });
};
