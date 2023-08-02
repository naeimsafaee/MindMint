const {
    httpResponse: {response},
    httpStatus,
} = require("./../../utils");
const {userService, notificationServices, auctionService} = require("./../../services");

const excelJS = require("exceljs");
const {postgres} = require("../../databases");

//? Detect user ip location
exports.detect = async (req, res) => {
    /* #swagger.tags = ['Test'] */
    try {
        const data = await userService.detect(req);
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        return res.status(e.statusCode).json(e);
    }
};

exports.info = async (req, res) => {
    const data = await userService.info(req.userEntity.id);
    return response({res, statusCode: httpStatus.OK, data});
};

//? User signup
exports.signUp = async (req, res) => {
    const {email, password, referredCode, link} = req.body;
    const data = await userService.signUp(email, password, referredCode, req, link);
    return response({res, statusCode: httpStatus.OK, data});
};

//? User signup
exports.updateCred = async (req, res) => {
    try {
        // #swagger.tags = ['User']
        const {email} = req.body;
        const data = await userService.updateCred(email, req.userEntity.id, req);
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        if (!e.statusCode) e = {statusCode: 500, status: "Internal Error", message: e.message};
        return res.status(e.statusCode).json(e);
    }
};

//? User login
exports.login = async (req, res) => {
    const {email, password} = req.body;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
    const deviceType = req.get("device-type") ? "app" : "pc";
    const deviceId = req.get("device-id");

    const data = await userService.login(email, password, ip, deviceType, deviceId);
    return response({res, statusCode: httpStatus.OK, data});
};

//? User Edit Profile
exports.editProfile = async (req, res) => {
    try {
        const {name, countryId} = req.body;
        const data = await userService.editProfile({name, id: req.userEntity.id, files: req.files, countryId});
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        if (!e.statusCode) e = {statusCode: 500, status: "Internal Error", message: e.message};
        return res.status(e.statusCode).json(e);
    }
};

/**
 * delete user account
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.deleteAccount = async (req, res) => {
    try {
        const {password} = req.body;
        const data = await userService.deleteAccount(password, req.userEntity.id);
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        if (!e.statusCode) e = {statusCode: 500, status: "Internal Error", message: e.message};
        return res.status(e.statusCode).json(e);
    }
};

exports.addAddress = async (req, res) => {
    const {address} = req.body;
    const data = await userService.addAddress(req.userEntity, address);
    return response({res, statusCode: httpStatus.OK, data});
};

//? User forget password request
exports.forgetPassword = async (req, res) => {
    try {
        const {email} = req.body;
        const data = await userService.forgetPassword(email, req);
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        if (!e.statusCode) e = {statusCode: 500, status: "Internal Error", message: e.message};
        return res.status(e.statusCode).json(e);
    }
};

//? User reset password request
exports.resetPassword = async (req, res) => {
    try {
        const {token, password} = req.body;
        const data = await userService.resetPassword(token, password);
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        if (!e.statusCode) e = {statusCode: 500, status: "Internal Error", message: e.message};
        return res.status(e.statusCode).json(e);
    }
};

//? User reset password request
exports.changePassword = async (req, res) => {
    try {
        const {oldPassword, newPassword} = req.body;
        const data = await userService.changePassword(oldPassword, newPassword, req.userEntity.id);
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        if (!e.statusCode) e = {statusCode: 500, status: "Internal Error", message: e.message};
        return res.status(e.statusCode).json(e);
    }
};

//? User verify login or signup or ...
exports.verify = async (req, res) => {
    try {
        const io = req.app.get("socketIo");

        const {token, code, pushToken} = req.body;
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || null;
        const deviceType = req.get("device-type") ? "app" : "pc";
        const deviceId = req.get("device-id");

        const data = await userService.verify(req, token, code, ip, deviceType, deviceId, pushToken, io);

        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        if (!e.statusCode) e = {statusCode: 500, status: "Internal Error", message: e.message};
        return res.status(e.statusCode).json(e);
    }
};

/**
 * user refresh token
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.refreshToken = async (req, res) => {
    try {
        const data = await userService.refreshToken(req.sessionEntity, req.userEntity);
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        if (!e.statusCode) e = {statusCode: 500, status: "Internal Error", message: e.message};
        return res.status(e.statusCode).json(e);
    }
};

/**
 * logout user and delete active token
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.logout = async (req, res) => {
    try {
        const deviceType = req.get("device-type") ? "app" : "pc";
        const deviceId = req.get("device-id");

        const data = await userService.logout(req.sessionEntity, deviceId, deviceType);
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        if (!e.statusCode) e = {statusCode: 500, status: "Internal Error", message: e.message};
        return res.status(e.statusCode).json(e);
    }
};

exports.notification = async (req, res) => {
    try {
        const {type, page, limit, status} = req.query;

        const data = await notificationServices.get(type, page, limit, status, Number(req.userEntity?.id));
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        if (!e.statusCode) e = {statusCode: 500, status: "Internal Error", message: e.message};
        return res.status(e.statusCode).json(e);
    }
};

exports.updatePushToken = async (req, res) => {
    try {
        const {fcmToken} = req.body;

        const data = await notificationServices.updatePushToken(fcmToken, Number(req.userEntity?.id));
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        return res.status(400).json(e);
    }
};

exports.notificationStatus = async (req, res) => {
    try {
        const {notification_id} = req.params;
        const data = await notificationServices.changeStatus(Number(req.userEntity?.id), notification_id);
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        if (!e.statusCode) e = {statusCode: 500, status: "Internal Error", message: e.message};
        return res.status(e.statusCode).json(e);
    }
};

exports.readNotification = async (req, res) => {
    const {notification_id} = req.body;
    const data = await notificationServices.readNotification(Number(req.userEntity?.id), notification_id);
    return response({res, statusCode: httpStatus.OK, data});
};

exports.testPushNotif = async (req, res) => {
    const userId = req.userEntity.id;
    const data = await userService.testPushNotif(req.body, userId);
    return response({res, statusCode: httpStatus.OK, data});
};

exports.referral = async (req, res) => {
    const data = await userService.referral(req.userEntity);
    return response({res, statusCode: httpStatus.ACCEPTED, data});
};

/**
 * get list user referral history
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.referralHistory = async (req, res) => {
    const data = await userService.referralHistory(req.query, req.userEntity);
    return response({res, statusCode: httpStatus.ACCEPTED, data});
};

/**
 * get user auction
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getAuctions = async (req, res) => {
    try {
        const {status, page, limit, order} = req.query;
        const data = await auctionService.getAll({status, page, limit, order, userId: req.userEntity.id});
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        return res.status(e.statusCode).json(e);
    }
};

/**
 * get user auction
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.getAuction = async (req, res) => {
    try {
        const {id} = req.params;
        const data = await auctionService.getOne(id, req.userEntity.id);
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        return res.status(e.statusCode).json(e);
    }
};

/**
 * add new auction
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.addAuction = async (req, res) => {
    try {
        const io = req.app.get("socketIo");

        const {assignedCardId, start, end, basePrice, immediatePrice, bookingPrice, auctionType} = req.body;

        const data = await auctionService.add(
            req.userEntity.id,
            assignedCardId,
            start,
            end,
            basePrice,
            immediatePrice,
            bookingPrice,
            null,
            io,
            auctionType,
        );
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        return res.status(e.statusCode).json(e);
    }
};

/**
 * edit auction
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.editAuction = async (req, res) => {
    try {
        const io = req.app.get("socketIo");

        const {id, start, end, basePrice, immediatePrice, bookingPrice} = req.body;
        const data = await auctionService.edit(
            req.userEntity.id,
            id,
            start,
            end,
            basePrice,
            immediatePrice,
            bookingPrice,
            null,
            io,
        );
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        // console.log(e);
        return res.status(e.statusCode).json(e);
    }
};

/**
 * delete auction
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.deleteAuction = async (req, res) => {
    try {
        const io = req.app.get("socketIo");
        const data = await auctionService.del(req.userEntity.id, req.params.id, io);
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        // console.log(e);
        return res.status(e.statusCode).json(e);
    }
};

///////////////////////////////// User CRUD /////////////////////////////////////////////////
/**
 * Get Users for manager
 * @param {*} req
 * @param {*} res
 */
exports.getUsers = async (req, res) => {
    const data = await userService.getUsers(req.query);
    return response({res, statusCode: httpStatus.OK, data});
};

/**
 * Get Users for manager
 * @param {*} req
 * @param {*} res
 */
exports.getUsersSelector = async (req, res) => {
    try {
        const data = await userService.getUsersSelector(req.query);
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        return res.status(e.statusCode).json(e);
    }
};

/**
 * Add Users by manager
 * @param {*} req
 * @param {*} res
 */
exports.addUsers = async (req, res) => {
    try {
        const data = await userService.addUsers(req.body, req.files);
        return response({res, statusCode: httpStatus.CREATED, data});
    } catch (e) {
        return res.status(e.statusCode).json(e);
    }
};

exports.damageAttribute = async (req, res) => {
    const data = userService.damageAttribute(req.body.cardId, req.userEntity.id);
    return response({res, statusCode: httpStatus.ACCEPTED, data});
};

/**
 * edit Users by manager
 * @param {*} req
 * @param {*} res
 */
exports.editUsers = async (req, res) => {
    try {
        const data = userService.editUsers(req.body, req.files);
        return response({res, statusCode: httpStatus.ACCEPTED, data});
    } catch (e) {
        return res.status(e.statusCode).json(e);
    }
};

exports.excelExport = async (req, res) => {
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet("Users");
    const path = "./public";

    worksheet.columns = [
        {header: "email", key: "email", width: 20},
        {header: "first_name", key: "name", width: 10},
        {header: "last_name", key: "", width: 10},
        {header: "address_line_1", key: "address", width: 10},
        {header: "address_line_2", key: "", width: 10},
        {header: "city", key: "", width: 10},
        {header: "state_province_region", key: "", width: 10},
        {header: "postal_code", key: "", width: 10},
        {header: "country", key: "country_name", width: 10},
    ];

    const users = await postgres.User.findAll({
        raw: true,
        attributes: {exclude: ["password", "salt"]},
        include: postgres.Country,
        nest: true,
    });

    users.forEach((user) => {
        user.country_name = user.country?.countryName;

        worksheet.addRow(user);
    });

    worksheet.getRow(1).eachCell((cell) => {
        cell.font = {bold: true};
    });

    try {
        await workbook.xlsx.writeFile(`${path}/users.xlsx`).then(() => {
            res.send({
                status: "success",
                path: `${path}/users.xlsx`,
            });
        });
    } catch (err) {
        res.send({
            status: "error",
            message: "Something went wrong",
            err: err,
        });
    }
};

exports.seed_cards = async (req, res) => {
    const cards = await postgres.Card.findAll({});

    for (let i = 0; i < cards.length; i++) {
        const assigned_card = await postgres.AssignedCard.findOne({
            where: {
                cardId: cards[i].id,
            },
        });

        if (!assigned_card) {
            await postgres.AssignedCard.create({
                cardId: cards[i].id,
                userId: null,
                type: "TRANSFER",
                usedCount: 0,
                status: "INAUCTION",
            });
        }
    }
    return res.send("ok");
};

/**
 * delete Users by manager
 * @param {*} req
 * @param {*} res
 */
exports.deleteUsers = async (req, res) => {
    try {
        const {id} = req.params;
        const data = await userService.deleteUsers(id);
        return response({res, statusCode: httpStatus.ACCEPTED, data});
    } catch (e) {
        return res.status(e.statusCode).json(e);
    }
};

/**
 * find user by id by manager
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.findUserById = async (req, res) => {
    try {
        const {id} = req.params;
        const data = await userService.findUserById(id);
        return response({res, statusCode: httpStatus.ACCEPTED, data});
    } catch (e) {
        return res.status(e.statusCode).json(e);
    }
};

/**
 * Get getUserActivity for manager
 * @param {*} req
 * @param {*} res
 */
exports.getUserActivity = async (req, res) => {
    try {
        const data = await userService.getUserActivity(req.query);
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        return res.status(e.statusCode).json(e);
    }
};

/**
 * get competition prize
 *
 */
exports.getPrizeCompetition = async (req, res) => {
    const {id} = req.params;
    const data = await userService.getPrizeCompetition(id);
    return response({res, statusCode: httpStatus.OK, data});
};

exports.testNotif = async (req, res) => {
    try {
        const io = req.app.get("socketIo");
        const data = await userService.testNotif(req.query.userId, io);
        return response({res, statusCode: httpStatus.OK, data});
    } catch (e) {
        return res.status(500).json(e);
    }
};

exports.getAttributes = async (req, res) => {
    const data = await userService.getAttributes(req.params.userId);
    return res.send({
        data: data,
    });
};

exports.editAttribute = async (req, res) => {
    const data = await userService.editAttribute(req.params.attributeId, req.body.amount);
    return res.send({
        data: data,
    });
};
