const { Console } = require("@sentry/node/dist/integrations");
const { postgres } = require("./../databases");
const { NotFoundError, HumanError, InvalidRequestError, ConflictError } = require("./errorhandler");
const Errors = require("./errorhandler/MessageText");

/**
 * Get all assetNetwork from user and manager
 * @param {*} id
 * @param {*} page
 * @param {*} limit
 * @returns
 */
function get(data) {
	return new Promise(async (resolve, reject) => {
		let {
			id,
			page,
			limit,
			order,
			assetId,
			networkId,
			withdrawFee,
			depositFee,
			canDeposit,
			canWithdraw,
			feeType,
			network,
			asset,
			isActive,
			fee,
			gasPrice,
			sort,
			gasLimit,
			minConfirm,
			unlockConfirm,
			withdrawMin,
			depositMin,
			apiCode,
			createdAt,
			searchQuery,
		} = data;

		let result = {},
			query = {},
			query2 = {},
			query3 = {},
			offset = (page - 1) * limit;

		if (searchQuery) {
			// query = {
			// 	[postgres.Op.or]: {
			// 		// amount: { [postgres.Op.iLike]: "%" + searchQuery + "%" },
			// 		fee : postgres.AssetNetwork.sequelize.where(
			// 		 postgres.AssetNetwork.sequelize.cast(
			// 			 postgres.AssetNetwork.sequelize.col('fee'), 'varchar'),
			// 			{[postgres.Op.iLike]: "%" + searchQuery + "%"}
			// 		  ),
			// 		//fee : postgres.AssetNetwork.sequelize.where(postgres.AssetNetwork.sequelize.col('fee'), 'LIKE', `%${searchQuery}%`)
			// 	},
			// };
			query2 = {
				[postgres.Op.or]: {
					name: { [postgres.Op.iLike]: "%" + searchQuery + "%" },
					type: { [postgres.Op.iLike]: "%" + searchQuery + "%" },
				},
			};
			query3 = {
				[postgres.Op.or]: {
					name: { [postgres.Op.iLike]: "%" + searchQuery + "%" },
					coin: { [postgres.Op.iLike]: "%" + searchQuery + "%" },
				},
			};
		}

		if (id) query.id = id;
		if (network) query2.name = { [postgres.Op.iLike]: "%" + network + "%" };
		if (asset) query3.name = { [postgres.Op.iLike]: "%" + asset + "%" };
		if (isActive) query.isActive = isActive;
		if (fee) query.fee = fee;
		if (gasPrice) query.gasPrice = gasPrice;
		if (gasLimit) query.gasLimit = gasLimit;
		if (minConfirm) query.minConfirm = minConfirm;
		if (unlockConfirm) query.unlockConfirm = unlockConfirm;
		if (withdrawMin) query.withdrawMin = withdrawMin;
		if (depositMin) query.depositMin = depositMin;
		if (apiCode) query.apiCode = apiCode;
		if (createdAt) query.createdAt = createdAt;

		if (assetId)
			query.assetId = postgres.sequelize.where(
				postgres.sequelize.cast(postgres.sequelize.col("assetId"), "varchar"),
				{ [postgres.Op.iLike]: `%${assetId}%` },
			);

		if (networkId)
			query.networkId = postgres.sequelize.where(
				postgres.sequelize.cast(postgres.sequelize.col("networkId"), "varchar"),
				{ [postgres.Op.iLike]: `%${networkId}%` },
			);

		if (withdrawFee)
			query.withdrawFee = postgres.sequelize.where(
				postgres.sequelize.cast(postgres.sequelize.col("withdrawFee"), "varchar"),
				{ [postgres.Op.iLike]: `%${withdrawFee}%` },
			);

		if (depositFee)
			query.depositFee = postgres.sequelize.where(
				postgres.sequelize.cast(postgres.sequelize.col("depositFee"), "varchar"),
				{ [postgres.Op.iLike]: `%${depositFee}%` },
			);

		if (typeof canDeposit === "boolean") query.canDeposit = canDeposit;

		if (typeof canWithdraw === "boolean") query.canWithdraw = canWithdraw;

		if (feeType) query.feeType = feeType;

		result = await postgres.AssetNetwork.findAndCountAll({
			where: query,
			limit,
			offset,
			order: [["createdAt", order]],
			raw: true,
			nest: true,
			include: [
				{
					where: query3,
					required: true,
					model: postgres.Asset,
					as: "asset",
				},
				{
					where: query2,
					required: true,
					model: postgres.Network,
					as: "network",
				},
			],
		});

		resolve({
			total: result.count ?? 0,
			pageSize: limit,
			page,
			data: result.rows,
		});
	});
}

/**
 * Get all assetNetwork Selector from user and manager
 * @param {*} id
 * @param {*} page
 * @param {*} limit
 * @returns
 */
function assetNetworkSelector(data) {
	return new Promise(async (resolve, reject) => {
		let { page, limit, order, searchQuery } = data;
		let queryAsset = {};
		let queryNetwork = {};
		if (searchQuery) {
			queryAsset = {
				[postgres.Op.or]: {
					name: { [postgres.Op.iLike]: "%" + searchQuery + "%" },
				},
			};
			queryNetwork = {
				[postgres.Op.or]: {
					name: { [postgres.Op.iLike]: "%" + searchQuery + "%" },
				},
			};
		} else {
			queryAsset = {};
			queryNetwork = {};
		}
		let result = {},
			offset = (page - 1) * limit;

		result = await postgres.AssetNetwork.findAndCountAll({
			limit,
			offset,
			order: [["createdAt", order]],
			raw: true,
			nest: true,
			include: [
				{ model: postgres.Asset, as: "asset", where: queryAsset },
				{ model: postgres.Network, as: "network", where: queryNetwork },
			],
		});

		resolve({
			total: result.count ?? 0,
			pageSize: limit,
			page,
			data: result.rows,
		});
	});
}

/**
 * Set asset network
 * @param {*} assetId
 * @param {*} networkId
 * @param {*} isActive
 * @returns
 */

function set(data) {
	return new Promise(async (resolve, reject) => {
		let result = await postgres.AssetNetwork.create(data);

		if (!result)
			return reject(new HumanError(Errors.ASSET_NETWORK_FAILED.MESSAGE, Errors.ASSET_NETWORK_FAILED.CODE));

		return resolve("Successful");
	});
}

/**
 * Edit asset network to the user and manager
 * @param {*} id
 * @param {*} assetId
 * @param {*} networkId
 * @param {*} isActive
 * @returns
 */
function edit(data) {
	return new Promise(async (resolve, reject) => {
		let result = await postgres.AssetNetwork.update(data, {
			where: { id: data.id },
		});

		if (!result.shift())
			return reject(
				new NotFoundError(Errors.ASSET_NETWORK_NOT_FOUND.MESSAGE, Errors.ASSET_NETWORK_NOT_FOUND.CODE, {
					id: data.id,
				}),
			);

		return resolve("Successful");
	});
}

/**
 * Delete public and private assetNetworks to the user and manager
 * @param {*} id
 * @returns
 */
function del(id) {
	return new Promise(async (resolve, reject) => {
		let result = await postgres.AssetNetwork.destroy({ where: { id } });

		if (!result)
			return reject(
				new NotFoundError(Errors.ASSET_NETWORK_NOT_FOUND.MESSAGE, Errors.ASSET_NETWORK_NOT_FOUND.CODE, { id }),
			);

		return resolve("Successful");
	});
}

/**
 *
 * @param {*} id
 * @returns
 */
function findById(id) {
	return new Promise(async (resolve, reject) => {
		let result = await postgres.AssetNetwork.findByPk(id, {
			raw: true,
			nest: true,
			include: [
				{ model: postgres.Asset, as: "asset" },
				{ model: postgres.Network, as: "network" },
			],
		});

		if (!result)
			return reject(
				new NotFoundError(Errors.ASSET_NETWORK_NOT_FOUND.MESSAGE, Errors.ASSET_NETWORK_NOT_FOUND.CODE, { id }),
			);

		return resolve(result);
	});
}

module.exports = {
	set,
	get,
	edit,
	del,
	findById,
	assetNetworkSelector,
};
