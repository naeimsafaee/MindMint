const router = require("express").Router();
const { inputValidator, authMiddleware } = require("../../middlewares");
const {
	publicValidation,
	cardValidation,
	cardTypeValidation,
	auctionValidation,
	countryValidation,
	competitionValidation,
	attributeValidation,
	boxValidation,
} = require("../validations");
const {
	publicController,
	cardController,
	cardTypeController,
	auctionController,
	countryController,
	competitionController,
	attributeController,
	boxController,
} = require("../controllers");
const { prizeValidation } = require("./../validations");
const { tokenPrizeController, prizeController } = require("./../controllers");

router.route("/languages").get(inputValidator(publicValidation.getLanguages), publicController.getLanguages);

router.route("/asset").get(inputValidator(publicValidation.getAsset), publicController.getAsset);

router
	.route("/socket")
	.post(authMiddleware.checkAccess, inputValidator(publicValidation.addSocket), publicController.addSocket);

router.route("/card/:id").get(inputValidator(cardValidation.delCardTier), cardController.getSingleCard);

// Card Type
router.route("/card-type").get(inputValidator(cardTypeValidation.getCardTypes), cardTypeController.getCardTypes);
router.route("/card-type/:id").get(inputValidator(cardTypeValidation.getCardType), cardTypeController.getCardType);

// Card
router.route("/card").get(inputValidator(cardValidation.getCards), cardController.getCards);
router.route("/card/:id").get(inputValidator(cardValidation.getCard), cardController.getCard);

router.route("/auction").get(inputValidator(auctionValidation.getAuctionList), auctionController.getAllAuctions);

// Country
router.route("/country").get(inputValidator(countryValidation.getAllCountry), countryController.getAllCountry);
router.route("/country/:id").get(inputValidator(countryValidation.getOneCountry), countryController.getOneCountry);

//maintenance
router.route("/system/status").get(publicController.checkSystemStatus);

router.route("/tickets").get(cardController.tickets);

router.route("/system/health").get(publicController.checkSystemHealth);

// Attributes
router.route("/attributes").get(inputValidator(attributeValidation.getAttributes), attributeController.getAttributes);
router.route("/attributes/:id").get(inputValidator(attributeValidation.getAttribute), attributeController.getAttribute);

router.route("/app/versions").get(publicController.getAppVersion);

// Box Auction
router.route("/box/auction").get(inputValidator(boxValidation.getBoxAuctions), boxController.getBoxAuctions);
router.route("/box/auction/:id").get(inputValidator(boxValidation.getBoxAuction), boxController.getBoxAuction);

//Calculator
router.route("/calculator").post(inputValidator(publicValidation.calculator), publicController.calculator);

router.route("/token-prize").get(inputValidator(prizeValidation.getTokenPrizes), tokenPrizeController.getTokenPrizes);
router.route("/prize").get(inputValidator(prizeValidation.getPrizes), prizeController.getPrizes);

router.route("/app-configs").get(publicController.getAppConfigs);

module.exports = router;
