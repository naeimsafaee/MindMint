const axios = require("axios").default;
const { postgres } = require("./../databases");
const { HumanError } = require("./errorhandler");
const Errors = require("./errorhandler/MessageText");
const config = require("config");
const moment = require("moment");
const { sendPushToToken } = require("./notification.service");

async function checkUserHasGhostCard(userId) {
	const userCards = await postgres.AssignedCard.findAll({
		where: {
			userId: userId,
		},
	});

	const GhostType = await postgres.CardType.findOne({
		where: { price: "0" },
	});

	const userGhostCards = await postgres.AssignedCard.findOne({
		where: {
			userId: userId,
		},
		include: [
			{
				model: postgres.Card,
				where: {
					cardTypeId: GhostType.id,
				},
				required: true,
			},
		],
	});

	return userCards.length === 0 || userGhostCards;
}

async function swap(userId, { fromToken, toToken, balanceIn, agent }, req) {
	try {
		// const userHasGhostCard = await checkUserHasGhostCard(userId);
		// if (userHasGhostCard) throw new HumanError("You need to buy a camera to swap", 400);
		if (fromToken === "ETH") {
			fromToken = "ETH";
		}
		if (toToken === "ETH") {
			toToken = "ETH";
		}

		let io = req.app.get("socketIo");

		const fromAssetNetwork = await postgres.AssetNetwork.findOne({ where: { apiCode: fromToken } });
		const toAssetNetwork = await postgres.AssetNetwork.findOne({ where: { apiCode: toToken } });

		if (!fromAssetNetwork) {
			throw new HumanError(Errors.ASSET_NOT_FOUND.MESSAGE, Errors.ASSET_NOT_FOUND.CODE, { token: fromToken });
		}
		if (!toAssetNetwork) {
			throw new HumanError(Errors.ASSET_NOT_FOUND.MESSAGE, Errors.ASSET_NOT_FOUND.CODE, { token: toToken });
		}

		const wallets = await getOrCreateWallet({
			userId,
			assetInId: fromAssetNetwork.assetId,
			assetOutId: toAssetNetwork.assetId,
			currencyIn: fromAssetNetwork.apiCode,
			currencyOut: toAssetNetwork.apiCode,
		});

		if (+balanceIn > wallets.fromWallet.amount) {
			throw new HumanError(Errors.INSUFFICIENT_INVENTORY.MESSAGE, Errors.INSUFFICIENT_INVENTORY.CODE);
		}

		const assetInId = fromAssetNetwork.assetId;
		const assetOutId = toAssetNetwork.assetId;

		const assetIn = await postgres.Asset.findOne({
			where: { id: assetInId },
		});
		const assetOut = await postgres.Asset.findOne({
			where: { id: assetOutId },
		});

		const MMT = await postgres.Asset.findOne({
			where: { coin: "MMT" },
		});

		let limitSwap = 0;

		const systemFee = await fee({ fromTokenId: assetInId, toTokenId: assetOutId }, userId);

		let result;
		if (process.env.NODE_ENV !== "development") {
			const p = "/api/v1/wallet/swap";
			result = await httpRequest(p, {
				userId,
				agent,
				slippage: 5,
				fromToken: fromToken,
				toToken: toToken,
				balanceIn,
				systemFee: systemFee,
				apiLimit: limitSwap,
			});

			if (!result.data)
				throw new HumanError("The swap volume requests is currently high.please try again later", 400);
		} else {
			result = {
				data: {
					amount: 1234,
					txId: "11111",
					swapTxId: "1",
					systemFee: systemFee,
				},
			};
		}

		io.to(`UserId:${userId}`).emit("wallet", JSON.stringify([wallets.fromWallet, wallets.toWallet]));

		return result.data;
	} catch (e) {
		console.log(e);
	}
}

async function price(data) {
	const { fromToken, toToken, slippage, balanceIn, origin } = data;
	if (process.env.NODE_ENV === "development") {
		return { price: "240" };
	}
	try {
		const p = "/api/v1/wallet/swap/price";
		const result = await httpRequest(p, { fromToken, toToken, slippage, balanceIn, origin });
		return { price: result.data.price };
	} catch (e) {
		console.log(e);
		throw new HumanError("Please try again later", 400);
	}
}

function parseSetting(string, field) {
	let chain = -1;

	let string1 = string.split("-");

	for (let i = 0; i < string1.length; i++) {
		const item = string1[i];

		if (item.search(field) > -1) {
			chain = item.split("=")[1];
			return chain;
		}
	}
	return undefined;
}

async function getOrCreateWallet(data) {
	const { userId, assetInId, assetOutId, currencyIn, currencyOut } = data;
	const wallets = await postgres.UserWallet.findAll({
		where: { userId, assetId: { [postgres.Op.in]: [assetInId, assetOutId] } },
		raw: true,
	});

	let fromWallet = wallets.find((w) => w.assetId === assetInId);
	if (!fromWallet) {
		fromWallet = await generateWallet(userId, assetInId, currencyIn);
	}

	let toWallet = wallets.find((w) => w.assetId === assetOutId);
	if (!toWallet) {
		toWallet = await generateWallet(userId, assetOutId, currencyOut);
	}

	if (!fromWallet || !toWallet) {
		throw new HumanError(Errors.INTERNAL_ERROR.MESSAGE, Errors.INTERNAL_ERROR.CODE);
	}

	return { fromWallet, toWallet };
}

async function generateWallet(userId, assetId, currency) {
	await generateAddress(userId, currency);
	return await postgres.UserWallet.create({ userId, assetId });
}

async function generateAddress(userId, currency) {
	try {
		const baseUrl = config.get("clients.wallet.url");
		const apiKey = config.get("clients.wallet.apiKey");
		const callUrl = `/api/v1/wallet/address?currency=${currency}&userId=${userId}&clientId=1`;

		console.log({
			baseUrl: `${baseUrl}${callUrl}`,
			apiKey,
			callUrl,
		});

		const result = await axios.get(`${baseUrl}${callUrl}`, {
			headers: {
				"Content-Type": "Application/json",
				Accept: "application/json",
				"X-API-KEY": apiKey,
			},
		});

		if (result.status != 200) {
			throw new HumanError(Errors.INTERNAL_ERROR.MESSAGE, Errors.INTERNAL_ERROR.CODE);
		}

		return result.data;
	} catch (error) {
		throw new HumanError(Errors.INTERNAL_ERROR.MESSAGE, Errors.INTERNAL_ERROR.CODE);
	}
}

function httpRequest(path, data) {
	return new Promise((resolve, reject) => {
		const baseUrl = config.get("clients.wallet.url");
		const apiKey = config.get("clients.wallet.apiKey");
		axios
			.post(`${baseUrl}${path}`, data, {
				headers: {
					"Content-Type": "Application/json",
					Accept: "application/json",
					"X-API-KEY": apiKey,
				},
			})
			.then((res) => {
				if (res.status == 200) {
					resolve(res.data);
				} else {
					if (res.data && res.data.error) {
						reject(new HumanError(res.data.error, 422));
					} else {
						reject(new HumanError(Errors.INTERNAL_ERROR.MESSAGE, Errors.INTERNAL_ERROR.CODE));
					}
				}
			})
			.catch((err) => {
				if (err.response?.data && err.response?.data.error) {
					reject(new HumanError(err.response.data.error, 422));
				} else {
					reject(new HumanError(Errors.INTERNAL_ERROR.MESSAGE, Errors.INTERNAL_ERROR.CODE));
				}
			});
	});
}

async function activation(data) {
	const { id } = data;
	const swap = await postgres.Settings.findOne({
		where: { id: id },
		paranoid: false,
	});

	if (swap.deletedAt == null) await swap.destroy();
	else await swap.restore();

	return swap;
}

module.exports = {
	swap,
	price,
	activation,
	httpRequest,
};
