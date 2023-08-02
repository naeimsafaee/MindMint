const router = require("express").Router();
const { swapController: sc } = require("../controllers");
const { swapValidation: sv } = require("../validations");
const { authMiddleware: auth, inputValidator } = require("../../middlewares");

router.route("/").post(auth.userAuthMiddleware, inputValidator(sv.swap), sc.swap);

router.route("/price").post(inputValidator(sv.swapPrice), sc.price);

router.route("/fee").post(auth.userAuthMiddleware, inputValidator(sv.swapFee), sc.fee);

module.exports = router;
