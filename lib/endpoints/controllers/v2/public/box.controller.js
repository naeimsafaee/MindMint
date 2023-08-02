const {
	httpResponse: { response },
	httpStatus,
} = require("../../../../utils");
const { postgres } = require("../../../../databases");
const _ = require("lodash");

exports.getBoxAuctions = async (req, res) => {
	const { page, limit, sort, order, cardTypeId, min, max } = req.query;

	const query = { status: "IN_AUCTION" };

	const offset = (page - 1) * limit;

	if (cardTypeId) query["cardTypeId"] = cardTypeId;

	let data;

	if (cardTypeId) {
		const items = await postgres.Box.findAndCountAll({
			where: query,
			limit,
			offset,
			include: [
				{
					model: postgres.BoxAuction,
					where: { price: { [postgres.Op.gte]: min, [postgres.Op.lte]: max } },
					order: [[sort, order]],
					attributes: ["id", "price", "assetId", "status"],
					include: [
						{
							model: postgres.Asset,
							attributes: ["id", "coin", "name"],
						},
					],
				},
				{
					model: postgres.CardType,
					attributes: ["id", "name"],
				},
			],
			attributes: {
				exclude: [
					"updatedAt",
					"deletedAt",
					"megaPixelAmount",
					"batteryAmount",
					"negativeAmount",
					"damageAmount",
					"referralCount",
					"cardId",
				],
			},
			nest: true,
			raw: true,
		});

		data = {
			total: items.count,
			pageSize: limit,
			page,
			data: items.rows,
		};
	} else {
		let boxes = await postgres.sequelize.query(
			`WITH box AS (
SELECT "boxes".id,"boxes".name,"cardTypeId","boxes".image,"boxes".status,bA.price,"assetId",cT.name as cardTypeName,A.name as assetName,
ROW_NUMBER() OVER( PARTITION BY "cardTypeId") r
FROM boxes
inner join "boxAuctions" bA on boxes.id = bA."boxId"
    inner join "assets" A on A.id = bA."assetId"
inner join "cardTypes" cT on cT.id = boxes."cardTypeId"
where "boxes".status='IN_AUCTION' and bA."deletedAt" is null
)
SELECT * FROM box WHERE r <= 10;`,
			{ nest: true, raw: true },
		);

		boxes = _.groupBy(boxes, "cardTypeId");

		data = {
			total: boxes.length,
			pageSize: limit,
			page,
			data: boxes,
		};
	}

	return response({ res, statusCode: httpStatus.OK, data });
};
