const { postgres, redis } = require("./../databases");
const { HumanError } = require("./errorhandler");
const Errors = require("./errorhandler/MessageText");
const NotFoundError = require("./errorhandler/NotFound");
const em = require("exact-math");
const { jwt, mail, sms, otpGenerator } = require("../utils");
const job = require("../job/index");

/**
 * get user wallet information
 * @param {*} userId
 * @returns
 */
async function getWallets(userId) {
	return await postgres.Asset.findAll({
		where: {
			isActive: true,
		},
		nest: true,
		attributes: ["id", "coin", "name", "precision", "type", "canDeposit", "canWithdraw", "icon"],
		include: {
			model: postgres.UserWallet,
			nested: true,
			where: {
				userId,
			},
			attributes: ["id", "assetId", "userId", "amount", "frozen", "pending", "isLocked"],
			as: "wallets",
			required: false,
		},
		raw: true,
	});
}

/**
 * create new wallet for old users
 */
function createWalletForUsersByAsset({ assetNetworkId }) {
	return new Promise(async (resolve, reject) => {
		const assetNetwork = await postgres.AssetNetwork.findOne({ where: { id: assetNetworkId }, raw: true });
		if (!assetNetwork) {
			return reject(
				new NotFoundError(Errors.ASSET_NETWORK_NOT_FOUND.MESSAGE, Errors.ASSET_NETWORK_NOT_FOUND.CODE),
			);
		}
		const publish = await job.publisher.send(
			"createWalletForUsers",
			JSON.stringify({ currency: assetNetwork.apiCode, assetId: assetNetwork.assetId }),
		);
		if (!publish) {
			return reject(new HumanError(Errors.INTERNAL_ERROR.MESSAGE, Errors.INTERNAL_ERROR.CODE));
		}
		return resolve();
	});
}

/**
 * get assets list
 */
async function getAssets() {
	return await postgres.Asset.findAll({
		where: {
			isActive: true,
		},
		nest: true,
		attributes: ["id", "coin", "name", "precision", "type", "canDeposit", "canWithdraw", "icon"],
		raw: true,
	});
}

async function getAssetSingle(id) {
	return await postgres.Asset.findOne({
		where: { id, isActive: true },
		nest: true,
		attributes: ["id", "coin", "name", "precision", "type", "canDeposit", "canWithdraw", "icon"],
		raw: true,
	});
}

/**
 * get user transaction list
 * @param {*} data
 * @returns
 */
async function readTransactions(data) {
	const {
		page,
		limit,
		order,
		type,
		assetNetworkId,
		address,
		tag,
		status,
		txid,
		info,
		account,
		assetId,
		index,
		id,
		userId,
	} = data;
	const offset = 0 + (page - 1) * limit;

	const query = {
		...(type ? { type } : {}),
		...(assetNetworkId ? { assetNetworkId } : {}),
		...(address ? { address } : {}),
		...(tag ? { tag } : {}),
		...(status ? { status } : {}),
		...(txid ? { txid } : {}),
		...(info ? { info } : {}),
		...(account ? { account } : {}),
		...(assetId ? { assetId } : {}),
		...(index ? { index } : {}),
		...(id ? { id } : {}),
		userId,
	};

	let result = await postgres.UserTransaction.findAndCountAll({
		where: query,
		limit,
		offset,
		attributes: { exclude: ["userId", "updatedAt", "deletedAt", "assetNetworkId"] },
		order: [["createdAt", order]],
		raw: true,
		nest: true,
		include: [
			{
				model: postgres.AssetNetwork,
				as: "assetNetworks",
				attributes: ["id"],
				include: [
					{ model: postgres.Asset, as: "asset", attributes: ["id", "coin"] },
					{ model: postgres.Network, as: "network", attributes: ["id", "name", "type"] },
				],
			},
			{ model: postgres.Asset, as: "asset", attributes: ["id", "coin"] },
		],
	});

	return {
		total: result.count,
		pageSize: limit,
		page,
		data: result.rows,
	};
}
/**
 * confirm user withdraw request and save it in db
 */
async function confirmWithdraw({ token, code }, userEntity, io) {
	const payload = jwt.verify(token);

	if (!payload) throw new HumanError("The code is incorrect", 400, { token });

	let form = await redis.client.get(`_confirm_withdraw_user_${userEntity.id}_`);

	form = JSON.parse(form);

	if (!form) throw new HumanError("There is no user with the details entered in the system", 400);

	let check = false;
	switch (payload.type) {
		case "mobile": {
			const smsCheck = await sms.check(userEntity.mobile, code);
			if (smsCheck) check = true;
			break;
		}
		case "email": {
			if (code == form.otpCode) check = true;
			break;
		}
		default: {
			check = false;
			break;
		}
	}

	if (!check) throw new HumanError("An error occurred while validating the token", 400);

	let { userId, assetId, totalAmount } = form;

	//check user wallet for this asset is exist
	let wallet = await postgres.UserWallet.findOne({ where: { userId, assetId } });

	if (!wallet) throw new HumanError("User Wallet not found", 400);

	if (totalAmount > +wallet.amount) throw new HumanError("The requested amount is more than the users balance", 400);

	//save new balance in wallet
	wallet.amount = em.sub(+wallet.amount, totalAmount);
	wallet.pending = em.add(+wallet.pending, totalAmount);
	await wallet.save();

	const transaction = await postgres.UserTransaction.create(form);

	if (!transaction) throw new HumanError("An error occurred while registering the transaction", 400);

	const asset = await postgres.Asset.findOne({ where: { id: assetId } });

	await redis.client.del(`_confirm_withdraw_user_${userEntity.id}_`);

	let title = `User ${
		userEntity.name ? (userEntity.email ? userEntity.email : userEntity.mobile) : null
	}  Successfully registered a new withdraw`;
	let notif = await postgres.ManagerNotification.create({ title, userId, tag: "TRANSACTION" });
	io.to(`Manager`).emit("notification", JSON.stringify(notif));

	return "Successful";
}

async function withdrawRequest(data, io) {
	let { id, address, amount, tag, user, from_agent_panel } = data;
	let { email, id: userId, level, max_withdraw_per_day } = user;

	/*const userHasGhostCard = await checkUserHasGhostCard(user.id);
    if (userHasGhostCard)
        throw new HumanError("You need to buy a camera to withdraw", 400);*/

	let assetNetwork = await postgres.AssetNetwork.findOne({
		where: { id, isActive: true, canWithdraw: true },
		raw: true,
	});

	if (!assetNetwork) throw new HumanError("Asset Network not found", 400);

	let asset = await postgres.Asset.findOne({
		where: { id: assetNetwork.assetId, isActive: true, canWithdraw: true },
	});

	if (!asset) throw new HumanError("Asset not found", 400);

	// set max withdraw for ETH
	if (asset.coin === "ETH") {
		const TODAY_START = new Date().setHours(0, 0, 0, 0);
		const NOW = new Date();

		let user_txs = await postgres.UserTransaction.findAll({
			where: {
				type: "WITHDRAW",
				status: { [postgres.Op.ne]: "REJECTED" },
				assetId: asset.id,
				userId,
				createdAt: {
					[postgres.Op.gt]: TODAY_START,
					[postgres.Op.lt]: NOW,
				},
			},
		});

		let total_amount = 0;
		user_txs.forEach(function (tx) {
			total_amount += parseInt(tx.amount);
		});

		if (+total_amount + +amount > max_withdraw_per_day)
			throw new HumanError("Maximum allowed withdraw per day is: " + max_withdraw_per_day, 400);
	}

	// check user is agent for withdraw from agent panel
	if (level !== "AGENT") from_agent_panel = false;

	let { withdrawFee, depositFee, fee, gasPrice, gasLimit, assetId, withdrawMin } = assetNetwork;

	// check minimum value for withdraw
	if (amount < +withdrawMin) throw new HumanError("Minimum allowed for withdraw: " + withdrawMin, 400);

	let systemProfit = 0;
	if (+withdrawFee > 0) {
		systemProfit = (+amount * +withdrawFee) / 100;
	}

	//calculate all transfer costs
	let totalAmount = em.add(+amount, +systemProfit);

	//check user wallet for this asset is exist
	let wallet = await postgres.UserWallet.findOne({ where: { userId, assetId } });

	if (!wallet) throw new NotFoundError("User Wallet not found", 400);

	if (totalAmount > +wallet.amount) throw new HumanError("The requested amount is more than the users balance", 400);

	// create otp Token and otp Code
	let otpToken = jwt.generate({ type: email ? "email" : "mobile" }, null, 600),
		otpCode = otpGenerator.generate(4, {
			digits: true,
			alphabets: false,
			upperCase: false,
			specialChars: false,
		});

	await mail(email, otpCode, "WITHDRAW");

	// Temporarily save the user request in the cache
	await redis.client.set(
		`_confirm_withdraw_user_${userId}_`,
		JSON.stringify({
			type: "WITHDRAW",
			assetNetworkId: id,
			userId,
			address,
			tag,
			amount: +amount,
			withdrawFee: +withdrawFee,
			depositFee: +depositFee,
			fee: +fee,
			gasPrice: +gasPrice,
			gasLimit: +gasLimit,
			otpCode,
			totalAmount,
			assetId,
			from_agent_panel,
			origin: "ADMIN",
			profit: systemProfit,
		}),
		"EX",
		600,
	);

	return { exp: 600, token: otpToken };
}

/**
 * get asset list
 * @param {*} data { type }
 * @returns
 */
function getAsset({ type }) {
	return new Promise(async (resolve, reject) => {
		let query = { isActive: true };

		if (type) query.type = type;

		let result = await postgres.Asset.findAll({
			where: query,
			raw: true,
			attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
			order: ["createdAt"],
		});

		const vlx = result.filter((r) => r.coin == "VLX")?.[0];

		if (vlx) {
			const vlxWallets = await postgres.sequelize.query(
				{
					query: `SELECT sum(amount) as balance FROM "systemWallets" WHERE "assetId" = ?`,
					values: [vlx.id],
				},
				{ type: postgres.sequelize.QueryTypes.SELECT },
			);

			vlx.price = +(
				+vlxWallets[0].balance <= 2000000 ? 0.01 : +vlxWallets[0].balance <= 3000000 ? 0.02 : 0.03
			).toPrecision(6);
		}

		resolve(result);
	});
}

async function getSwapRate(page, limit) {
	let result = await postgres.Settings.findAndCountAll({
		where: {
			type: "SWAP",
			// key: `${baseCoin.coin}->${assetCoin.coin}`
		},
		limit: limit,
		offset: (page - 1) * limit,
	});

	let newResult = result.rows.map((value) => {
		let values = value.value.split("-");
		let results = {
			key: value.key,
		};
		values.forEach((value) => {
			let tmp = value.split("=");
			results[tmp[0]] = tmp[1];
		});
		return results;
	});

	return {
		total: 0,
		pageSize: limit,
		page,
		data: [],
	};
}

function getMainAssetSymbol(){
	return "MMT";
}

async function getMainAsset(){
	return await postgres.Asset.findOne({
		where:{coin: getMainAssetSymbol()}
	});
}

module.exports = {
	getMainAsset,
	getMainAssetSymbol,
	getWallets,
	readTransactions,
	confirmWithdraw,
	withdrawRequest,
	getSwapRate,
	getAsset,
	getAssets,
	getAssetSingle,
	createWalletForUsersByAsset,
};
