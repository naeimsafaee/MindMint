const { inputValidator } = require("../../../middlewares");
const { boxValidation } = require("../../validations");
const { boxV2Controller } = require("../../controllers");
const router = require("express").Router();

router.route("/box/auction").get(inputValidator(boxValidation.getBoxAuctions), boxV2Controller.getBoxAuctions);

module.exports = router;
