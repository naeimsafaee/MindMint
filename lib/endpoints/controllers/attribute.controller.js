const {
    httpResponse: {response},
    httpStatus
} = require("../../utils");
const {attributeService} = require("../../services");

exports.createAttribute = async (req, res) => {
    try {
        const data = await attributeService.createAttribute(req.body, req.files);
        return response({res, statusCode: httpStatus.CREATED, data});
    } catch (e) {
        if (!e.statusCode) e = {statusCode: 500, status: "Internal Error", message: e.message};
        return res.status(e.statusCode).json(e);
    }
};

exports.editAttribute = async (req, res) => {
    try {
        const data = await attributeService.editAttribute(req.body, req.files);
        return response({res, statusCode: httpStatus.ACCEPTED, data});
    } catch (e) {
        if (!e.statusCode) e = {statusCode: 500, status: "Internal Error", message: e.message};
        return res.status(e.statusCode).json(e);
    }
};

exports.deleteAttribute = async (req, res) => {
    try {
        const data = await attributeService.deleteAttribute(req.params);
        return response({res, statusCode: httpStatus.ACCEPTED, data});
    } catch (e) {
        if (!e.statusCode) e = {statusCode: 500, status: "Internal Error", message: e.message};
        return res.status(e.statusCode).json(e);
    }
};

exports.getAttributeByManager = async (req, res) => {
    try {
        const data = await attributeService.getAttribute(req.params);
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        if (!e.statusCode) e = {statusCode: 500, status: "Internal Error", message: e.message};
        return res.status(e.statusCode).json(e);
    }
};

exports.getAttributesByManager = async (req, res) => {
    const data = await attributeService.getAttributesByManager(req.query);
    return response({res, statusCode: httpStatus.OK, data});

};

exports.getAttribute = async (req, res) => {
    try {
        const data = await attributeService.getAttributeByManager(req.params);
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        if (!e.statusCode) e = {statusCode: 500, status: "Internal Error", message: e.message};
        return res.status(e.statusCode).json(e);
    }
};

exports.getAttributes = async (req, res) => {
    try {
        const data = await attributeService.getAttributes(req.query);
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        if (!e.statusCode) e = {statusCode: 500, status: "Internal Error", message: e.message};
        return res.status(e.statusCode).json(e);
    }
};

exports.getUserAttribute = async (req, res) => {
    try {
        const data = await attributeService.getUserAttribute(req.params, req.userEntity);
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        if (!e.statusCode) e = {statusCode: 500, status: "Internal Error", message: e.message};
        return res.status(e.statusCode).json(e);
    }
};

exports.getUserAttributes = async (req, res) => {
    try {
        const data = await attributeService.getUserAttributes(req.query, req.userEntity);
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        if (!e.statusCode)
            e = {statusCode: 500, status: "Internal Error", message: e.message};

        return res.status(e.statusCode).json(e);
    }
};

exports.getUserAttributeByManager = async (req, res) => {
    const data = await attributeService.getUserAttributeByManager(req.params, req.userEntity);
    return response({res, statusCode: httpStatus.OK, data});

};

exports.getUserAttributesByManager = async (req, res) => {
    const data = await attributeService.getUserAttributesByManager(req.query, req.userEntity);
    return response({res, statusCode: httpStatus.OK, data});

};
