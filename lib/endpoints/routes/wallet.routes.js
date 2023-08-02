const router = require("express").Router();
const { walletController } = require("../controllers");
const { walletValidation } = require("../validations");
const { authMiddleware, inputValidator } = require("../../middlewares");

router
	.route("/config")
	.get(authMiddleware.userAuthMiddleware, inputValidator(walletValidation.config), walletController.config);

router
	.route("/list")
	.get(authMiddleware.userAuthMiddleware, inputValidator(walletValidation.list), walletController.list);

router.route("/").get(authMiddleware.userAuthMiddleware, walletController.getUserWallet);

router
	.route("/agent/config")
	.get(authMiddleware.agentAuthMiddleware, inputValidator(walletValidation.config), walletController.config);

router
	.route("/agent/list")
	.get(authMiddleware.agentAuthMiddleware, inputValidator(walletValidation.list), walletController.list);

module.exports = router;
