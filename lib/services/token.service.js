const { postgres } = require("../databases");
const { dateQueryBuilder } = require("../utils/dateQueryBuilder");
const { NotFoundError } = require("./errorhandler");
const Errors = require("./errorhandler/MessageText");

exports.getTokenByManager = (id) => {
	return new Promise(async (resolve, reject) => {
		const currentToken = await postgres.Token.findByPk(id, {
			include: [
				{ model: postgres.Card, where: { status: "ACTIVE" }, required: true, include: [postgres.CardType] },
				{ model: postgres.AssignedCard, where: { status: "FREE" } },
			],
		});
		if (!currentToken) {
			return reject(new NotFoundError(Errors.ITEM_NOT_FOUND.MESSAGE, Errors.ITEM_NOT_FOUND.CODE, { id }));
		}

		return resolve(currentToken);
	});
};

exports.getTokensByManager = (data) => {
	return new Promise(async (resolve, reject) => {
		const { page, limit, sort, order, createdAt, id, searchQuery } = data;

		const query = {};
		const offset = (page - 1) * limit;

		if (createdAt) {
			const { start, end } = dateQueryBuilder(createdAt);
			query.createdAt = { [postgres.Op.gte]: start, [postgres.Op.lte]: end };
		}

		if (searchQuery) {
			query.$or = [
				{
					id: postgres.sequelize.where(postgres.sequelize.cast(postgres.sequelize.col("id"), "varchar"), {
						[postgres.Op.iLike]: `%${searchQuery}%`,
					}),
				},
				{ title: { [postgres.Op.iLike]: `%${searchQuery}%` } },
				{ description: { [postgres.Op.iLike]: `%${searchQuery}%` } },
			];
		}

		if (id)
			query.id = postgres.sequelize.where(postgres.sequelize.cast(postgres.sequelize.col("id"), "varchar"), {
				[postgres.Op.iLike]: `%${id}%`,
			});

		const items = await postgres.Token.findAndCountAll({
			where: query,
			limit,
			offset,
			order: [[sort, order]],
			include: [
				{ model: postgres.Card, where: { status: "ACTIVE" }, required: true, include: [postgres.CardType] },
				{ model: postgres.AssignedCard, where: { status: "FREE" } },
			],
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
