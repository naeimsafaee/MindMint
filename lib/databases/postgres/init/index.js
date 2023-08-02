const { sequelize, Asset, SystemWallet, Manager, Fee } = require("./../");
const { password } = require("./../../../utils");

const fees = [
	{
		userType: "NORMAL",
		userLevel: 1,
		depositFee: 0,
		withdrawFee: 0,
		referralReward: 0,
		userCount: 3,
		targetPrice: 300,
		reward: 6,
		assetId: null,
	},
	{
		userType: "NORMAL",
		userLevel: 2,
		depositFee: 0,
		withdrawFee: 0,
		referralReward: 0,
		userCount: 10,
		targetPrice: 1000,
		reward: 20,
		assetId: null,
	},
	{
		userType: "NORMAL",
		userLevel: 3,
		depositFee: 0,
		withdrawFee: 0,
		referralReward: 0,
		userCount: 20,
		targetPrice: 2000,
		reward: 50,
		assetId: null,
	},
	{
		userType: "NORMAL",
		userLevel: 4,
		depositFee: 0,
		withdrawFee: 0,
		referralReward: 0,
		userCount: 30,
		targetPrice: 3000,
		reward: 100,
		assetId: null,
	},
	{
		userType: "NORMAL",
		userLevel: 5,
		depositFee: 0,
		withdrawFee: 0,
		referralReward: 0,
		userCount: 100,
		targetPrice: 10000,
		reward: 500,
		assetId: null,
	},
];

module.exports = async () => {
	try {
		// const _password = await password.generate("#Admin123");

		// await Manager.create({
		// 	name: "sina",
		// 	email: "sina18612@gmail.com",
		// 	salt: _password.salt,
		// 	password: _password.hash,
		// 	status: 1,
		// });

		// check stylike asset is exist

		// Assets
		// ETH
		let ethAsset = await Asset.findOne({ where: { coin: "ETH" } });
		if (!ethAsset)
			ethAsset = await Asset.create({ coin: "ETH", name: "Ethereum coin", precision: "18", type: "COIN" });

		// USDT
		let usdtAsset = await Asset.findOne({ where: { coin: "USDT" } });
		if (!usdtAsset) usdtAsset = await Asset.create({ coin: "USDT", name: "Tether", precision: "6", type: "TOKEN" });

		// STL
		let stlAsset = await Asset.findOne({ where: { coin: "STL" } });
		if (!stlAsset) stlAsset = await Asset.create({ coin: "STL", name: "stl", precision: "18", type: "TOKEN" });

		// STYL
		let stylAsset = await Asset.findOne({ where: { coin: "STYL" } });
		if (!stylAsset) stylAsset = await Asset.create({ coin: "STYL", name: "styl", precision: "18", type: "TOKEN" });

		// Wallets
		// ETH
		let EthSystemWallet = await SystemWallet.findOne({ where: { assetId: ethAsset.id } });
		if (!EthSystemWallet) await SystemWallet.create({ assetId: ethAsset.id, amount: 0 });

		// USDT
		let UsdtSystemWallet = await SystemWallet.findOne({ where: { assetId: usdtAsset.id } });
		if (!UsdtSystemWallet) await SystemWallet.create({ assetId: usdtAsset.id, amount: 0 });

		// STL
		let stlSystemWallet = await SystemWallet.findOne({ where: { assetId: stlAsset.id } });
		if (!stlSystemWallet) await SystemWallet.create({ assetId: stlAsset.id, amount: 0 });

		// STYL
		let stylSystemWallet = await SystemWallet.findOne({ where: { assetId: stylAsset.id } });
		if (!stylSystemWallet) await SystemWallet.create({ assetId: stylAsset.id, amount: 0 });

		// Fees
		const feesData = [];
		for (let i = 0; i < fees.length; i++) {
			fees[i].assetId = stlAsset.id;

			const fee = await Fee.findOne({
				where: { userType: "NORMAL", userLevel: fees[i].userLevel, assetId: stlAsset.id },
				raw: true,
			});
			if (!fee) feesData.push(fees[i]);
		}
		if (feesData.length > 0) await Fee.bulkCreate(feesData);
	} catch (e) {}

	return;
};
