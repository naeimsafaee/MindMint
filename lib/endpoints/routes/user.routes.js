const router = require("express").Router();
const {
	userController,
	auctionController,
	cardController,
	ticketController,
	departmentController,
	competitionController,
	attributeController,
	boxController,
} = require("./../controllers");
const {
	userValidation,
	auctionValidation,
	cardValidation,
	ticketValidation,
	departmentValidation,
	competitionValidation,
	attributeValidation,
	boxValidation,
} = require("./../validations");
const { authMiddleware, inputValidator, recaptcha } = require("./../../middlewares");
const { avatarUpload, ticketUpload } = require("../../middlewares/s3Uploader");
const throttle = require("express-throttle");

router.route("/detect").get(userController.detect);

router
	.route("/")
	.get(authMiddleware.userAuthMiddleware, userController.info)
	.put(
		authMiddleware.userAuthMiddleware,
		avatarUpload.fields([{ name: "avatar", maxCount: 1 }]),
		inputValidator(userValidation.editProfile),
		userController.editProfile,
	);

router
	.route("/address")
	.post(authMiddleware.userAuthMiddleware, inputValidator(userValidation.addAddress), userController.addAddress);

router
	.route("/signup")
	.post(
		//rateLimit.rateLimitMiddleware,
		throttle({ rate: "3/s" }),
		recaptcha.recaptchaMiddleware,
		inputValidator(userValidation.signup),
		userController.signUp,
	)
	.patch(
		//	rateLimit.rateLimitMiddleware,
		throttle({ rate: "3/s" }),
		authMiddleware.userAuthMiddleware,
		inputValidator(userValidation.updateCred),
		userController.updateCred,
	);

router.route("/login").post(
	//rateLimit.rateLimitMiddleware,
	throttle({ rate: "3/s" }),
	recaptcha.recaptchaMiddleware,
	inputValidator(userValidation.login),
	userController.login,
);

router.route("/logout").get(
	//rateLimit.rateLimitMiddleware,
	authMiddleware.userAuthMiddleware,
	userController.logout,
);

router
	.route("/delete-account")
	.put(authMiddleware.userAuthMiddleware, inputValidator(userValidation.deleteAccount), userController.deleteAccount);

router
	.route("/password")
	.post(
		//	rateLimit.rateLimitMiddleware,
		recaptcha.recaptchaMiddleware,
		inputValidator(userValidation.forgetPassword),
		userController.forgetPassword,
	)
	.patch(
		//	rateLimit.rateLimitMiddleware,
		recaptcha.recaptchaMiddleware,
		inputValidator(userValidation.resetPassword),
		userController.resetPassword,
	)
	.put(
		//	rateLimit.rateLimitMiddleware,
		authMiddleware.userAuthMiddleware,
		inputValidator(userValidation.changePassword),
		userController.changePassword,
	);

router.route("/verify").post(
	//	rateLimit.rateLimitMiddleware,
	recaptcha.recaptchaMiddleware,
	inputValidator(userValidation.verify),
	userController.verify,
);

router.route("/refresh-token").get(authMiddleware.userAuthRefreshMiddleware, userController.refreshToken);

//todo
router
	.route("/notifications")
	.get(authMiddleware.userAuthMiddleware, inputValidator(userValidation.notification), userController.notification);

router
	.route("/notification/push-token")
	.post(
		authMiddleware.userAuthMiddleware,
		inputValidator(userValidation.updatePushToken),
		userController.updatePushToken,
	);

router
	.route("/notifications/:notification_id?")
	.patch(authMiddleware.userAuthMiddleware, userController.notificationStatus);

router
	.route("/read_notifications")
	.post(
		authMiddleware.userAuthMiddleware,
		inputValidator(userValidation.readNotification),
		userController.readNotification,
	);

router.route("/push-notification/test").post(
	authMiddleware.userAuthMiddleware,
	// inputValidator(userValidation.testPushNotif),
	userController.testPushNotif,
);

router.route("/referral").get(authMiddleware.userAuthMiddleware, userController.referral);

router
	.route("/referral/history")
	.get(authMiddleware.userAuthMiddleware, inputValidator(userValidation.getReferral), userController.referralHistory);

router
	.route("/auction-trades")
	.get(
		authMiddleware.userAuthMiddleware,
		inputValidator(auctionValidation.getAuctionTradesUser),
		auctionController.getAuctionTradesUser,
	);
router
	.route("/auction-trades/:id")
	.get(
		authMiddleware.userAuthMiddleware,
		inputValidator(auctionValidation.getAuctionTradeUser),
		auctionController.getAuctionTradeUser,
	);

router.route("/auction-list").get(
	// authMiddleware.userAuthMiddleware,
	inputValidator(auctionValidation.getAuctionList),
	auctionController.getAuctionList,
);

router.route("/auction-list/:id").get(
	// authMiddleware.userAuthMiddleware,
	inputValidator(auctionValidation.getSingleAuction),
	auctionController.getSingleAuction,
);

// router.route("/auction-offer-list").get(
// 	// authMiddleware.userAuthMiddleware,
// 	inputValidator(auctionValidation.getAuctionOfferList),
// 	auctionController.getAuctionOfferList,
// );

router
	.route("/card")
	.get(authMiddleware.userAuthMiddleware, inputValidator(cardValidation.getUserCard), cardController.getUserCard);

///////////////////////// Ticket ///////////////////////////

router
	.route("/ticket")
	.get(
		authMiddleware.userAuthMiddleware,
		inputValidator(ticketValidation.userGetTickets),
		ticketController.userGetTickets,
	)
	.post(
		authMiddleware.userAuthMiddleware,
		ticketUpload.fields([{ name: "files", maxCount: 5 }]),
		inputValidator(ticketValidation.userAddTicket),
		ticketController.userAddTicket,
	);

///signle

router
	.route("/ticket/:id")
	.get(
		authMiddleware.userAuthMiddleware,
		inputValidator(ticketValidation.userGetTicket),
		ticketController.userGetTicket,
	);

//reply

router
	.route("/reply")
	.get(
		authMiddleware.userAuthMiddleware,
		inputValidator(ticketValidation.userGetReplies),
		ticketController.userGetReplies,
	)
	.post(
		authMiddleware.userAuthMiddleware,
		ticketUpload.fields([{ name: "files", maxCount: 5 }]),
		inputValidator(ticketValidation.userAddReply),
		ticketController.userAddReply,
	);

//single reply

router
	.route("/reply/:id")
	.get(
		authMiddleware.userAuthMiddleware,
		inputValidator(ticketValidation.userGetReply),
		ticketController.userGetReply,
	);

//////department

router
	.route("/department/selector")
	.get(
		authMiddleware.userAuthMiddleware,
		inputValidator(departmentValidation.departmentSelector),
		departmentController.departmentSelector,
	);

router
	.route("/card/check")
	.get(authMiddleware.userAuthMiddleware, inputValidator(cardValidation.check), cardController.check);

router
	.route("/card/purchase")
	.post(
		authMiddleware.userAuthMiddleware,
		inputValidator(auctionValidation.purchaseCard),
		auctionController.purchaseCard,
	);

router.route("/prizes/:id").get(
	//authMiddleware.userAuthMiddleware,
	inputValidator(userValidation.getUserCompetition),
	userController.getPrizeCompetition,
);

// user competitions

router
	.route("/competition/focus/add")
	.post(
		authMiddleware.userAuthMiddleware,
		inputValidator(competitionValidation.addFocus),
		competitionController.addFocus,
	);

router
	.route("/competition/focus/end")
	.post(
		authMiddleware.userAuthMiddleware,
		inputValidator(competitionValidation.endFocus),
		competitionController.endFocus,
	);

router
	.route("/competition/focus/heart-beat")
	.post(
		authMiddleware.userAuthMiddleware,
		inputValidator(competitionValidation.endFocus),
		competitionController.heartBeat,
	);

router
	.route("/results")
	.get(
		authMiddleware.userAuthMiddleware,
		inputValidator(competitionValidation.getCompetitionById),
		competitionController.getResults,
	);

// Test Notif
router.route("/notif/test").get(/*authMiddleware.userAuthMiddleware, */ userController.testNotif);

// Attributes
router
	.route("/attributes")
	.get(
		authMiddleware.userAuthMiddleware,
		inputValidator(attributeValidation.getUserAttributes),
		attributeController.getUserAttributes,
	);
router
	.route("/attributes/:id")
	.get(
		authMiddleware.userAuthMiddleware,
		inputValidator(attributeValidation.getUserAttribute),
		attributeController.getUserAttribute,
	);

// Box
router
	.route("/box")
	.get(authMiddleware.userAuthMiddleware, inputValidator(boxValidation.getUserBoxes), boxController.getUserBoxes);
router
	.route("/box/:id")
	.get(authMiddleware.userAuthMiddleware, inputValidator(boxValidation.getUserBox), boxController.getUserBox);

// Box Purchase
router
	.route("/box/purchase")
	.post(authMiddleware.userAuthMiddleware, inputValidator(boxValidation.purchaseBox), boxController.purchaseBox);

// Box Purchase
router
	.route("/box/OpenGiftBox")
	.post(authMiddleware.userAuthMiddleware, inputValidator(boxValidation.purchaseBox), boxController.OpenGiftBox);

// Box NFT Confirm
router
	.route("/box/confirm-nft")
	.post(authMiddleware.userAuthMiddleware, inputValidator(boxValidation.boxConfirmNft), boxController.boxConfirmNft);

// Reserved Cards by Box Purchase
router
	.route("/box/cards/reserved")
	.get(authMiddleware.userAuthMiddleware, inputValidator(boxValidation.reservedCards), boxController.reservedCards);

router
	.route("/damageAttribute")
	.post(
		authMiddleware.userAuthMiddleware,
		inputValidator(userValidation.damageAttribute),
		userController.damageAttribute,
	);

module.exports = router;
