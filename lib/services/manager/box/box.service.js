const { default: axios } = require("axios");
const { postgres } = require("../../../databases");
const { dateQueryBuilder } = require("../../../utils/dateQueryBuilder");
const { NotFoundError, HumanError, ConflictError } = require("../../errorhandler");
const Errors = require("../../errorhandler/MessageText");
const { sendPushToToken } = require("../../notification.service");

const baseUrl = require("config").get("files.S3.url");

const cardTypeNames = ["pawn", "rook", "knight", "bishop", "queen", "king"];

const walletConfig = require("config").get("clients.wallet");

async function addBox(data) {
	const transaction = await postgres.sequelize.transaction();
	try {
		const { name, cardTypeId, initialNumber, price, assetId, level } = data;

		const asset = await postgres.Asset.findOne({ where: { id: assetId }, raw: true });
		if (!asset) throw new NotFoundError("Asset not found", 1016);

		const cardType = await postgres.CardType.findOne({ where: { id: cardTypeId }, raw: true });
		if (!cardType) throw new NotFoundError("Card type not found", 2029);

		const image = generateImageUrl(cardType.name);
		if (image === -1) throw new NotFoundError("There is no image associated with current card type.", 2059);

		// find last index of current type box to set name correctly [x]
		const lastInsertedBox = await postgres.Box.findOne({
			where: { cardTypeId },
			order: [["id", "DESC"]],
			limit: 1,
		});

		let startCounter = lastInsertedBox ? Number(lastInsertedBox.id) + 1 : 1;

		let boxes = [];
		for (let i = 0; i < initialNumber; i++) {
			boxes[i] = {
				cardTypeId: cardTypeId,
				image: generateImageUrl(cardType.name),
				name: `${name} #${startCounter}`,
				dopamineAmount: 0,
				serotoninAmount: 0,
				referralCount: 0,
				cardId: null,
				level: level,
			};

			startCounter++;
		}

		boxes = shuffleArray(boxes);

		const createdBoxes = await postgres.Box.bulkCreate(boxes, { transaction });

		const boxAuctions = [];
		for (let i = 0; i < createdBoxes.length; i++) {
			boxAuctions.push({
				boxId: createdBoxes[i].id,
				price: price,
				assetId,
			});
		}

		await postgres.BoxAuction.bulkCreate(boxAuctions, { transaction });
		await transaction.commit();

		return {
			createdBoxes,
		};
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}

const shuffleArray = (array) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}

	return array;
};

const generateImageUrl = (cardTypeName) => {
	const imageNameIndex = cardTypeNames.findIndex((typeName) => typeName === cardTypeName.toLowerCase());
	if (imageNameIndex === -1) {
		return -1;
	}

	const imageName = cardTypeNames[imageNameIndex];

	const url = [
		{
			key: `nft/box/${imageName}.jpg`,
			name: `${imageName}.jpg`,
			location: `${baseUrl}nft/box/${imageName}.jpg`,
		},
	];

	return url;
};

async function calculateAttributes(level) {
	const boxSettings = await postgres.BoxSetting.findAll({ where: { level }, raw: true });

	const settings = {
		dopamine: boxSettings.find((setting) => setting.type === "DOPAMINE"),
		serotonin: boxSettings.find((setting) => setting.type === "SEROTONIN"),
	};

	// if (!settings.battery && !settings.negative)
	//     return reject(new NotFoundError("There is no box settings assosiated with current card type and attribute. Please add some.", 2062));

	const dopamineAmount = settings.dopamine.amounts;
	const serotoninAmount = settings.serotonin.amounts;

	return {
		dopamineAmount: generateRandom(dopamineAmount, 5),
		serotoninAmount: generateRandom(serotoninAmount, 5),
	};
}

const generateRandom = (array, tryCount) => {
	let random_number = randomNumber(0, array.length);

	/*if (array[random_number] === 0 && tryCount > 0)
		  return generateRandom(array, --tryCount);
  */
	return array[random_number];
};

const randomNumber = (min, max) => {
	return Math.floor(Math.random() * (max - min) + min);
};

const calculateNft = async (cardTypeId, transaction) => {
	return new Promise(async (resolve, reject) => {
		try {
			const assignedCard = await postgres.AssignedCard.findOne({
				where: { status: "INAUCTION", userId: null, "$card.cardTypeId$": cardTypeId },
				include: postgres.Card,
			});

			const cardId = assignedCard ? assignedCard.cardId : null;

			if (cardId) await assignedCard.update({ status: "IN_BOX" }, { transaction });

			return resolve({ cardId });
		} catch (e) {
			// console.log(e);
			return reject(e);
		}
	});
};

function editBox(data) {
	return new Promise(async (resolve, reject) => {
		try {
			const { id, name, price, assetId } = data;

			const box = await postgres.Box.findOne({ where: { id } });

			if (!box) {
				return reject(new NotFoundError(Errors.ITEM_NOT_FOUND.MESSAGE, Errors.ITEM_NOT_FOUND.CODE, { id }));
			}

			if (box.status !== "IN_AUCTION") {
				return reject(
					new ConflictError(
						Errors.BOX_ALREADY_HAS_BEEN_TRADED.MESSAGE,
						Errors.BOX_ALREADY_HAS_BEEN_TRADED.CODE,
					),
				);
			}

			const auction = await postgres.BoxAuction.findOne({ where: { boxId: id } });

			if (name) {
				const existBox = await postgres.Box.findOne({ where: { name, id: { [postgres.Op.ne]: id } } });
				if (existBox) {
					return reject(
						new ConflictError(Errors.DUPLICATE_DATA.MESSAGE, Errors.DUPLICATE_DATA.CODE, { name }),
					);
				}

				await box.update({ name });
			}

			if (price) {
				await auction.update({ price });
			}

			if (assetId) {
				const asset = await postgres.Asset.findOne({ where: { id: assetId }, raw: true });
				if (!asset) {
					return reject(
						new NotFoundError(Errors.ASSET_NOT_FOUND.MESSAGE, Errors.ASSET_NOT_FOUND.CODE, {
							assetId,
						}),
					);
				}
				await auction.update({ assetId });
			}

			return resolve("Successful");
		} catch (error) {
			return reject(error);
		}
	});
}

function deleteBox(data) {
	return new Promise(async (resolve, reject) => {
		try {
			const { id } = data;

			const box = await postgres.Box.findOne({ where: { id } });

			if (!box) {
				return reject(new NotFoundError(Errors.ITEM_NOT_FOUND.MESSAGE, Errors.ITEM_NOT_FOUND.CODE, { id }));
			}

			if (box.status !== "IN_AUCTION") {
				return reject(
					new ConflictError(
						Errors.BOX_ALREADY_HAS_BEEN_TRADED.MESSAGE,
						Errors.BOX_ALREADY_HAS_BEEN_TRADED.CODE,
					),
				);
			}

			if (box.cardId) {
				await postgres.AssignedCard.update(
					{ status: "FREE", type: "TRANSFER" },
					{ where: { cardId: box.cardId } },
				);
			}

			const auction = await postgres.BoxAuction.findOne({ where: { boxId: id } });

			await box.destroy();
			await auction.destroy();

			return resolve("Successful");
		} catch (error) {
			return reject(error);
		}
	});
}

/* ----------------- BOX SETTINGS ----------------- */

async function addBoxSetting(data) {
	const { cardTypeId, name, type, amounts, level } = data;

	const cardType = await postgres.CardType.findByPk(cardTypeId, { raw: true });
	if (!cardType) {
		throw new NotFoundError(Errors.CARD_TYPE_NOT_FOUND.MESSAGE, Errors.CARD_TYPE_NOT_FOUND.CODE, { cardTypeId });
	}

	const newBoxSetting = await new postgres.BoxSetting({ cardTypeId, name, type, amounts, level }).save();
	if (!newBoxSetting) {
		throw new InternalError(Errors.ADD_FAILED.MESSAGE, Errors.ADD_FAILED.CODE);
	}

	return "Success";
}

function editBoxSetting(data, files) {
	return new Promise(async (resolve, reject) => {
		const { id, cardTypeId, name, type, amounts } = data;

		const currentBoxSetting = await postgres.BoxSetting.findOne({ where: { id } });

		if (!currentBoxSetting) {
			return reject(new NotFoundError(Errors.ITEM_NOT_FOUND.MESSAGE, Errors.ITEM_NOT_FOUND.CODE, { id }));
		}

		const existBoxSetting = await postgres.BoxSetting.findOne({
			where: { cardTypeId, name, type, id: { [postgres.Op.ne]: id } },
			raw: true,
		});

		if (existBoxSetting) {
			return reject(
				new HumanError(Errors.DUPLICATE_DATA.MESSAGE, Errors.DUPLICATE_DATA.CODE, { cardTypeId, name, type }),
			);
		}

		const updateData = {};

		if (name) {
			updateData.name = name;
		}

		if (cardTypeId) {
			updateData.cardTypeId = cardTypeId;
		}

		if (type) {
			updateData.type = type;
		}

		if (amounts && amounts.length > 0) {
			updateData.amounts = amounts;
		}

		await currentBoxSetting.update(updateData);

		return resolve("Success");
	});
}

function deleteBoxSetting(data) {
	return new Promise(async (resolve, reject) => {
		const { id } = data;

		const currentBoxSetting = await postgres.BoxSetting.findOne({ where: { id } });
		if (!currentBoxSetting) {
			return reject(new NotFoundError(Errors.ITEM_NOT_FOUND.MESSAGE, Errors.ITEM_NOT_FOUND.CODE, { id }));
		}

		await currentBoxSetting.destroy();

		return resolve("Successful");
	});
}

function getBoxSettingByManager(data) {
	return new Promise(async (resolve, reject) => {
		const { id } = data;

		const currentBoxSetting = await postgres.BoxSetting.findOne({
			where: { id },
			include: { model: postgres.CardType, attributes: ["id", "name", "image"] },
			nest: true,
			raw: true,
		});
		if (!currentBoxSetting) {
			return reject(new NotFoundError(Errors.ITEM_NOT_FOUND.MESSAGE, Errors.ITEM_NOT_FOUND.CODE, { id }));
		}

		return resolve(currentBoxSetting);
	});
}

async function getBoxSettingsByManager(data) {
	const { page, limit, sort, order, createdAt, id, searchQuery, name, type, cardTypeId } = data;

	const query = {};
	const offset = (page - 1) * limit;

	if (id) query.id = id;
	if (name) query.name = { [postgres.Op.iLike]: `%${name}%` };
	if (type && type.length > 0) query.type = { [postgres.Op.in]: type };
	if (cardTypeId && cardTypeId.length > 0) query.cardTypeId = { [postgres.Op.in]: cardTypeId };

	if (createdAt) {
		const { start, end } = dateQueryBuilder(createdAt);
		query.createdAt = { [postgres.Op.gte]: start, [postgres.Op.lte]: end };
	}

	if (searchQuery) {
		query[postgres.Op.or] = [
			{
				id: postgres.sequelize.where(postgres.sequelize.cast(postgres.sequelize.col("id"), "varchar"), {
					[postgres.Op.iLike]: `%${searchQuery}%`,
				}),
			},
			{ name: { [postgres.Op.iLike]: `%${searchQuery}%` } },
			{ type: { [postgres.Op.iLike]: `%${searchQuery}%` } },
		];
	}
	const items = await postgres.BoxSetting.findAndCountAll({
		where: query,
		limit,
		offset,
		order: [[sort, order]],
		include: { model: postgres.CardType, attributes: ["id", "name", "image"] },
		nest: true,
		raw: true,
	});

	return {
		total: items.count,
		pageSize: limit,
		page,
		data: items.rows,
	};
}

// User Box (Self)
function getUserBox(data, user) {
	return new Promise(async (resolve, reject) => {
		const { id } = data;
		const currentUserBox = await postgres.UserBox.findOne({
			where: { id, userId: user.id },
			include: [
				{
					model: postgres.Box,
					include: [postgres.Card, { model: postgres.CardType, attributes: ["id", "name", "image"] }],
				},
				{ model: postgres.BoxAuction },
			],
			// nest: true,
			// raw: true,
		});
		if (!currentUserBox) {
			return reject(new NotFoundError(Errors.ITEM_NOT_FOUND.MESSAGE, Errors.ITEM_NOT_FOUND.CODE, { id }));
		}

		return resolve(currentUserBox);
	});
}

function getUserBoxes(data, user) {
	return new Promise(async (resolve, reject) => {
		const { page, limit, sort, order, createdAt, id, searchQuery, name, cardTypeId } = data;

		const query = { userId: user.id };

		const offset = (page - 1) * limit;

		if (createdAt) {
			const { start, end } = dateQueryBuilder(createdAt);
			query.createdAt = { [postgres.Op.gte]: start, [postgres.Op.lte]: end };
		}

		if (searchQuery) {
			query[postgres.Op.or] = [
				{
					id: postgres.sequelize.where(postgres.sequelize.cast(postgres.sequelize.col("id"), "varchar"), {
						[postgres.Op.iLike]: `%${searchQuery}%`,
					}),
				},
				{ name: { [postgres.Op.iLike]: `%${searchQuery}%` } },
				{ type: { [postgres.Op.iLike]: `%${searchQuery}%` } },
			];
		}

		if (id)
			query.id = postgres.sequelize.where(postgres.sequelize.cast(postgres.sequelize.col("id"), "varchar"), {
				[postgres.Op.iLike]: `%${searchQuery}%`,
			});
		if (name) query.name = { [postgres.Op.iLike]: `%${name}%` };
		if (cardTypeId) query["$box.cardTypeId$"] = cardTypeId;

		const items = await postgres.UserBox.findAndCountAll({
			where: query,
			limit,
			offset,
			order: [[sort, order]],
			include: [
				{
					model: postgres.Box,
					include: [
						{
							model: postgres.Card,
							include: [
								{
									model: postgres.CardType,
									attributes: ["id", "name", "image"],
								},
							],
						},
					],
				},
				{ model: postgres.BoxAuction },
			],
			//[postgres.Card, {model: postgres.CardType, attributes: ["id", "name", "image"] }]
			// nest: true,
			// raw: true,
		});

		return resolve({
			total: items.count,
			pageSize: limit,
			page,
			data: items.rows,
		});
	});
}

// User Boxes (manager)
async function getUserBoxByManager(data) {
	const { userId } = data;

	const currentUserBox = await postgres.UserBox.findAll({
		where: { userId: userId },
		attributes: { exclude: ["deletedAt", "updatedAt"] },
		include: [
			{
				model: postgres.Box,
				include: [
					postgres.Card,
					{
						model: postgres.CardType,
						attributes: ["id", "name", "image"],
					},
				],
			},
			{
				model: postgres.BoxAuction,
			},
			{
				model: postgres.User,
				attributes: ["id", "name", "avatar", "email"],
			},
		],
	});

	return currentUserBox;
}

async function createUserBoxesByManager(data) {
	const { userId, cardTypeId } = data;

	const assignedCards = await postgres.AssignedCard.findOne({
		where: {
			userId: userId,
		},
		include: [
			{
				model: postgres.Card,
				where: { cardTypeId: cardTypeId },
			},
		],
	});

	if (!assignedCards) throw new HumanError("This user doesnt have that camera", 400);

	const boxAuction = await postgres.BoxAuction.findOne({
		where: {
			status: "ACTIVE",
		},
		include: [
			{
				model: postgres.Box,
				where: {
					cardTypeId: cardTypeId,
					status: "IN_AUCTION",
					level: 1,
				},
				required: true,
			},
		],
	});

	if (!boxAuction) throw new HumanError("There is no box with this camera type", 400);

	await postgres.UserBox.create({
		userId: userId,
		boxId: boxAuction.box.id,
		boxAuctionId: boxAuction.id,
		isOpened: false,
	});

	await postgres.BoxAuction.update(
		{
			status: "FINISHED",
		},
		{
			where: {
				id: boxAuction.id,
			},
		},
	);

	await postgres.Box.update(
		{
			status: "SOLD",
		},
		{
			where: {
				id: boxAuction.box.id,
			},
		},
	);

	await postgres.UserNotification.create({
		title: "Box gift",
		description: `You received a box as a gift just now.`,
		userId: data.userId,
	});

	const user = await postgres.User.findOne({
		where: {
			id: data.userId,
		},
	});

	sendPushToToken(
		user,
		{},
		{
			title: "Box gift",
			body: `You received a box as a gift just now`,
		},
	);

	return "success";
}

function getUserBoxesByManager(data) {
	return new Promise(async (resolve, reject) => {
		const { page, limit, sort, order, createdAt, id, searchQuery, name, type, userId } = data;

		const query = {};

		const offset = (page - 1) * limit;

		if (createdAt) {
			const { start, end } = dateQueryBuilder(createdAt);
			query.createdAt = { [postgres.Op.gte]: start, [postgres.Op.lte]: end };
		}

		if (searchQuery) {
			query[postgres.Op.or] = [
				{
					id: { [postgres.Op.iLike]: `%${searchQuery}%` },
				},
				{ name: { [postgres.Op.iLike]: `%${searchQuery}%` } },
				{ type: { [postgres.Op.iLike]: `%${searchQuery}%` } },
			];
		}

		if (id) query.id = { [postgres.Op.iLike]: `%${searchQuery}%` };

		if (name && name.length > 0) query.name = { [postgres.Op.in]: name };
		if (type && type.length > 0) query.type = { [postgres.Op.in]: type };
		if (userId) query.userId = userId;

		const items = await postgres.UserBox.findAndCountAll({
			where: query,
			limit,
			offset,
			order: [[sort, order]],
			attributes: { exclude: ["updatedAt", "deletedAt"] },
			include: [
				{
					model: postgres.Box,
					attributes: { exclude: ["megaPixelAmount", "damageAmount", "updatedAt", "deletedAt"] },
					include: [
						postgres.Card,
						{
							model: postgres.CardType,
							attributes: ["id", "name", "image"],
						},
					],
				},
				{
					model: postgres.BoxAuction,
					attributes: { exclude: ["updatedAt", "deletedAt"] },
				},
				{
					model: postgres.User,
					attributes: ["id", "name", "avatar", "email"],
				},
			],
			// nest: true,
			// raw: true,
		});

		return resolve({
			total: items.count,
			pageSize: limit,
			page,
			data: items.rows,
		});
	});
}

// Box Auction
async function getBoxAuction(data) {
	const { id } = data;
	const auction = await postgres.BoxAuction.findOne({
		where: { id, status: "ACTIVE" },
		attributes: { exclude: "boxId" },
		include: [
			{
				model: postgres.Box,
				attributes: ["id", "name", "image", "cardTypeId"],
				include: { model: postgres.CardType, attributes: ["id", "name", "image"] },
			},
			postgres.Asset,
		],
	});
	if (!auction) throw new NotFoundError(Errors.AUCTION_NOT_FOUND.MESSAGE, Errors.AUCTION_NOT_FOUND.CODE, { id });

	return auction;
}

async function getBoxAuctions(data, user) {
	const { page, limit, sort, order, cardTypeId, min, max } = data;

	const query = { status: "ACTIVE", price: { [postgres.Op.gte]: min, [postgres.Op.lte]: max } };

	const offset = (page - 1) * limit;

	if (cardTypeId) query["$box.cardTypeId$"] = cardTypeId;

	const items = await postgres.BoxAuction.findAndCountAll({
		where: query,
		limit,
		offset,
		order: [[sort, order]],
		include: [
			{
				model: postgres.Box,
				attributes: ["id", "name", "image", "cardTypeId"],
				include: [{ model: postgres.CardType }],
			},
			postgres.Asset,
		],
	});

	return {
		total: items.count,
		pageSize: limit,
		page,
		data: items.rows,
	};
}

function getBoxAuctionByManager(data) {
	return new Promise(async (resolve, reject) => {
		const { id } = data;
		const auction = await postgres.BoxAuction.findOne({
			where: { id },
			include: [
				{
					model: postgres.Box,
					include: [{ model: postgres.CardType }, { model: postgres.Card, required: false }],
				},
				postgres.Asset,
			],
			// nest: true,
			// raw: true,
		});
		if (!auction) {
			return reject(new NotFoundError(Errors.ITEM_NOT_FOUND.MESSAGE, Errors.ITEM_NOT_FOUND.CODE, { id }));
		}

		return resolve(auction);
	});
}

async function getBoxAuctionsByManager(data) {
	const { page, limit, sort, order, createdAt, id, searchQuery, name, cardType, cardTypeId, asset, status, price } =
		data;

	const query = {};

	const offset = (page - 1) * limit;

	if (id) query.id = id;
	if (parseFloat(price) > 0) query.price = price;
	if (name) query["$box.name$"] = { [postgres.Op.in]: name };
	if (asset) query["$asset.name$"] = { [postgres.Op.iLike]: "%" + asset + "%" };
	if (status) query.status = { [postgres.Op.in]: status };
	if (cardType) query["$cardType.name$"] = { [postgres.Op.in]: cardType };
	if (cardTypeId && cardTypeId.length > 0) query["$box.cardTypeId$"] = { [postgres.Op.in]: cardTypeId };

	if (createdAt) {
		const { start, end } = dateQueryBuilder(createdAt);
		query.createdAt = { [postgres.Op.gte]: start, [postgres.Op.lte]: end };
	}

	if (searchQuery) {
		query[postgres.Op.or] = [
			{
				id: postgres.sequelize.where(postgres.sequelize.cast(postgres.sequelize.col("id"), "varchar"), {
					[postgres.Op.iLike]: `%${searchQuery}%`,
				}),
			},
			{ "$box.name$": { [postgres.Op.iLike]: `%${searchQuery}%` } },
			{ "$box.cardType.name$": { [postgres.Op.iLike]: `%${searchQuery}%` } },
		];
	}
	const items = await postgres.BoxAuction.findAndCountAll({
		where: query,
		limit,
		offset,
		order: [[sort, order]],
		include: [
			{
				model: postgres.Box,
				include: [{ model: postgres.CardType }, { model: postgres.Card, required: false }],
			},
			postgres.Asset,
		],
		// nest: true,
		// raw: true,
	});

	return {
		total: items.count,
		pageSize: limit,
		page,
		data: items.rows,
	};
}

function getBoxByManager(data) {
	return new Promise(async (resolve, reject) => {
		const { id } = data;
		const box = await postgres.Box.findOne({
			where: { id: id },
			include: [{ model: postgres.CardType }, { model: postgres.Card, required: false }],
			// nest: true,
			// raw: true,
		});
		if (!box) {
			return reject(new NotFoundError(Errors.ITEM_NOT_FOUND.MESSAGE, Errors.ITEM_NOT_FOUND.CODE, { id }));
		}

		return resolve(box);
	});
}

async function getBoxesByManager(data, user) {
	const {
		page,
		limit,
		sort,
		order,
		createdAt,
		id,
		searchQuery,
		name,
		cardType,
		cardTypeId,
		status,
		dopamineAmount,
		serotoninAmount,
		referralCount,
	} = data;

	const query = {};

	const offset = (page - 1) * limit;

	if (id) query.id = id;
	if (name) query.name = { [postgres.Op.iLike]: `%${name}%` };
	if (parseFloat(dopamineAmount) >= 0) query.dopamineAmount = dopamineAmount;
	if (parseFloat(serotoninAmount) >= 0) query.serotoninAmount = serotoninAmount;
	if (parseFloat(referralCount) >= 0) query.referralCount = referralCount;

	if (status) query.status = { [postgres.Op.in]: status };
	if (cardType) query["$cardType.name$"] = { [postgres.Op.in]: cardType };
	if (cardTypeId && cardTypeId.length > 0) query["$box.cardTypeId$"] = { [postgres.Op.in]: cardTypeId };

	if (createdAt) {
		const { start, end } = dateQueryBuilder(createdAt);
		query.createdAt = { [postgres.Op.gte]: start, [postgres.Op.lte]: end };
	}

	if (searchQuery) {
		query[postgres.Op.or] = [
			{
				id: postgres.sequelize.where(postgres.sequelize.cast(postgres.sequelize.col("id"), "varchar"), {
					[postgres.Op.iLike]: `%${searchQuery}%`,
				}),
			},
			{ name: { [postgres.Op.iLike]: `%${searchQuery}%` } },
			{ "$cardType.name$": { [postgres.Op.iLike]: `%${searchQuery}%` } },
		];
	}
	const items = await postgres.Box.findAndCountAll({
		where: query,
		limit,
		offset,
		order: [[sort, order]],
		include: [{ model: postgres.CardType }, { model: postgres.Card, required: false }],
		// nest: true,
		// raw: true,
	});

	return {
		total: items.count,
		pageSize: limit,
		page,
		data: items.rows,
	};
	// return (items);
}

// Box Trade
function getBoxTradeByManager(data) {
	return new Promise(async (resolve, reject) => {
		const { id } = data;
		const trade = await postgres.BoxTrade.findOne({
			where: { id },
			include: [
				{
					model: postgres.BoxAuction,
					include: [
						{
							model: postgres.Box,
							include: [{ model: postgres.CardType }, { model: postgres.Card, required: false }],
						},
					],
				},
				{ model: postgres.User, attributes: ["id", "name", "avatar", "email"] },
			],
			// nest: true,
			// raw: true,
		});
		if (!trade) {
			return reject(new NotFoundError(Errors.ITEM_NOT_FOUND.MESSAGE, Errors.ITEM_NOT_FOUND.CODE, { id }));
		}

		return resolve(trade);
	});
}

function getBoxTradesByManager(data) {
	return new Promise(async (resolve, reject) => {
		const { page, limit, sort, order, createdAt, id, searchQuery, name, cardType, cardTypeId } = data;

		const query = {};

		const offset = (page - 1) * limit;

		if (createdAt) {
			const { start, end } = dateQueryBuilder(createdAt);
			query.createdAt = { [postgres.Op.gte]: start, [postgres.Op.lte]: end };
		}

		if (searchQuery) {
			query[postgres.Op.or] = [
				{
					id: postgres.sequelize.where(postgres.sequelize.cast(postgres.sequelize.col("id"), "varchar"), {
						[postgres.Op.iLike]: `%${searchQuery}%`,
					}),
				},
				{ name: { [postgres.Op.iLike]: `%${searchQuery}%` } },
				{ "$cardType.name$": { [postgres.Op.iLike]: `%${searchQuery}%` } },
			];
		}

		if (id)
			query.id = postgres.sequelize.where(postgres.sequelize.cast(postgres.sequelize.col("id"), "varchar"), {
				[postgres.Op.iLike]: `%${searchQuery}%`,
			});
		if (name) query.name = { [postgres.Op.in]: name };
		if (cardType) query["$cardType.name$"] = { [postgres.Op.in]: cardType };
		if (cardTypeId && cardTypeId.length > 0) query["$box.cardTypeId$"] = { [postgres.Op.in]: cardTypeId };

		const items = await postgres.BoxTrade.findAndCountAll({
			where: query,
			limit,
			offset,
			order: [[sort, order]],
			include: [
				{
					model: postgres.BoxAuction,
					include: [
						{
							model: postgres.Box,
							include: [{ model: postgres.CardType }, { model: postgres.Card, required: false }],
						},
					],
				},
				{ model: postgres.User, attributes: ["id", "name", "avatar", "email"] },
			],
			// nest: true,
			// raw: true,
		});

		resolve({
			total: items.count,
			pageSize: limit,
			page,
			data: items.rows,
		});
		return resolve(items);
	});
}

async function purchaseBox(data, userId, io) {
	const transaction = await postgres.sequelize.transaction();
	try {
		const { boxAuctionId } = data;

		// find auction
		const auction = await postgres.BoxAuction.findOne({
			where: { id: boxAuctionId, status: "ACTIVE" },
			include: [
				{
					model: postgres.Box,
					where: { status: "IN_AUCTION" },
					include: [postgres.Card],
				},
				postgres.Asset,
			],
		});

		if (!auction) throw new NotFoundError(Errors.AUCTION_NOT_FOUND.MESSAGE, Errors.AUCTION_NOT_FOUND.CODE);

		// check if user have any nft's with current box card type
		const userAssginedCard = await postgres.AssignedCard.findOne({
			where: { userId: userId },
			include: [
				{
					model: postgres.Card,
					where: { cardTypeId: auction.box.cardTypeId },
					required: true,
				},
			],
		});

		if (!userAssginedCard) throw new NotFoundError("You don't have a nft related to current card type.", 2060);

		// check user wallet
		let wallet = await postgres.UserWallet.findOne({
			where: { userId, assetId: auction.assetId },
			include: { model: postgres.Asset, as: "asset" },
		});

		if (!wallet) wallet = await postgres.UserWallet.create({ userId, assetId: auction.assetId });

		if (+wallet.amount < +auction.price) throw new HumanError("Wallet is low!", 1072);

		const box = auction.box;

		const random = generateRandomFloat(0, 10);

		let referralCount = 0;

		if (random >= 4.5 && random < 10) referralCount = Math.floor(Math.random() * (5 - 3) + 3);

		let boxConfig = {};
		if (random >= 0 && random < 1.5) {
			boxConfig = {
				dopamineAmount: 0,
				serotoninAmount: 0,
				referralCount: referralCount,
				cardId: null,
				status: "SOLD",
			};
		} else if (random >= 1.5) {
			//ATTRIBUTE
			let attributes = await calculateAttributes(box.level);

			boxConfig = {
				dopamineAmount: attributes.dopamineAmount,
				serotoninAmount: attributes.serotoninAmount,
				referralCount: referralCount,
				cardId: null,
				status: "SOLD",
			};

			await assignBoxAttributeToUser(
				userId,
				attributes.dopamineAmount,
				attributes.serotoninAmount,
				box.cardTypeId,
				transaction,
			);
		}

		await postgres.BoxTrade.create(
			{ userId: userId, boxAuctionId: auction.id, amount: auction.price },
			{ transaction },
		);

		if (referralCount > 0) {
			await postgres.User.increment("referralCodeCount", {
				by: referralCount,
				where: { id: userId },
				transaction: transaction,
			});
		}

		await auction.update({ status: "FINISHED" }, { transaction });

		await postgres.Box.update(boxConfig, { where: { id: box.id }, transaction });

		await wallet.decrement("amount", { by: +auction.price, transaction });

		await postgres.UserBox.create({ userId, boxAuctionId: auction.id, boxId: box.id }, { transaction });

		let notif = await postgres.ManagerNotification.create({
			title: `User ${userId} purchase a box successfully.`,
			userId: userId,
			tag: "box",
		});

		if (io) io.to(`Manager`).emit("notification", JSON.stringify(notif));

		await transaction.commit();

		/*if (random < 0.5) {
				if (process.env.NODE_ENV !== "development") {
					const sendingCard = await postgres.Card.findOne({ where: { id: cardInBox.cardId } });

					const user = await postgres.User.findOne({ where: { id: userId } });

					await axios.put(
						`${walletConfig.url}/api/v1/wallet/nft`,
						{
							contractAddress: walletConfig.contractAddress,
							id: sendingCard.edition,
							to: user.address
						},
						{
							headers: {
								"X-API-KEY": walletConfig.apiKey
							}
						}
					);
				}
			}
	*/
		let newBox = await postgres.Box.findOne({
			where: { id: box.id },
			include: [
				{
					model: postgres.Card,
				},
			],
		});

		return newBox;
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}

async function OpenGiftBox(data, userId) {
	const transaction = await postgres.sequelize.transaction();
	try {
		const { boxAuctionId } = data;

		// find auction
		const auction = await postgres.BoxAuction.findOne({
			where: { id: boxAuctionId },
			include: [
				{
					model: postgres.Box,
					where: { status: "SOLD" },
					include: [postgres.Card],
				},
				postgres.Asset,
			],
		});

		if (!auction) throw new NotFoundError(Errors.AUCTION_NOT_FOUND.MESSAGE, Errors.AUCTION_NOT_FOUND.CODE);

		const box = auction.box;

		const userBox = await postgres.UserBox.findOne({
			where: {
				userId: userId,
				boxAuctionId: auction.id,
				boxId: box.id,
			},
			transaction,
		});

		if (!userBox) throw new HumanError("This box does not exist", 400);

		if (userBox.isOpened !== false) throw new HumanError("This box opened before", 400);

		const random = generateRandomFloat(0, 10);

		let referralCount = 0;

		if (random >= 4.5 && random < 10) referralCount = Math.floor(Math.random() * (5 - 3) + 3);

		let boxConfig = {};

		if (random >= 0 && random < 3.33 && box.level === 5) {
			boxConfig = {
				dopamineAmount: 0,
				serotoninAmount: 0,
				referralCount: referralCount,
				cardId: null,
				status: "SOLD",
			};
		} else {
			//ATTRIBUTE
			let attributes = await calculateAttributes(box.level);

			boxConfig = {
				dopamineAmount: attributes.dopamineAmount,
				serotoninAmount: attributes.serotoninAmount,
				referralCount: referralCount,
				cardId: null,
				status: "SOLD",
			};

			await assignBoxAttributeToUser(
				userId,
				attributes.dopamineAmount,
				attributes.serotoninAmount,
				box.cardTypeId,
				transaction,
			);
		}

		await postgres.BoxTrade.create({ userId: userId, boxAuctionId: auction.id, amount: 0 }, { transaction });

		if (referralCount > 0) {
			await postgres.User.increment("referralCodeCount", {
				by: referralCount,
				where: { id: userId },
				transaction: transaction,
			});
		}

		await auction.update({ status: "FINISHED" }, { transaction });

		await postgres.Box.update(boxConfig, { where: { id: box.id }, transaction });

		await postgres.UserBox.update(
			{
				isOpened: true,
			},
			{
				where: {
					userId: userId,
					boxAuctionId: auction.id,
					boxId: box.id,
					isOpened: false,
				},
				transaction,
			},
		);

		await transaction.commit();

		/*if (random < cardChance) {
				if (process.env.NODE_ENV !== "development") {
					const sendingCard = await postgres.Card.findOne({ where: { id: cardInBox.cardId } });

					const user = await postgres.User.findOne({ where: { id: userId } });

					await axios.put(
						`${walletConfig.url}/api/v1/wallet/nft`,
						{
							contractAddress: walletConfig.contractAddress,
							id: sendingCard.edition,
							to: user.address
						},
						{
							headers: {
								"X-API-KEY": walletConfig.apiKey
							}
						}
					);
				}
			}*/

		let newBox = await postgres.Box.findOne({
			where: { id: box.id },
			include: [
				{
					model: postgres.Card,
				},
			],
		});

		return newBox;
	} catch (error) {
		await transaction.rollback();
		throw error;
	}
}

//"cardId" in (21 , 5081 , 5082 , 5103 , 5104 , 5105 , 5106 , 10041 ,10042 , 10053 , 15021 , 20155 , 20156 , 20257 , 20258 , 20259 , 20260 , 20261 , 20262 , 20283 , 20284 , 20285 , 20286 , 20287 , 20289 , 20290 , 20291 , 20292 , 20303 , 20304 , 25016 , 30021 , 35031)
function generateRandomFloat(min, max) {
	return (Math.random() * (max - min) + min).toFixed(4);
}

const assignBoxAttributeToUser = async (userId, dopamineAmount, serotoninAmount, cardTypeId, transaction) => {
	const userBatteryAttributes = await postgres.UserAttribute.findAll({
		where: { userId, type: "INITIAL" },
		include: [
			{
				model: postgres.Attribute,
				where: {
					cardTypeId: cardTypeId,
					name: "DOPAMINE",
					type: "INITIAL",
				},
				required: true,
			},
		],
		order: [["amount", "ASC"]],
	});

	if (userBatteryAttributes.length > 0) {
		const userBatteryAttribute = userBatteryAttributes[0];

		await userBatteryAttribute.increment("amount", { by: dopamineAmount, transaction });
	}

	const userNegativeAttributes = await postgres.UserAttribute.findAll({
		where: { userId, type: "INITIAL" },
		include: [
			{
				model: postgres.Attribute,
				where: {
					cardTypeId: cardTypeId,
					name: "SEROTONIN",
					type: "INITIAL",
				},
				required: true,
			},
		],
		order: [["amount", "ASC"]],
	});

	if (userNegativeAttributes.length > 0) {
		const userNegativeAttribute = userNegativeAttributes[0];

		await userNegativeAttribute.increment("amount", { by: serotoninAmount, transaction });
	}

	return true;
};

const calculateCardPrize = async (userId, transaction) => {
	const cardType = await postgres.CardType.findOne({ where: { name: "Pictomera" } });

	const assignedCard = await postgres.AssignedCard.findOne({
		where: { status: "FREE", userId: null, type: "TRANSFER" },
		include: [
			{
				model: postgres.Card,
				where: { cardTypeId: cardType.id },
			},
		],
	});

	await assignedCard.update(
		{
			type: "SOLD",
			status: "IN_BOX",
			userId: userId,
		},
		{ transaction },
	);

	await assignAttributes(userId, assignedCard.card, transaction);

	return assignedCard;
};

function boxConfirmNft(data, userId) {
	return new Promise(async (resolve, reject) => {
		const transaction = await postgres.sequelize.transaction();
		try {
			const { cardId, address } = data;

			const box = await postgres.Box.findOne({
				where: { cardId, status: "SOLD" },
				raw: true,
			});
			if (!box) {
				await transaction.rollback();
				return reject(new NotFoundError(Errors.ITEM_NOT_FOUND.MESSAGE, Errors.ITEM_NOT_FOUND.CODE), { cardId });
			}

			const auction = await postgres.BoxAuction.findOne({
				where: { boxId: box.id, status: "FINISHED" },
			});
			if (!auction) {
				await transaction.rollback();
				return reject(new NotFoundError(Errors.ITEM_NOT_FOUND.MESSAGE, Errors.ITEM_NOT_FOUND.CODE), { cardId });
			}

			const assignedCard = await postgres.AssignedCard.findOne({
				where: {
					userId,
					cardId,
					status: "RESERVED",
				},
				include: postgres.Card,
			});

			if (!assignedCard) {
				await transaction.rollback();
				return reject(new NotFoundError(Errors.ITEM_NOT_FOUND.MESSAGE, Errors.ITEM_NOT_FOUND.CODE), { cardId });
			}

			if (process.env.NODE_ENV !== "development") {
				await axios.put(
					`${walletConfig.url}/api/v1/wallet/nft`,
					{
						contractAddress: walletConfig.contractAddress,
						id: assignedCard.card.edition,
						to: address,
					},
					{
						headers: {
							"X-API-KEY": walletConfig.apiKey,
						},
					},
				);
			}

			await assignAttributes(userId, assignedCard.card, transaction);
			await assignedCard.update({ status: "FREE" }, { transaction });
			await postgres.BoxTrade.update(
				{ address },
				{
					where: { userId, boxAuctionId: auction.id },
					transaction,
				},
			);
			await transaction.commit();

			return resolve("Successful");
		} catch (e) {
			await transaction.rollback();
			return reject(e);
		}
	});
}

const assignAttributes = async (userId, card, transaction) => {
	let attributes = await postgres.Attribute.findAll({
		where: {
			cardTypeId: card.cardTypeId,
			type: "INITIAL",
			status: "ACTIVE",
		},
	});

	for (const attribute of attributes) {
		await postgres.UserAttribute.create(
			{
				userId,
				cardId: card.id,
				attributeId: attribute.id,
				amount: attribute.amount,
			},
			{ transaction },
		);
	}

	return true;
};

/**
 * reserved cards
 * @param {*} page
 * @param {*} limit
 * @param {*} order
 * @param {*} searchQuery
 * @param {*} limit
 * @param {*} userId
 * @returns
 */
function reservedCards(data, userId) {
	return new Promise(async (resolve, reject) => {
		const { page, limit, sort, order, createdAt, searchQuery } = data;

		const query = { userId, status: "RESERVED", type: "BOX" };

		const offset = (page - 1) * limit;

		if (createdAt) {
			const { start, end } = dateQueryBuilder(createdAt);
			query.createdAt = { [postgres.Op.gte]: start, [postgres.Op.lte]: end };
		}

		if (searchQuery) {
			query[postgres.Op.or] = [
				{
					id: postgres.sequelize.where(postgres.sequelize.cast(postgres.sequelize.col("id"), "varchar"), {
						[postgres.Op.iLike]: `%${searchQuery}%`,
					}),
				},
			];
		}

		const items = await postgres.AssignedCard.findAndCountAll({
			where: query,
			limit,
			offset,
			order: [[sort, order]],
			include: [{ model: postgres.Card, include: postgres.CardType }],
		});

		resolve({
			total: items.count,
			pageSize: limit,
			page,
			data: items.rows,
		});
		return resolve(items);
	});
}

/**
 * reserved cards by manager
 * @param {*} page
 * @param {*} limit
 * @param {*} order
 * @param {*} searchQuery
 * @param {*} limit
 * @param {*} user
 * @returns
 */
function reservedCardsByManager(data) {
	return new Promise(async (resolve, reject) => {
		const { page, limit, sort, order, createdAt, searchQuery, userId } = data;

		const query = { status: "RESERVED", type: "BOX" };

		const offset = (page - 1) * limit;

		if (createdAt) {
			const { start, end } = dateQueryBuilder(createdAt);
			query.createdAt = { [postgres.Op.gte]: start, [postgres.Op.lte]: end };
		}

		if (searchQuery) {
			query[postgres.Op.or] = [
				{
					id: postgres.sequelize.where(postgres.sequelize.cast(postgres.sequelize.col("id"), "varchar"), {
						[postgres.Op.iLike]: `%${searchQuery}%`,
					}),
				},
			];
		}

		if (userId) {
			query.userId = userId;
		}

		const items = await postgres.AssignedCard.findAndCountAll({
			where: query,
			limit,
			offset,
			order: [[sort, order]],
			include: [postgres.Card, { model: postgres.User, attributes: ["id", "name", "email", "avatar"] }],
			nest: true,
		});

		resolve({
			total: items.count,
			pageSize: limit,
			page,
			data: items.rows,
		});
		return resolve(items);
	});
}

module.exports = {
	calculateAttributes,
	generateRandomFloat,
	addBox,
	purchaseBox,
	OpenGiftBox,
	editBox,
	getBoxAuctions,
	reservedCards,
	reservedCardsByManager,
	boxConfirmNft,
	getBoxTradesByManager,
	getBoxTradeByManager,
	getBoxesByManager,
	getBoxByManager,
	getBoxAuctionsByManager,
	getBoxAuctionByManager,
	deleteBox,
	addBoxSetting,
	editBoxSetting,
	deleteBoxSetting,
	getBoxSettingByManager,
	getBoxSettingsByManager,
	getUserBox,
	getUserBoxes,
	getUserBoxByManager,
	getUserBoxesByManager,
	getBoxAuction,
	createUserBoxesByManager,
};
