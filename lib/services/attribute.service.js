const { postgres } = require("../databases");
const { dateQueryBuilder } = require("../utils/dateQueryBuilder");
const { HumanError, InternalError, NotFoundError } = require("./errorhandler");
const Errors = require("./errorhandler/MessageText");

exports.createAttribute = (data, files) => {
	return new Promise(async (resolve, reject) => {
		const { cardTypeId, name, type, amount } = data;

		const existAttribute = await postgres.Attribute.findOne({
			where: { cardTypeId, name, type, status: "ACTIVE" },
			raw: true,
		});
		if (existAttribute) {
			return reject(new HumanError(Errors.DUPLICATE_DATA.MESSAGE, Errors.DUPLICATE_DATA.CODE, { name }));
		}

		const cardType = await postgres.CardType.findByPk(cardTypeId, { raw: true });
		if (!cardType) {
			return reject(
				new NotFoundError(Errors.CARD_TYPE_NOT_FOUND.MESSAGE, Errors.CARD_TYPE_NOT_FOUND.CODE, { cardTypeId }),
			);
		}

		let iconData = {};

		if (Object.keys(files).length) {
			for (let key in files) {
				let file = files[key].shift();

				iconData[key] = [
					{
						name: file.newName,
						key: file.key,
						location: file.location,
					},
				];
			}
		}

		const newAttribute = await new postgres.Attribute({ cardTypeId, name, type, amount, ...iconData }).save();
		if (!newAttribute) {
			return reject(new InternalError(Errors.ADD_FAILED.MESSAGE, Errors.ADD_FAILED.CODE));
		}

		return resolve("Success");
	});
};

exports.editAttribute = (data, files) => {
	return new Promise(async (resolve, reject) => {
		const { id, cardTypeId, name, type, amount } = data;

		const currentAttribute = await postgres.Attribute.findOne({ where: { id, status: "ACTIVE" } });
		if (!currentAttribute) {
			return reject(new NotFoundError(Errors.ITEM_NOT_FOUND.MESSAGE, Errors.ITEM_NOT_FOUND.CODE, { id }));
		}

		const existQuery = { id: { [postgres.Op.ne]: id }, status: "ACTIVE" };
		if (cardTypeId) {
			existQuery.cardTypeId = cardTypeId;
		} else existQuery.cardTypeId = currentAttribute.cardTypeId;

		if (name) {
			existQuery.name = name;
		} else existQuery.name = currentAttribute.name;

		if (type) {
			existQuery.type = type;
		} else existQuery.type = currentAttribute.type;

		const existAttribute = await postgres.Attribute.findOne({
			where: existQuery,
			raw: true,
		});

		if (existAttribute) {
			return reject(
				new HumanError(Errors.DUPLICATE_DATA.MESSAGE, Errors.DUPLICATE_DATA.CODE, { cardTypeId, name, type }),
			);
		}

		let newDataFlag = false;

		const updateData = {};
		if (Object.keys(files).length) {
			newDataFlag = true;
			for (let key in files) {
				let file = files[key].shift();

				updateData[key] = [
					{
						name: file.newName,
						key: file.key,
						location: file.location,
					},
				];
			}
		} else updateData["icon"] = currentAttribute.icon;

		if (name) {
			if (currentAttribute.name !== name) newDataFlag = true;
			updateData.name = name;
		} else updateData.name = currentAttribute.name;

		if (cardTypeId) {
			if (currentAttribute.cardTypeId != cardTypeId) newDataFlag = true;
			updateData.cardTypeId = cardTypeId;
		} else updateData.cardTypeId = currentAttribute.cardTypeId;

		if (type) {
			if (currentAttribute.type !== type) newDataFlag = true;
			updateData.type = type;
		} else updateData.type = currentAttribute.type;

		if (amount) {
			if (currentAttribute.amount != amount) newDataFlag = true;
			updateData.amount = amount;
		} else updateData.amount = currentAttribute.amount;

		if (newDataFlag) {
			await currentAttribute.update({ status: "INACTIVE" });
			const result = await postgres.Attribute.create(updateData);
			if (!result) {
				return reject(new InternalError(Errors.UPDATE_FAILED.MESSAGE, Errors.UPDATE_FAILED.CODE));
			}
		}

		return resolve("Success");
	});
};

exports.deleteAttribute = (data) => {
	return new Promise(async (resolve, reject) => {
		const { id } = data;

		const currentAttribute = await postgres.Attribute.findOne({ where: { id, status: "ACTIVE" } });
		if (!currentAttribute) {
			return reject(new NotFoundError(Errors.ITEM_NOT_FOUND.MESSAGE, Errors.ITEM_NOT_FOUND.CODE, { id }));
		}

		const deletedAttribute = await currentAttribute.destroy();

		return resolve("Successful");
	});
};

exports.getAttribute = (data) => {
	return new Promise(async (resolve, reject) => {
		const { id } = data;

		const currentAttribute = await postgres.Attribute.findOne({
			where: { id, status: "ACTIVE" },
			include: { model: postgres.CardType, attributes: ["id", "name", "image"] },
			nest: true,
			raw: true,
		});
		if (!currentAttribute) {
			return reject(new NotFoundError(Errors.ITEM_NOT_FOUND.MESSAGE, Errors.ITEM_NOT_FOUND.CODE, { id }));
		}

		return resolve(currentAttribute);
	});
};

exports.getAttributes = (data) => {
	return new Promise(async (resolve, reject) => {
		const { page, limit, sort, order, createdAt, id, searchQuery, name, type, cardTypeId } = data;

		if (cardTypeId) {
			const items = await postgres.Attribute.findAll({
				where: { cardTypeId: cardTypeId, status: "ACTIVE" },
				attributes: { exclude: ["deletedAt", "updatedAt"] },
			});

			return resolve({
				data: items,
			});
		}

		const query = { status: "ACTIVE" };

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
		if (name && name.length > 0) query.name = { [postgres.Op.in]: name };
		if (type && type.length > 0) query.type = { [postgres.Op.in]: type };

		const items = await postgres.Attribute.findAndCountAll({
			where: query,
			limit,
			offset,
			order: [[sort, order]],
			include: { model: postgres.CardType, attributes: ["id", "name", "image"] },
			nest: true,
			raw: true,
		});

		resolve({
			total: items.count,
			pageSize: limit,
			page,
			data: items.rows,
		});
		return resolve(items);
	});
};

exports.getAttributeByManager = (data) => {
	return new Promise(async (resolve, reject) => {
		const { id } = data;

		const currentAttribute = await postgres.Attribute.findOne({
			where: { id, status: "ACTIVE" },
			include: { model: postgres.CardType, attributes: ["id", "name", "image"] },
			nest: true,
			raw: true,
		});
		if (!currentAttribute) {
			return reject(new NotFoundError(Errors.ITEM_NOT_FOUND.MESSAGE, Errors.ITEM_NOT_FOUND.CODE, { id }));
		}

		return resolve(currentAttribute);
	});
};

exports.getAttributesByManager = async (data) => {
	const { page, limit, sort, order, createdAt, id, searchQuery, name, type, cardTypeId, amount, status } = data;

	const query = {
		status: "ACTIVE",
	};
	const offset = (page - 1) * limit;

	if (status) query.status = status;
	if (name && name.length > 0) query.name = { [postgres.Op.in]: name };
	if (type && type.length > 0) query.type = { [postgres.Op.in]: type };
	if (cardTypeId && cardTypeId.length > 0) query.cardTypeId = { [postgres.Op.in]: cardTypeId };
	if (parseFloat(amount) >= 0) query.amount = amount;

	if (createdAt) {
		const { start, end } = dateQueryBuilder(createdAt);
		query.createdAt = { [postgres.Op.gte]: start, [postgres.Op.lte]: end };
	}

	if (id)
		query.id = postgres.sequelize.where(postgres.sequelize.cast(postgres.sequelize.col("id"), "varchar"), {
			[postgres.Op.iLike]: `%${id}%`,
		});

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

	const items = await postgres.Attribute.findAndCountAll({
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
};

exports.getUserAttribute = (data, user) => {
	return new Promise(async (resolve, reject) => {
		const { id } = data;

		const currentAttribute = await postgres.UserAttribute.findOne({
			where: { id, userId: user.id },
			include: [
				{ model: postgres.Card, include: postgres.CardType },
				{ model: postgres.Attribute, include: postgres.CardType },
			],
			nest: true,
			raw: true,
		});
		if (!currentAttribute) {
			return reject(new NotFoundError(Errors.ITEM_NOT_FOUND.MESSAGE, Errors.ITEM_NOT_FOUND.CODE, { id }));
		}

		return resolve(currentAttribute);
	});
};

exports.getUserAttributes = (data, user) => {
	return new Promise(async (resolve, reject) => {
		const { page, limit, sort, order, createdAt, id, searchQuery, name, type } = data;

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
		if (name && name.length > 0) query.name = { [postgres.Op.in]: name };

		/*if (type && type.length > 0)
            query.type = {[postgres.Op.in]: type};*/

		query.type = "INITIAL";

		const items = await postgres.UserAttribute.findAll({
			where: query,
			limit,
			offset,
			order: [[sort, order]],
			include: [
				{
					model: postgres.Card,
					include: postgres.CardType,
					attributes: { exclude: ["updatedAt", "deletedAt"] },
				},
				{
					model: postgres.Attribute,
					include: postgres.CardType,
					attributes: { exclude: ["deletedAt", "updatedAt"] },
				},
			],
			attributes: {
				exclude: ["userId", "assetId", "boxTradeId", "updatedAt", "deletedAt"],
			},
		});

		return resolve({
			total: items.length,
			pageSize: limit,
			page,
			data: items,
		});
	});
};

exports.getUserAttributeByManager = async (data) => {
	const { id } = data;

	const currentAttribute = await postgres.UserAttribute.findOne({
		where: { id },
		include: [
			{ model: postgres.Card, include: postgres.CardType },
			{ model: postgres.Attribute, include: postgres.CardType },
			{ model: postgres.User, attributes: ["id", "name", "avatar", "email"], include: postgres.Country },
		],
		nest: true,
		raw: true,
	});
	if (!currentAttribute) {
		return reject(new NotFoundError(Errors.ITEM_NOT_FOUND.MESSAGE, Errors.ITEM_NOT_FOUND.CODE, { id }));
	}

	return currentAttribute;
};

exports.getUserAttributesByManager = async (data) => {
	const {
		page,
		limit,
		sort,
		order,
		createdAt,
		id,
		searchQuery,
		name,
		type,
		userId,
		cardTypeId,
		userName,
		attribute,
		amount,
	} = data;

	const query = {};

	const offset = (page - 1) * limit;

	if (id) query.id = id;
	if (userId) query.userId = userId;
	if (amount) query.amount = amount;
	if (name && name.length > 0) query.name = { [postgres.Op.in]: name };
	if (type && type.length > 0) query.type = { [postgres.Op.in]: type };
	// if (cardTypeId) query.cardId = {[postgres.Op.in]: cardTypeId};

	if (cardTypeId) {
		query[postgres.Op.or] = [{ "$card.cardTypeId$": { [postgres.Op.in]: cardTypeId } }];
	}

	if (attribute) {
		query[postgres.Op.or] = [{ "$attribute.name$": { [postgres.Op.in]: attribute } }];
	}

	if (userName) {
		query[postgres.Op.or] = [
			{ "$user.name$": { [postgres.Op.iLike]: `%${userName}%` } },
			{ "$user.email$": { [postgres.Op.iLike]: `%${userName}%` } },
		];
	}

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
	const items = await postgres.UserAttribute.findAndCountAll({
		where: query,
		limit,
		offset,
		order: [[sort, order]],
		include: [
			{ model: postgres.Card, include: postgres.CardType },
			{ model: postgres.Attribute, include: postgres.CardType },
			{ model: postgres.User, attributes: ["id", "name", "avatar", "email"], include: postgres.Country },
		],
		nest: true,
		raw: true,
	});

	return {
		total: items.count,
		pageSize: limit,
		page,
		data: items.rows,
	};
};
