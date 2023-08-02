const { authMiddleware } = require("../../../middlewares");
// const { swapController } = require("../../controllers/v2/Swap");
const { swapV2Controller } = require("../../controllers");

const router = require("express").Router();

router.route("/get").get(authMiddleware.userAuthMiddleware, swapV2Controller.index);

module.exports = router;
