const { postgres } = require("../databases");
const { default: axios } = require("axios");
const { sliceWinners } = require("./competition.service");

/**
 * update user kyc number in stat
 * @param {*} args
 * @param {*} model
 */
exports.updateKyc = async (args, model) => {
	model.increment("kyc");
};

/**
 * update income in stat table
 * @param {*} amount
 * @param {*} model
 */
exports.updateIncome = async (args, model) => {
	let fee;

	if (args.type === "DEPOSIT") fee = args.depositFee;

	if (args.type === "WITHDRAW") fee = args.withdrawFee;

	model.increment("income", { by: +fee });
};

/**
 * add count cards wizard
 * @param {*} args
 */
exports.wizardAddCardsCount = async (args, model, name) => {
	return new Promise(async (resolve, reject) => {
		//user statistics
		let { userId, cardId } = args;
		//user Statistics if not exist
		let userStatistics = await postgres.UserStatistic.findOne({ where: { userId } });
		if (!userStatistics)
			userStatistics = await postgres.UserStatistic.create({
				userId,
			});

		let cardIsCommon = await postgres.Card.findOne({
			where: {
				id: cardId,
			},
		});

		if (!cardIsCommon.dataValues.isCommon) {
			await userStatistics.update({
				cardsnotiscommon: postgres.sequelize.literal("cardsnotiscommon + 1"),
				cardscount: postgres.sequelize.literal("cardscount + 1"),
			});

			//add to userActivity
			await postgres.UserActivity.create({
				userId,
				title: "user give card not common in wizard ",
				tag: "WIZARD",
			});
		} else {
			await userStatistics.update({ cardscount: postgres.sequelize.literal("cardscount + 1") });

			//add to userActivity
			await postgres.UserActivity.create({ userId, title: "user give card common in wizard ", tag: "WIZARD" });
		}

		resolve();
	});
};

/**
 * add count cards referral
 * @param {*} args
 */
exports.referralAddCards = async (args, model, name) => {
	return new Promise(async (resolve, reject) => {
		//user statistics
		let { payerId } = args;
		//user Statistics if not exist
		let userStatistics = await postgres.UserStatistic.findOne({ where: { userId: payerId } });
		if (!userStatistics)
			userStatistics = await postgres.UserStatistic.create({
				userId: payerId,
			});
		await userStatistics.update({ referraledcardbuys: postgres.sequelize.literal("referraledcardbuys + 1") });

		//add to userActivity
		await postgres.UserActivity.create({
			userId: payerId,
			title: "user referraled buyes card ",
			tag: "REFERRALEDCARDBUYS",
		});

		resolve();
	});
};

/**
 * add count referral userStatistics
 * @param {*} args
 */
exports.referralAddCount = async (args, model, name) => {
	return new Promise(async (resolve, reject) => {
		//user statistics
		let { id } = args;
		//user Statistics if not exist
		let userStatistics = await postgres.UserStatistic.findOne({ where: { userId: id } });
		if (!userStatistics)
			userStatistics = await postgres.UserStatistic.create({
				userId: id,
			});
		await userStatistics.update({ referraled: postgres.sequelize.literal("referraled + 1") });

		//add to userActivity
		await postgres.UserActivity.create({
			userId: id,
			title: "new user registered from this user referral code",
			tag: "REFERRAL",
		});

		resolve();
	});
};

//maintenance
exports.checkSystemStatus = async () => {
	const systemStatus = await postgres.Settings.findAll({
		where: {
			type: "MAINTENANCE",
		},
		attributes: {
			exclude: ["createdAt", "updatedAt", "deletedAt"],
		},
	});
	return systemStatus;
	/*return new Promise(async (resolve, reject) => {
        const systemStatus = await postgres.Settings.findOne({ where: { type: "SYSTEM", key: "status" }, raw: true });
        let status = false;
        if (systemStatus) status = systemStatus.value === "true" ? true : false;

            return resolve(status);
    });*/
};

exports.checkSystemHealth = async (req, res) => {
	// System Status
	const systemStatus = await postgres.Settings.findOne({ where: { type: "SYSTEM", key: "status" }, raw: true });
	if (systemStatus) {
		if (systemStatus.value === "false") {
			return res.status(400).json({ message: "System Status Failed" });
		}
	}

	// Database Connection
	try {
		await postgres.sequelize.authenticate();
	} catch (error) {
		return res.status(400).json({ message: "Database connection Failed" });
	}

	// Response Time
	const currentTime = new Date().getTime();
	await postgres.User.findOne();
	const passedTime = new Date().getTime();

	const diffInSeconds = (passedTime - currentTime) / 1000;

	if (diffInSeconds > 60) {
		return res.status(400).json({ message: "Database Response Time Failed" });
	}

	// Main Domain Response Check
	const url = process.env.NODE_ENV === "development" ? "https://dev.stylike.io/" : "https://stylike.io/";
	const axiosResponse = await axios.get(url);
	if (axiosResponse.status !== 200) {
		return res.status(400).json({ message: "Main Domain Failed" });
	}

	return res.status(200).json({ message: "OK" });
};

exports.getAppVersion = () => {
	return new Promise(async (resolve, reject) => {
		const result = await postgres.Settings.findAll({
			where: { type: "APP_DETAIL" },
			raw: true,
		});

		return resolve(result);
	});
};

exports.calculator = async (data) => {
	const { cardTypeId, rankPosition, days } = data;
	let { cameraLevel } = data;

	cameraLevel = cameraLevel * days;

	const camera = await postgres.CardType.findOne({
		where: { id: cardTypeId },
	});

	const positions = await postgres.Prize.findAll({
		where: { cardTypeId: camera.id },
	});

	const camera_level = await postgres.TokenPrize.findOne({
		where: { cardTypeId: camera.id },
	});

	let main_position;
	for (const position of positions) {
		if (sliceWinners(position.tier, rankPosition)) {
			main_position = position;
			break;
		}
	}

	return {
		rank_position_prize: parseFloat(main_position.amount) * days,
		camera_level_prize: parseFloat(camera_level.amount) * days + parseFloat(cameraLevel),
	};
};
