
const {
    httpResponse: {response, apiError},
    httpStatus,
} = require("../../../../utils");
const { tokenPrizeService} = require("../../../../services");

/**
 * get Token Prize list
 */
exports.getTokenPrizes = async (req, res) => {
    const data = await tokenPrizeService.getTokenPrizes(req.query);
    return response({res, statusCode: httpStatus.OK, data});

};


/**
 * get token Prize

 */
exports.getTokenPrize = async (req, res) => {
    const {id} = req.params;
    const data = await tokenPrizeService.getTokenPrize(id);
    return response({res, statusCode: httpStatus.OK, data});

};


/**
 * add Token Prize
 */
exports.addTokenPrize = async (req, res) => {
    const {cardTypeId, assetId, amount, status} = req.body;
    const data = await tokenPrizeService.addTokenPrize(cardTypeId, assetId, amount, status);
    return response({res, statusCode: httpStatus.OK, data});

};


/**
 * edit token Prize
 */
exports.editTokenPrize = async (req, res) => {
    const {id} = req.params;
    const {cardTypeId, assetId, amount, status} = req.body;
    const data = await tokenPrizeService.editTokenPrize(id, cardTypeId, assetId, amount, status);
    return response({res, statusCode: httpStatus.OK, data});

};


/**
 * delete token prize
 */
exports.delTokenPrize = async (req, res) => {
    const {id} = req.params;
    const data = await tokenPrizeService.delTokenPrize(id);
    return response({res, statusCode: httpStatus.OK, data});

};


