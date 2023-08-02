const {
    httpResponse: {response},
    httpStatus,
} = require("../../../../utils");
const {cardTypeService} = require("../../../../services");

exports.addCardType = async (req, res) => {
    const data = await cardTypeService.addCardType(req.body, req.files);
    return response({res, statusCode: httpStatus.OK, data});

};

exports.editCardType = async (req, res) => {
    const data = await cardTypeService.editCardType(req.body, req.files);
    return response({res, statusCode: httpStatus.OK, data});

};

exports.deleteCardType = async (req, res) => {
    const {id} = req.params;
    const data = await cardTypeService.deleteCardType(id);
    return response({res, statusCode: httpStatus.OK, data});

};

exports.getCardType = async (req, res) => {
    const {id} = req.params;
    const data = await cardTypeService.getCardType(id);
    return response({res, statusCode: httpStatus.OK, data});

};

exports.getCardTypes = async (req, res) => {

    const data = await cardTypeService.getCardTypes(req.query);
    return response({res, statusCode: httpStatus.OK, data});

};

exports.getCardTypeByManager = async (req, res) => {

    const {id} = req.params;
    const data = await cardTypeService.getCardType(id);
    return response({res, statusCode: httpStatus.OK, data});

};

exports.getCardTypesByManager = async (req, res) => {
    const data = await cardTypeService.getCardTypes(req.query);
    return response({res, statusCode: httpStatus.OK, data});

};
