const { postgres } = require("../../../databases");
const { NotFoundError, HumanError, ConflictError } = require("../../errorhandler");
const { dateQueryBuilder } = require("../../../utils/dateQueryBuilder");
const Errors = require("../../errorhandler/MessageText");

const addCardType = async (data, files) => {
	const { name, status, price, swapConstant } = data;

	let image = {};
	let image2 = {};

	if (files && Object.keys(files).length) {
		if (files["image"]) {
			let file = files["image"].shift();

			image["image"] = [
				{
					name: file.newName,
					key: file.image,
					location: file.location,
				},
			];
		}

		if (files["calculator_image"]) {
			let calculator_image = files["calculator_image"].shift();
			image2 = [
				{
					name: calculator_image.newName,
					key: calculator_image.calculator_image,
					location: calculator_image.location,
				},
			];
		}
	}

	const existCardType = await postgres.CardType.findOne({ where: { name }, raw: true });
	if (existCardType)
		throw new ConflictError(Errors.CARD_TYPE_DUPLICATE.MESSAGE, Errors.CARD_TYPE_DUPLICATE.CODE, { name });

	const result = await postgres.CardType.create({
		name,
		price,
		status,
		...image,
		calculator_image: image2,
		swapConstant,
	});
	if (!result) throw new HumanError(Errors.CARD_TYPE_CREATE_FAILED.MESSAGE, Errors.CARD_TYPE_CREATE_FAILED.CODE);

	return result;
};

const editCardType = async (data, files) => {
	const { id, name, status, price, swapConstant } = data;
	if (name) {
		const existCardType = await postgres.CardType.findOne({
			where: { id: { [postgres.Op.ne]: id }, name },
			raw: true,
		});

		if (existCardType)
			throw new ConflictError(Errors.CARD_TYPE_DUPLICATE.MESSAGE, Errors.CARD_TYPE_DUPLICATE.CODE, { name });
	}

	const update = {};

	if (files && Object.keys(files).length) {
		if (files["image"]) {
			let file = files["image"].shift();

			update["image"] = [
				{
					name: file.newName,
					key: file.image,
					location: file.location,
				},
			];
		}

		if (files["calculator_image"]) {
			let calculator_image = files["calculator_image"].shift();
			update["calculator_image"] = [
				{
					name: calculator_image.newName,
					key: calculator_image.calculator_image,
					location: calculator_image.location,
				},
			];
		}
	}

	if (name) update.name = name;
	if (status) update.status = status;
	if (price) update.price = price;
	if (swapConstant !== undefined) update.swapConstant = swapConstant;

	const result = await postgres.CardType.update(update, { where: { id } });

	if (!result.shift())
		throw new NotFoundError(Errors.CARD_TYPE_UPDATE_FAILED.MESSAGE, Errors.CARD_TYPE_UPDATE_FAILED.CODE, { id });

	return await postgres.CardType.findOne({ where: { id } });
};

const deleteCardType = async (id) => {
	const result = await postgres.CardType.destroy({ where: { id } });

	if (!result)
		throw new HumanError(Errors.CARD_TYPE_DELETE_FAILED.MESSAGE, Errors.CARD_TYPE_DELETE_FAILED.CODE, { id: id });

	return result;
};

const getCardType = async (id) => {
	const result = await postgres.CardType.findByPk(id);

	if (!result) throw new NotFoundError(Errors.CARD_TYPE_NOT_FOUND.MESSAGE, Errors.CARD_TYPE_NOT_FOUND.CODE, { id });

	return result;
};

const getCardTypes = async (data) => {
	const { name, status, page, limit, order, sort, searchQuery, createdAt, id, price, swapConstant } = data;
	const query = {};

	if (name) query.name = { [postgres.Op.iLike]: "%" + name + "%" };
	if (status) query.status = status;
	if (swapConstant !== undefined) query.swapConstant = swapConstant;

	if (parseFloat(price) >= 0)
		query.price = postgres.sequelize.where(postgres.sequelize.cast(postgres.sequelize.col("price"), "integer"), {
			[postgres.Op.eq]: price,
		});

	if (id) query.id = id;
	// query.id = postgres.sequelize.where(postgres.sequelize.cast(postgres.sequelize.col("id"), "varchar"), {
	//     [postgres.Op.iLike]: `%${searchQuery}%`,
	// });

	if (createdAt) {
		const { start, end } = dateQueryBuilder(createdAt);
		query.createdAt = { [postgres.Op.gte]: start, [postgres.Op.lte]: end };
	}

	if (searchQuery)
		query[postgres.Op.or] = [
			{
				id: postgres.sequelize.where(postgres.sequelize.cast(postgres.sequelize.col("id"), "varchar"), {
					[postgres.Op.iLike]: `%${searchQuery}%`,
				}),
			},
			{ name: { [postgres.Op.like]: "%" + searchQuery + "%" } },
		];

	let result = await postgres.CardType.findAndCountAll({
		where: query,
		limit: limit,
		offset: (page - 1) * limit,
		order: [[sort, order]],
	});

	return {
		total: result.count,
		pageSize: limit,
		page,
		data: result.rows,
	};
};

const getCardTypeByManager = async (id) => {
	const result = await postgres.CardType.findByPk(id);

	if (!result) throw new NotFoundError(Errors.CARD_TYPE_NOT_FOUND.MESSAGE, Errors.CARD_TYPE_NOT_FOUND.CODE, { id });

	return result;
};

const getCardTypesByManager = async (data) => {
	const { name, status, page, limit, order, sort, searchQuery, createdAt, id } = data;
	const query = {};

	if (name) query.name = { [postgres.Op.iLike]: "%" + name + "%" };
	if (status) query.status = status;

	if (id)
		query.id = postgres.sequelize.where(postgres.sequelize.cast(postgres.sequelize.col("id"), "varchar"), {
			[postgres.Op.iLike]: `%${searchQuery}%`,
		});

	if (createdAt) {
		const { start, end } = dateQueryBuilder(createdAt);
		query.createdAt = { [postgres.Op.gte]: start, [postgres.Op.lte]: end };
	}

	if (searchQuery)
		query[postgres.Op.or] = [
			{
				id: postgres.sequelize.where(postgres.sequelize.cast(postgres.sequelize.col("id"), "varchar"), {
					[postgres.Op.iLike]: `%${searchQuery}%`,
				}),
			},
			{ name: { [postgres.Op.like]: "%" + searchQuery + "%" } },
		];

	const result = await postgres.CardType.findAndCountAll({
		where: query,
		limit: limit,
		offset: (page - 1) * limit,
		order: [[sort, order]],
	});

	return {
		total: result.count,
		pageSize: limit,
		page,
		data: result.rows,
	};
};

module.exports = {
	addCardType,
	editCardType,
	deleteCardType,
	getCardType,
	getCardTypes,
	getCardTypeByManager,
	getCardTypesByManager,
};
