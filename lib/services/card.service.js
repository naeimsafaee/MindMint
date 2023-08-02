const { postgres } = require("../databases");
const { NotFoundError, HumanError } = require("./errorhandler");
const Errors = require("./errorhandler/MessageText");
const axios = require("axios");
const FormData = require("form-data");
const walletConfig = require("config").get("clients.wallet");
const stream = require("stream");
const { sequelize } = require("../databases/postgres");
const { dateQueryBuilder } = require("../utils/dateQueryBuilder");
const { sendPushToToken } = require("./notification.service");
const { assignAttributes } = require("./auction.service");
const _ = require("lodash");

/**
 * get card list
 */

async function getCards(data) {
	const {
		page,
		limit,
		order,
		sort,
		searchQuery,
		createdAt,
		id,
		name,
		description,
		cardTypeId,
		cardType,
		chain,
		edition,
		allowedUsageNumber,
		status,
	} = data;

	const offset = (page - 1) * limit;

	const query = {
		status: "ACTIVE",
	};

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
			{ description: { [postgres.Op.iLike]: `%${searchQuery}%` } },
			{ "$cardType.name$": { [postgres.Op.iLike]: `%${searchQuery}%` } },
			{
				status: postgres.sequelize.where(postgres.sequelize.cast(postgres.sequelize.col("status"), "varchar"), {
					[postgres.Op.iLike]: `%${searchQuery}%`,
				}),
			},
			{
				chain: postgres.sequelize.where(postgres.sequelize.cast(postgres.sequelize.col("chain"), "varchar"), {
					[postgres.Op.iLike]: `%${searchQuery}%`,
				}),
			},
			{
				hashType: postgres.sequelize.where(
					postgres.sequelize.cast(postgres.sequelize.col("hashType"), "varchar"),
					{
						[postgres.Op.iLike]: `%${searchQuery}%`,
					},
				),
			},
		];
	}

	if (id)
		query.id = postgres.sequelize.where(postgres.sequelize.cast(postgres.sequelize.col("card.id"), "varchar"), {
			[postgres.Op.iLike]: `%${id}%`,
		});

	if (status) query.status = { [postgres.Op.in]: status };
	if (cardTypeId) query.cardTypeId = { [postgres.Op.eq]: cardTypeId };
	if (name) query.name = { [postgres.Op.iLike]: `%${name}%` };
	if (description) query.description = { [postgres.Op.iLike]: `%${description}%` };
	if (chain) query.chain = { [postgres.Op.in]: [chain] };
	if (edition) query.edition = { [postgres.Op.eq]: edition };
	if (allowedUsageNumber) query.allowedUsageNumber = { [postgres.Op.eq]: allowedUsageNumber };
	if (cardType) query["$cardType.name$"] = { [postgres.Op.iLike]: `%${cardType}%` };

	// Maybe query for Card Type => [COLOR, STATUS]

	const result = await postgres.Card.findAndCountAll({
		where: query,
		limit,
		offset,
		order: [[sort, order]],
		include: [postgres.CardType],
	});
	return {
		total: result.count,
		pageSize: limit,
		page,
		data: result.rows,
	};
}

function getCardByManager(id) {
	return new Promise(async (resolve, reject) => {
		const result = await postgres.Card.findOne({
			where: { id },
			include: [{ model: postgres.CardType }],
		});

		if (!result)
			return reject(new NotFoundError(Errors.CARD_NOT_FOUND.MESSAGE, Errors.CARD_NOT_FOUND.CODE, { id }));

		resolve(result);
	});
}

function getCardsByManager(data) {
	return new Promise(async (resolve, reject) => {
		const {
			page,
			limit,
			order,
			sort,
			searchQuery,
			createdAt,
			id,
			name,
			description,
			cardType,
			cardTypeId,
			initialNumber,
			assignedNumber,
			isCommon,
			status,
			chain,
		} = data;

		const offset = (page - 1) * limit;

		if (createdAt) {
			const { start, end } = dateQueryBuilder(createdAt);
			query.createdAt = { [postgres.Op.gte]: start, [postgres.Op.lte]: end };
		}

		const query = {};

		if (searchQuery) {
			query[postgres.Op.or] = [
				{
					id: postgres.sequelize.where(postgres.sequelize.cast(postgres.sequelize.col("id"), "varchar"), {
						[postgres.Op.iLike]: `%${searchQuery}%`,
					}),
				},
				{ name: { [postgres.Op.iLike]: `%${searchQuery}%` } },
				{ description: { [postgres.Op.iLike]: `%${searchQuery}%` } },
				{ "$cardType.name$": { [postgres.Op.iLike]: `%${searchQuery}%` } },
				{
					status: postgres.sequelize.where(
						postgres.sequelize.cast(postgres.sequelize.col("status"), "varchar"),
						{
							[postgres.Op.iLike]: `%${searchQuery}%`,
						},
					),
				},
				{
					chain: postgres.sequelize.where(
						postgres.sequelize.cast(postgres.sequelize.col("chain"), "varchar"),
						{
							[postgres.Op.iLike]: `%${searchQuery}%`,
						},
					),
				},
				{
					hashType: postgres.sequelize.where(
						postgres.sequelize.cast(postgres.sequelize.col("hashType"), "varchar"),
						{
							[postgres.Op.iLike]: `%${searchQuery}%`,
						},
					),
				},
			];
		}

		if (id)
			query.id = postgres.sequelize.where(postgres.sequelize.cast(postgres.sequelize.col("card.id"), "varchar"), {
				[postgres.Op.iLike]: `%${id}%`,
			});

		if (cardTypeId)
			query.cardTypeId = postgres.sequelize.where(
				postgres.sequelize.cast(postgres.sequelize.col("cardTypeId"), "varchar"),
				{
					[postgres.Op.iLike]: `%${cardTypeId}%`,
				},
			);

		if (name) query.name = { [postgres.Op.iLike]: `%${name}%` };
		if (description) query.description = { [postgres.Op.iLike]: `%${description}%` };
		if (chain) query.chain = { [postgres.Op.iLike]: `%${chain}%` };
		if (cardType) query["$cardType.name$"] = { [postgres.Op.iLike]: `%${cardType}%` };
		if (initialNumber) query.initialNumber = initialNumber;
		if (assignedNumber) query.assignedNumber = assignedNumber;
		if (isCommon || typeof isCommon == "boolean") query.isCommon = isCommon;
		if (status) query.status = status;

		const result = await postgres.Card.findAndCountAll({
			where: query,
			limit,
			offset,
			order: [[sort, order]],
			include: [
				{
					model: postgres.CardType,
				},
			],
		});
		resolve({
			total: result.count,
			pageSize: limit,
			page,
			data: result.rows,
		});
	});
}

/**
 * get one card
 * @returns
 * @param id
 */
function getCard(id) {
	return new Promise(async (resolve, reject) => {
		const result = await postgres.Card.findOne({
			where: { id, status: "ACTIVE" },
			attributes: {
				exclude: ["createdAt", "updatedAt", "deletedAt", "status"],
			},
			include: [
				{
					model: postgres.CardType,
					attributes: ["name", "image"],
				},
			],
		});

		if (!result)
			return reject(new NotFoundError(Errors.CARD_NOT_FOUND.MESSAGE, Errors.CARD_NOT_FOUND.CODE, { id }));

		resolve(result);
	});
}

/**
 * Card Selector
 * @param {*} page
 * @param {*} limit
 * @param {*} order
 * @param searchQuery
 */
function cardSelector(page, limit, order, searchQuery) {
	return new Promise(async (resolve, reject) => {
		let query = { status: "ACTIVE", initialNumber: { [postgres.Op.gt]: postgres.Sequelize.col("assignedNumber") } };

		if (searchQuery) {
			query = {
				[postgres.Op.or]: {
					name: { [postgres.Op.iLike]: "%" + searchQuery + "%" },
					description: { [postgres.Op.iLike]: "%" + searchQuery + "%" },
				},
			};
		} else {
			query = {};
		}

		let result,
			offset = (page - 1) * limit;

		result = await postgres.Card.findAndCountAll({
			where: query,
			limit,
			offset,
			order: [["createdAt", order]],
			include: [
				{
					model: postgres.Player,
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
 * Upload image in ipfs and get hash from it
 * @param {*} location
 * @param {*} cardModel
 * @returns
 */
function createImageHash(location, cardModel) {
	return new Promise(async (resolve, reject) => {
		try {
			let imageStream = await axios.get(location, { responseType: "stream" });

			var form = new FormData();

			form.append("file", imageStream.data);

			let res = await axios({
				method: "post",
				url: "https://api-eu1.tatum.io/v3/ipfs",
				data: form,
				headers: {
					"x-api-key": "bf754b9a-3104-4b7b-a12e-fef7373105f2",
					...form.getHeaders(),
				},
			});

			let {
				data: { ipfsHash },
			} = res;

			await postgres.CardHash.create({ cardId: cardModel.id, hash: ipfsHash, type: "IMAGE" });

			await createMetadata(ipfsHash, cardModel);
		} catch (error) {
			console.log("Error image ipfsHash", error);

			await cardModel.update({ status: "ERROR" });
		}

		resolve();
	});
}

function sleep(ms = 200) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * create metadata and upload in ipfs
 * @param {*} imageHash
 * @param {*} cardModel
 * @returns
 */
function createMetadata(imageHash, cardModel) {
	return new Promise(async (resolve, reject) => {
		try {
			let metadata = JSON.stringify({
				name: cardModel.name,
				description: cardModel.description,
				image: `ipfs://${imageHash}`,
			});

			let contentStream = new stream.Readable();

			contentStream.push(metadata);
			contentStream.push(null);

			var form = new FormData();

			form.append("file", contentStream, {
				filename: `metadata-${cardModel.id}.json`,
				contentType: "application/json",
				knownLength: metadata.length,
			});

			let res = await axios({
				method: "post",
				url: "https://api-eu1.tatum.io/v3/ipfs",
				data: form,
				headers: {
					"x-api-key": "bf754b9a-3104-4b7b-a12e-fef7373105f2",
					...form.getHeaders(),
				},
			});

			let {
				data: { ipfsHash },
			} = res;

			await postgres.CardHash.create({ cardId: cardModel.id, hash: ipfsHash, type: "METADATA" });

			let tokens = [],
				urls = [],
				ids = [];

			for (let i = 0; i < cardModel.initialNumber; i++) {
				tokens.push({ cardId: cardModel.id, status: "CREATING", serialNumber: i + 1 });

				urls.push(`ipfs://${ipfsHash}`);
			}

			let bulkTokens = await postgres.Token.bulkCreate(tokens);

			for (const item of bulkTokens) ids.push(+item.id);

			let response = await axios.post(
				`${walletConfig.nftUrl}/api/v1/wallet/nft`,
				{ contractAddress: walletConfig.contractAddress, urls, ids },
				{ headers: { "x-api-key": walletConfig.apiKey } },
			);

			let {
				data: {
					data: { txId },
				},
			} = response;

			await postgres.Token.update({ txId, status: "CREATED" }, { where: { id: { [postgres.Op.in]: ids } } });

			await cardModel.update({ status: "ACTIVE" });
		} catch (error) {
			console.log("Error metadata ipfsHash", error);

			await cardModel.update({ status: "ERROR" });
		}

		resolve();
	});
}

/**
 * update card
 * @param {*} id
 * @param {*} type
 * @param {*} tier
 * @param {*} status
 * @param {*} initialNumber
 * @param {*} bonus
 * @param {*} files
 * @returns
 */
function editCard(data) {
	return new Promise(async (resolve, reject) => {
		const { id, name, description, cardTypeId } = data;

		const currentCard = await postgres.Card.findByPk(id);
		if (!currentCard)
			return reject(new NotFoundError(Errors.CARD_NOT_FOUND.MESSAGE, Errors.CARD_NOT_FOUND.CODE, { id }));

		const existCard = await postgres.Card.findOne({ where: { name, id: { [postgres.Op.ne]: id } }, raw: true });
		if (existCard)
			return reject(new HumanError(Errors.CARD_DUPLICATE.MESSAGE, Errors.CARD_DUPLICATE.CODE, { name }));

		const cardType = await postgres.CardType.findByPk(cardTypeId, { raw: true });
		if (!cardType)
			return reject(
				new NotFoundError(Errors.CARD_TYPE_NOT_FOUND.MESSAGE, Errors.CARD_TYPE_NOT_FOUND.CODE, { cardTypeId }),
			);

		const update = {};

		if (name) update.name = name;
		if (description) update.description = description;
		if (cardTypeId) update.cardTypeId = cardTypeId;

		const result = await postgres.Card.update(update, { where: { id } });

		if (!result.shift())
			return reject(new NotFoundError(Errors.UPDATE_FAILED.MESSAGE, Errors.UPDATE_FAILED.CODE, { id }));

		return resolve("Successful");
	});
}

/**
 * delete card
 * @param {*} id
 * @returns
 */
function deleteCard(id) {
	return new Promise(async (resolve, reject) => {
		const currentCard = await postgres.Card.findByPk(id);

		if (currentCard.assignedNumber > 0)
			return reject(new ConflictError(Errors.CARD_CANNOT_DELETE.MESSAGE, Errors.CARD_CANNOT_DELETE.CODE));

		const result = await currentCard.destroy();

		if (!result) return reject(new HumanError(Errors.DELETE_FAILED.MESSAGE, Errors.DELETE_FAILED.CODE, { id: id }));

		resolve("Successful");
	});
}

/**
 * create assigned card
 */
async function createAssignedCard(data) {
	const { cardTypeId, userId } = data;

	const user = await postgres.User.findByPk(userId);
	const cardType = await postgres.CardType.findByPk(cardTypeId);
	const address = user.address;

	let auction = await postgres.Auction.findOne({
		where: {
			status: "ACTIVE",
		},
		include: [
			{
				model: postgres.AssignedCard,
				where: {
					userId: null,
					status: "INAUCTION",
					type: "TRANSFER",
				},
				required: true,
				include: [
					{
						where: { cardTypeId: cardTypeId },
						model: postgres.Card,
					},
				],
			},
		],
	});

	if (!auction) throw new HumanError("assignedCard does not exists", 400);

	let assignedCard = auction.assignedCard;

	const auctionLog = await postgres.AuctionLog.create({
		address,
		auctionId: auction.id,
		userId,
		assignedCardId: assignedCard.id,
		cardId: assignedCard.cardId,
		status: "PENDING",
	});
	const transaction = await postgres.sequelize.transaction();

	try {
		await auction.update({ status: "FINISHED" }, { transaction });
		await assignedCard.update({ type: "SOLD", userId: userId, status: "FREE" }, { transaction });

		await postgres.UserAuctionTrade.create(
			{
				auctionId: auction.id,
				payerId: userId,
				amount: 0,
			},
			{ transaction: transaction },
		);

		if (process.env.NODE_ENV !== "development")
			await axios
				.put(
					`${walletConfig.url}/api/v1/wallet/nft`,
					{
						contractAddress: walletConfig.contractAddress,
						id: auction.assignedCard.card.edition,
						to: address,
					},
					{
						headers: {
							"X-API-KEY": walletConfig.apiKey,
						},
					},
				)
				.catch((err) => {
					console.log("Wallet request error ", err);
					throw err;
				});

		await assignAttributes(userId, auction.assignedCard.card, transaction);

		await transaction.commit();

		await auctionLog.update({ status: "FINISHED" });

		await postgres.UserNotification.create({
			title: "Camera Gift",
			description: `You received a ${cardType.name} camera as a gift just now.`,
			userId: userId,
		});

		sendPushToToken(
			user,
			{},
			{
				title: "Camera Gift",
				body: `You received a ${cardType.name} camera as a gift just now.`,
			},
		);
	} catch (error) {
		await transaction.rollback();
		await auctionLog.update({ status: "FAILED" });

		throw error;
	}

	return "Successful";
}

/**
 * get assigned card list
 */
async function getAssignedCard(data) {
	const {
		user,
		card,
		tokenId,
		type,
		status,
		page,
		limit,
		order,
		sort,
		createdAt,
		id,
		searchQuery,
		userId,
		sortCard,
		orderCard,
		orderUser,
		sortUser,
		cardTypeId,
	} = data;

	let query = {};
	let query2 = {};
	let query3 = {};
	let order2;

	if (id) query.id = id;
	if (type) query.type = type;
	if (userId) query.userId = userId;
	if (status) query.status = status;
	if (tokenId) query.tokenId = tokenId;
	if (cardTypeId) query3.cardTypeId = cardTypeId;
	if (card) query3.name = { [postgres.Op.iLike]: "%" + card + "%" };

	if (user)
		query[postgres.Op.or] = [
			{ "$user.name$": { [postgres.Op.iLike]: `%${user}%` } },
			{ "$user.email$": { [postgres.Op.iLike]: `%${user}%` } },
		];

	if (createdAt) {
		const { start, end } = dateQueryBuilder(createdAt);
		query.createdAt = { [postgres.Op.gte]: start, [postgres.Op.lte]: end };
	}

	if (searchQuery) query3.name = { [postgres.Op.iLike]: `%${searchQuery}%` };

	if (sortUser && orderUser) order2 = [[{ model: postgres.User }, sortUser, orderUser]];
	else if (orderCard && sortCard) order2 = [[{ model: postgres.Card }, sortCard, orderCard]];
	else order2 = [[sort, order]];

	let result = await postgres.AssignedCard.findAndCountAll({
		where: query,
		limit: limit,
		offset: (page - 1) * limit,
		order: order2,
		include: [
			{
				where: query2,
				model: postgres.User,
				attributes: { exclude: ["password", "salt"] },
			},
			{
				where: query3,
				model: postgres.Card,
				include: [postgres.CardType],
			},
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
 * get card types
 * @param title
 * @param color
 * @param {*} status
 * @param {*} page
 * @param {*} limit
 * @param {*} order
 * @param sort
 * @param searchQuery
 * @param createdAt
 */
function getCardTypes(title, color, status, page, limit, order, sort, searchQuery, createdAt, id) {
	return new Promise(async (resolve, reject) => {
		let query = {};

		if (id) query.id = id;
		if (title) query.title = { [postgres.Op.iLike]: "%" + title + "%" };
		if (color) query.color = color;
		if (status) query.status = status;
		if (createdAt) query.createdAt = createdAt;

		if (searchQuery)
			query = {
				[postgres.Op.or]: [
					{ title: { [postgres.Op.like]: "%" + searchQuery + "%" } },
					{ color: { [postgres.Op.like]: "%" + searchQuery + "%" } },
				],
			};

		let result = await postgres.CardType.findAndCountAll({
			where: query,
			limit: limit,
			offset: (page - 1) * limit,
			order: [[sort, order]],
		});

		resolve({
			total: result.count,
			pageSize: limit,
			page,
			data: result.rows,
		});
	});
}

/**
 * CardType Selector
 * @param {*} page
 * @param {*} limit
 * @param {*} order
 * @param searchQuery
 */
function cardTypeSelector(page, limit, order, searchQuery) {
	return new Promise(async (resolve, reject) => {
		let query = {};

		if (searchQuery) {
			query = {
				[postgres.Op.or]: {
					title: { [postgres.Op.iLike]: "%" + searchQuery + "%" },
					color: { [postgres.Op.iLike]: "%" + searchQuery + "%" },
				},
			};
		} else {
			query = {};
		}

		let result,
			offset = (page - 1) * limit;

		result = await postgres.CardType.findAndCountAll({
			where: query,
			limit,
			offset,
			order: [["createdAt", order]],
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
 * get card type
 * @param {*} id
 */
function getCardType(id) {
	return new Promise(async (resolve, reject) => {
		let result = await postgres.CardType.findOne({
			where: { id },
		});

		resolve(result);
	});
}

/**
 * add card type
 * @param {*} title
 * @param {*} color
 * @param {*} status
 * @returns
 */
function addCardType(title, color, status) {
	return new Promise(async (resolve, reject) => {
		let result = await postgres.CardType.create({ title, color, status });

		if (!result) return reject(new HumanError(Errors.ADD_FAILED.MESSAGE, Errors.ADD_FAILED.CODE));

		resolve("Successful");
	});
}

/**
 * update card type
 * @param {*} id
 * @param {*} title
 * @param {*} color
 * @param {*} status
 * @returns
 */
function editCardType(id, title, color, status) {
	return new Promise(async (resolve, reject) => {
		let update = {};

		if (title) update.title = title;

		if (color) update.color = color;

		if (status) update.status = status;

		let result = await postgres.CardType.update(update, { where: { id } });

		if (!result.shift())
			return reject(new NotFoundError(Errors.UPDATE_FAILED.MESSAGE, Errors.UPDATE_FAILED.CODE, { id }));

		return resolve("Successful");
	});
}

/**
 * delete card type
 * @param {*} id
 * @returns
 */
function delCardType(id) {
	return new Promise(async (resolve, reject) => {
		let result = await postgres.CardType.destroy({ where: { id } });

		if (!result) return reject(new HumanError(Errors.DELETE_FAILED.MESSAGE, Errors.DELETE_FAILED.CODE, { id: id }));

		resolve("Successful");
	});
}

async function getUserCard(userId, status, cardTypeId, page, limit, order) {
	// return new Promise(async (resolve, reject) => {
	let query = { userId: userId };
	let query2 = {};

	if (status) query.status = status;

	let result = await postgres.AssignedCard.findAndCountAll({
		where: query,
		limit: limit,
		offset: (page - 1) * limit,
		order: [["createdAt", order]],
		include: [
			{
				where: query2,
				model: postgres.Card,
				attributes: {
					exclude: ["createdAt", "updatedAt", "deletedAt", "status"],
				},
				include: [
					{
						model: postgres.CardType,
						where: { ...(cardTypeId ? { id: cardTypeId } : {}) },
						required: cardTypeId,
						attributes: {
							exclude: ["updatedAt", "deletedAt"],
						},
					},
				],
			},
		],
		raw: true,
		nest: true,
	});

	let prizes = await postgres.Prize.findAll({});
	prizes = _.groupBy(prizes, "cardTypeId");

	for (let i = 0; i < result.rows.length; i++) {
		result.rows[i].prize = prizes[`${result.rows[i].card.cardTypeId}`][0].amount;
		result.rows[i].card.attribute = await postgres.UserAttribute.findAll({
			where: { userId: userId, cardId: result.rows[i].cardId, type: { [postgres.Op.ne]: "FEE" } },
			attributes: {
				exclude: ["updatedAt", "deletedAt", "boxTradeId", "assetId"],
			},
			include: {
				model: postgres.Attribute,
				attributes: {
					exclude: ["updatedAt", "deletedAt", "createdAt"],
				},
			},
		});
	}

	return {
		total: result.count,
		pageSize: limit,
		page,
		data: result.rows,
	};
	// });
}

/**
 * get single card data
 * @param {*} id
 * @returns
 */
function getSingleCard(id) {
	return new Promise(async (resolve, reject) => {
		let query = { status: "ACTIVE", id };

		let result = await postgres.Card.findOne({
			where: query,
			attributes: {
				exclude: ["assignedNumber", "createdAt", "updatedAt", "deletedAt", "status"],
			},
			include: [
				// {
				// 	model: postgres.Player,
				// 	attributes: ["playerName"],
				// 	include: [
				// 		{
				// 			model: postgres.Team,
				// 			attributes: ["teamName", "teamBadge"],
				// 			include: [
				// 				{
				// 					model: postgres.League,
				// 					attributes: ["leagueSeason"],
				// 				},
				// 			],
				// 		},
				// 	],
				// },
				{ model: postgres.CardType, attributes: ["name", "image"] },
				// { model: postgres.Token, attributes: ["serialNumber", "txId"] },
			],
			raw: true,
			nest: true,
		});

		resolve(result);
	});
}

/**
 * card count
 * @returns
 */
function cardCount(
	page,
	limit,
	order,
	sort,
	//search
	playerId,
	tier,
	tierid,
	tiertitle,
	totalinitialnumber,
	totalsssignednumber,
	type,
	typecolor,
	typeid,
	typetitle,
) {
	return new Promise(async (resolve, reject) => {
		let offset = (page - 1) * limit;

		// let orderBy = `ORDER BY cards."${sort}" ${order}`,
		// 	condition = "";

		let result = await postgres.sequelize.query(
			`
			SELECT DISTINCT
			cards.* ,
			cardType.title AS typetitle,
			cardType.color AS typecolor,
			cardType."id" AS typeid,
			cardTier."id" AS tierid,
			cardTier.title AS tiertitle 
		FROM
			(
			SELECT
				"playerId",
				"assetId",
				"type",
				"tier",
				SUM ( "initialNumber" ) AS totalinitialnumber,
				SUM ( "assignedNumber" ) AS totalsssignednumber 
			FROM
				cards 
			WHERE
				"status" = 'ACTIVE' 
			GROUP BY
				"playerId",
				"assetId",
				"type",
				"tier" 
			) AS cards
			INNER JOIN "cardTypes" AS cardType ON cardType."id" = cards."type"
			INNER JOIN "cardTiers" AS cardTier ON cardTier."id" = cards."tier" 
		WHERE
			cards."totalinitialnumber" = cards."totalsssignednumber"
	
		LIMIT :limit
		OFFSET :offset
		`,
			{ replacements: { limit, offset } },
		);

		///count rows

		let countRows = await postgres.sequelize.query(
			`
			SELECT DISTINCT
			cards.* ,
			cardType.title AS typetitle,
			cardType.color AS typecolor,
			cardType."id" AS typeid,
			cardTier."id" AS tierid,
			cardTier.title AS tiertitle 
		FROM
			(
			SELECT
				"playerId",
				"assetId",
				"type",
				"tier",
				SUM ( "initialNumber" ) AS totalinitialnumber,
				SUM ( "assignedNumber" ) AS totalsssignednumber 
			FROM
				cards 
			WHERE
				"status" = 'ACTIVE' 
			GROUP BY
				"playerId",
				"assetId",
				"type",
				"tier" 
			) AS cards
			INNER JOIN "cardTypes" AS cardType ON cardType."id" = cards."type"
			INNER JOIN "cardTiers" AS cardTier ON cardTier."id" = cards."tier" 
		WHERE
			cards."totalinitialnumber" = cards."totalsssignednumber"
		`,
		);

		result = result.shift();
		total = countRows.shift();

		return resolve({
			total: total.length,
			pageSize: limit,
			page,
			data: result,
		});
	});
}

/**
 * card check by type id
 * @returns
 */
function check(data, user) {
	return new Promise(async (resolve, reject) => {
		const { cardTypeId } = data;

		const item = await postgres.AssignedCard.findOne({
			where: {
				userId: user.id,
				"$card.status$": "ACTIVE",
				"$card.cardType.id$": cardTypeId,
			},
			include: [{ model: postgres.Card, include: [postgres.CardType] }],
		});

		return resolve(item ? true : false);
	});
}

function cardsStatistic() {
	return new Promise(async (resolve, reject) => {
		const count = await postgres.AssignedCard.findAll({
			attributes: ["card.cardType.name", [sequelize.fn("COUNT", sequelize.col("userId")), "total"]],
			include: [{ model: postgres.Card, attributes: [], include: { model: postgres.CardType, attributes: [] } }],
			group: ["card.cardType.id"],
			raw: true,
			nest: true,
		});

		const sells = await postgres.UserAuctionTrade.findAll({
			attributes: [
				"auction.assignedCard.card.cardType.name",
				[sequelize.fn("SUM", sequelize.col("amount")), "total"],
			],
			include: {
				model: postgres.Auction,
				as: "auction",
				attributes: [],
				include: {
					model: postgres.AssignedCard,
					attributes: [],
					include: {
						model: postgres.Card,
						attributes: [],
						include: { model: postgres.CardType, attributes: [] },
					},
				},
			},
			group: ["auction.assignedCard.card.cardType.id"],
			raw: true,
			nest: true,
		});

		return resolve({ count, sells });
	});
}

function tickets() {
	return new Promise(async (resolve, reject) => {
		const items = await postgres.CardType.findAll({
			where: {
				status: "ACTIVE",
			},
			attributes: ["id", "name", "image"],
			raw: true,
		});

		for (let i = 0; i < items.length; i++) {
			items[i]["auction"] = await postgres.Auction.findOne({
				where: {
					status: "ACTIVE",
					start: { [postgres.Op.lte]: Date.now() },
					end: { [postgres.Op.gte]: Date.now() },
					"$assignedCard.card.cardTypeId$": items[i].id,
					"$assignedCard.status$": "INAUCTION",
				},
				attributes: ["id", "immediatePrice", "start", "end"],
				include: [
					{
						model: postgres.AssignedCard,
						attributes: [],
						include: {
							model: postgres.Card,
							attributes: [
								"name",
								"description",
								"image",
								"chain",
								"edition",
								"allowedUsageNumber",
								"attributes",
							],
						},
					},
				],
				raw: true,
				nest: true,
			});

			const tempPrize = await postgres.Prize.findAll({
				where: { cardTypeId: items[i].id },
				order: [["id", "DESC"]],
				limit: 1,
				include: [postgres.Asset, postgres.CardType],
			});

			const prize = tempPrize.length > 0 ? tempPrize[0] : null;

			items[i].prizeData = { prize };
		}

		return resolve(items);
	});
}

module.exports = {
	getCards,
	cardSelector,
	getCard,
	editCard,
	deleteCard,
	getAssignedCard,
	getCardTypes,
	cardTypeSelector,
	getCardType,
	addCardType,
	editCardType,
	delCardType,
	getUserCard,
	getSingleCard,
	cardCount,
	getCardByManager,
	getCardsByManager,
	check,
	cardsStatistic,
	tickets,
	createAssignedCard,
};
