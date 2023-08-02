/*
| Author : Mohammad Ali Ghazi
| Email  : mohamadalghazy@gmail.com
| Date   : Fri Dec 17 2021
| Time   : 12:01:57 AM
 */

const {postgres} = require("../../../databases");
const {NotFoundError, HumanError} = require("../../errorhandler");
const Errors = require("../../errorhandler/MessageText");
const {InvalidRequestError} = require("../../errorhandler");
const {dateQueryBuilder} = require("../../../utils/dateQueryBuilder");


/**
 * get token Prize list
 */
async function getTokenPrizes(data) {
    const {status, page, limit, order, id, createdAt, sort, cardTypeId, cardTypeName, assetId, amount, asset} = data;
    let query = {};
    let query1 = {};

    if (id) query.id = id;
    if (cardTypeId) query.cardTypeId = {[postgres.Op.in]: cardTypeId};
    if (status) query.status = {[postgres.Op.in]: status};
    if (cardTypeName) query1.name = cardTypeName;
    if (parseFloat(amount) >= 0) query.amount = amount;
    if (asset) query["$asset.name$"] = {[postgres.Op.iLike]: "%" + asset + "%"};


    if (createdAt) {
        const {start, end} = dateQueryBuilder(createdAt);
        query.createdAt = {[postgres.Op.gte]: start, [postgres.Op.lte]: end};
    }

    let result = await postgres.TokenPrize.findAndCountAll({
        where: query,

        include: [{
            model: postgres.CardType,
            where: query1

        }, {
            model: postgres.Asset,

        }
        ],

        limit: limit,
        offset: (page - 1) * limit,
        order: [[sort, order]]
    });

    return ({
        total: result.count,
        pageSize: limit,
        page,
        data: result.rows
    });
}


/**
 * get token Prize
 */
async function getTokenPrize(id) {
    let result = await postgres.TokenPrize.findOne({
        where: {id},
        include: [{
            model: postgres.CardType,
        }, {
            model: postgres.Asset,

        }
        ]
    });


    return result;
}

/**
 * add token Prize
 */
async function addTokenPrize(cardTypeId, assetId, amount, status) {
    const token_prize = await postgres.TokenPrize.findOne({
        where: {cardTypeId: cardTypeId}
    });
    if (token_prize)

        return await postgres.TokenPrize.create({cardTypeId, assetId, amount, status})
}

/**
 * update token Prize
 */
async function editTokenPrize(id, cardTypeId, assetId, amount, status) {
    let update = {};

    if (cardTypeId) update.cardTypeId = cardTypeId;
    if (status) update.status = status;
    if (assetId) update.assetId = assetId;
    if (amount) update.amount = amount;

    await postgres.TokenPrize.update(update, {where: {id}});
    return await postgres.TokenPrize.findOne({
        where: {id},
        include: [{
            model: postgres.CardType,
        }, {
            model: postgres.Asset,
        }
        ]
    });
}


/**
 * delete token prize
 */
async function delTokenPrize(id) {

    await postgres.TokenPrize.destroy({where: {id}});
    return ("Successful");
}

module.exports = {
    getTokenPrizes,
    addTokenPrize,
    editTokenPrize,
    getTokenPrize,
    delTokenPrize
};
