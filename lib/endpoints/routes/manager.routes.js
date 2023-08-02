const router = require("express").Router();
const {
	managerController,
	auctionController,
	transactionController,
	userController,
	languageController,
	cardController,
	managerLogController,
	competitionController,
	prizeController,
	tokenPrizeController,
	assetNetworkController,
	networkController,
	ticketController,
	departmentController,
	assetController,
	cardTypeController,
	tokenController,
	walletController,
	boxController,
	attributeController,
} = require("./../controllers");
const {
	managerValidation,
	swapValidation,
	auctionValidation,
	transactionValidation,
	userValidation,
	languageValidation,
	cardValidation,
	managerLogValidation,
	competitionValidation,
	prizeValidation,
	assetNetworkValidation,
	networkValidation,
	ticketValidation,
	departmentValidation,
	assetValidation,
	cardTypeValidation,
	tokenValidation,
	walletValidation,
	roleValidation,
	attributeValidation,
	boxValidation,
} = require("./../validations");
const { authMiddleware, inputValidator } = require("./../../middlewares");
const {
	avatarUpload,
	languageUpload,
	ticketUpload,
	cardTypeUpload,
	attributeUpload,
} = require("../../middlewares/s3Uploader");

const { permissionMiddleware } = require("../../middlewares/permissionMiddleware");
const { managerLog } = require("../../middlewares/managerLog");
const { assign_to_users, decrease_competition_reward } = require("../controllers/auction.controller");
const { swapController } = require("../controllers");

router.route("/").get(authMiddleware.managerAuthMiddleware, managerController.info);

router.get("/seeder", authMiddleware.managerAuthMiddleware, (req, res) => {
	require("./../../databases/postgres/migration/card.migration").createCard;
});

//get list admins

router.route("/manager").get(authMiddleware.managerAuthMiddleware, managerController.getManagers);

router.route("/login").post(inputValidator(managerValidation.login), managerController.login);
router
	.route("/login_checkcode")
	.post(inputValidator(managerValidation.checkManagerLoginCode), managerController.checkManagerLoginCode);

router.route("/logout").get(authMiddleware.managerAuthMiddleware, managerController.logout);

router
	.route("/password")
	.post(
		//	rateLimit.rateLimitMiddleware,
		inputValidator(managerValidation.forgetPassword),
		managerController.forgetPassword,
	)
	.patch(inputValidator(managerValidation.resetPassword), managerController.resetPassword);

router.route("/verify").post(inputValidator(managerValidation.verify), managerController.verify);

router.route("/refresh-token").get(authMiddleware.managerAuthRefreshMiddleware, managerController.refreshToken);

router
	.route("/auction")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("auction read"),
		inputValidator(auctionValidation.getAuctions),
		managerLog("auction read"),
		auctionController.getAuctions,
	)
	.post(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("auction create"),
		inputValidator(auctionValidation.addAuctionManager),
		managerLog("auction create"),
		auctionController.addAuctionManager,
	)
	.put(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("auction update"),
		inputValidator(auctionValidation.editAuction),
		managerLog("auction update"),
		auctionController.editAuctionManager,
	);
router
	.route("/auction/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("auction read"),
		inputValidator(auctionValidation.getAuction),
		managerLog("auction read"),
		auctionController.getAuction,
	)
	.delete(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("auction delete"),
		inputValidator(auctionValidation.deleteAuction),
		managerLog("auction delete"),
		auctionController.delAuctionManager,
	);

router
	.route("/auction-trades")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("auctionTrade read"),
		inputValidator(auctionValidation.getAuctionTradesManager),
		managerLog("auctionTrade read"),
		auctionController.getAuctionTradesManager,
	);
router
	.route("/auction-trades/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("auctionTrade read"),
		inputValidator(auctionValidation.getAuctionTradeManager),
		managerLog("auctionTrade read"),
		auctionController.getAuctionTradeManager,
	);

///////////////////////////////// User CRUD /////////////////////////////////////////////////
router
	.route("/users")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("user read"),
		inputValidator(userValidation.getUsers),
		managerLog("user read"),
		userController.getUsers,
	)
	.post(
		authMiddleware.managerAuthMiddleware,
		avatarUpload.fields([{ name: "avatar", maxCount: 1 }]),
		permissionMiddleware("user create"),
		inputValidator(userValidation.addUsers),
		managerLog("user create"),
		userController.addUsers,
	)
	.put(
		authMiddleware.managerAuthMiddleware,
		avatarUpload.fields([{ name: "avatar", maxCount: 1 }]),
		permissionMiddleware("user update"),
		inputValidator(userValidation.editUsers),
		managerLog("user update"),
		userController.editUsers,
	);

router
	.route("/users/selector")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("user read"),
		inputValidator(userValidation.getSelector),
		managerLog("user read"),
		userController.getUsersSelector,
	);

router
	.route("/users/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("user read"),
		inputValidator(userValidation.findUserById),
		managerLog("user read"),
		userController.findUserById,
	)
	.delete(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("user delete"),
		inputValidator(userValidation.findUserById),
		managerLog("user delete"),
		userController.deleteUsers,
	);

///////////////////////////////// Setting CRUD /////////////////////////////////////////////////
router
	.route("/setting")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("setting read"),
		inputValidator(managerValidation.getSettings),
		managerLog("setting read"),
		managerController.getSettings,
	)
	.post(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("setting create"),
		inputValidator(managerValidation.addSetting),
		managerLog("setting create"),
		managerController.addSetting,
	)
	.put(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("setting update"),
		inputValidator(managerValidation.editSetting),
		managerLog("setting update"),
		managerController.editSetting,
	);

router
	.route("/setting/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("setting read"),
		inputValidator(managerValidation.findSettingById),
		managerLog("setting read"),
		managerController.findSettingById,
	)
	.delete(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("setting delete"),
		inputValidator(managerValidation.findSettingById),
		managerLog("setting delete"),
		managerController.deleteSetting,
	);
///////////////////////////////// Wallet RU /////////////////////////////////////////////////
router
	.route("/wallet")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("wallet read"),
		inputValidator(managerValidation.getWallets),
		managerLog("wallet read"),
		managerController.getWallets,
	);

router
	.route("/wallet/total")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("transaction update"),
		inputValidator(managerValidation.getTotalWallets),
		managerLog("transaction update"),
		managerController.getTotalWallets,
	);

router
	.route("/wallet/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("wallet read"),
		inputValidator(managerValidation.findWalletById),
		managerLog("wallet read"),
		managerController.findWalletById,
	);

///////////////////////////////// Transaction CRUD /////////////////////////////////////////////////
router
	.route("/transactions")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("transaction read"),
		inputValidator(transactionValidation.get),
		managerLog("transaction read"),
		transactionController.get,
	)
	.put(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("transaction update"),
		inputValidator(transactionValidation.edit),
		managerLog("transaction update"),
		transactionController.edit,
	);
router
	.route("/transactions/finantial-report")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("transaction read"),
		inputValidator(transactionValidation.getFinantialReport),
		managerLog("transaction read"),
		transactionController.getFinantialReport,
	);
router
	.route("/transactions/:id(\\d+)")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("transaction read"),
		inputValidator(transactionValidation.getById),
		managerLog("transaction read"),
		transactionController.getById,
	);

router
	.route("/transactions/balances")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("transaction read"),
		managerLog("transaction read"),
		transactionController.getBalances,
	);

router
	.route("/language")
	.post(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("language create"),
		languageUpload.fields([{ name: "flag", maxCount: 1 }]),
		inputValidator(languageValidation.addLanguage),
		managerLog("language create"),
		languageController.addLanguage,
	)
	.put(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("language update"),
		languageUpload.fields([{ name: "flag", maxCount: 1 }]),
		inputValidator(languageValidation.editLanguage),
		managerLog("language update"),
		languageController.editLangauge,
	)
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("language read"),
		inputValidator(languageValidation.getLanguages),
		managerLog("language read"),
		languageController.getAllLanguages,
	);

router
	.route("/language/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("language read"),
		inputValidator(languageValidation.findLanguageById),
		managerLog("language read"),
		languageController.getLanguageById,
	)
	.delete(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("language delete"),
		inputValidator(languageValidation.findLanguageById),
		managerLog("language delete"),
		languageController.deleteLanguage,
	);

///////////////////////////////// Card CRUD /////////////////////////////////////////////////
router
	.route("/card")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card read"),
		inputValidator(cardValidation.getCards),
		managerLog("card read"),
		cardController.getCards,
	)
	.put(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card update"),
		inputValidator(cardValidation.editCard),
		managerLog("card update"),
		cardController.editCard,
	);
router
	.route("/card/selector")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card read"),
		inputValidator(cardValidation.cardSelector),
		managerLog("card read"),
		cardController.cardSelector,
	);
router
	.route("/card/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card read"),
		inputValidator(cardValidation.getCard),
		managerLog("card read"),
		cardController.getCard,
	)
	.delete(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card delete"),
		inputValidator(cardValidation.deleteCard),
		managerLog("card delete"),
		cardController.deleteCard,
	);

///////////////////////////////// Manager Log CRUD /////////////////////////////////////////////////
router
	.route("/manager-log")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("transaction update"),
		inputValidator(managerLogValidation.getManagerLogs),
		managerLog("transaction update"),
		managerLogController.getManagerLogs,
	);

router
	.route("/manager-log/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("transaction update"),
		inputValidator(managerLogValidation.getManagerLogById),
		managerLog("transaction update"),
		managerLogController.getManagerLogById,
	);

router
	.route("/assigned-card")
	.post(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card create"),
		inputValidator(cardValidation.createAssignedCard),
		managerLog("card create"),
		cardController.createAssignedCard,
	)
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card read"),
		inputValidator(cardValidation.getAssignedCard),
		managerLog("card read"),
		cardController.getAssignedCard,
	);

///////////////////////////////// SWAP CRUD /////////////////////////////////////////////////
router
	.route("/swaps")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("transaction read"),
		inputValidator(transactionValidation.getSwaps),
		managerLog("transaction read"),
		transactionController.getSwaps,
	);

router
	.route("/user/attributes/:userId")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("user read"),
		inputValidator(userValidation.UserAttribute),
		managerLog("user read"),
		userController.getAttributes,
	);

router
	.route("/user/attributes/:attributeId")
	.post(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("user update"),
		inputValidator(userValidation.EditUserAttribute),
		managerLog("user update"),
		userController.editAttribute,
	);

///////////////////////////////// Prize /////////////////////////////////////////////////

router
	.route("/prize")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("prize read"),
		inputValidator(prizeValidation.getPrizes),
		managerLog("prize read"),
		prizeController.getPrizes,
	)
	.post(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("prize create"),
		inputValidator(prizeValidation.addPrize),
		managerLog("prize create"),
		prizeController.addPrize,
	);

router
	.route("/prize/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("prize read"),
		inputValidator(prizeValidation.getPrize),
		managerLog("prize read"),
		prizeController.getPrize,
	)
	.put(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("prize update"),
		inputValidator(prizeValidation.editPrize),
		managerLog("prize update"),
		prizeController.editPrize,
	)
	.delete(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("prize delete"),
		inputValidator(prizeValidation.delPrize),
		managerLog("prize delete"),
		prizeController.delPrize,
	);

router
	.route("/prize-user/")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("prizeUser read"),
		inputValidator(prizeValidation.getUserPrizeManager),
		managerLog("prizeUser read"),
		prizeController.getUserPrizeManager,
	);
////////////////////////////////// Token Prize //////////////////////////////////
router
	.route("/token-prize")
	.get(
		authMiddleware.managerAuthMiddleware,
		inputValidator(prizeValidation.getTokenPrizes),
		tokenPrizeController.getTokenPrizes,
	)
	.post(
		authMiddleware.managerAuthMiddleware,
		inputValidator(prizeValidation.addTokenPrize),
		tokenPrizeController.addTokenPrize,
	);

router
	.route("/token-prize/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		inputValidator(prizeValidation.getTokenPrize),
		tokenPrizeController.getTokenPrize,
	)
	.put(
		authMiddleware.managerAuthMiddleware,
		inputValidator(prizeValidation.editTokenPrize),
		tokenPrizeController.editTokenPrize,
	)
	.delete(
		authMiddleware.managerAuthMiddleware,
		inputValidator(prizeValidation.getTokenPrize),
		tokenPrizeController.delTokenPrize,
	);

router
	.route("/assetNetwork")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("assetNetwork read"),
		inputValidator(assetNetworkValidation.assetNetwork),
		managerLog("assetNetwork read"),
		assetNetworkController.assetNetwork,
	)
	.post(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("assetNetwork create"),
		inputValidator(assetNetworkValidation.addAssetNetwork),
		managerLog("assetNetwork create"),
		assetNetworkController.addAssetNetwork,
	)
	.put(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("assetNetwork update"),
		inputValidator(assetNetworkValidation.editAssetNetwork),
		managerLog("assetNetwork update"),
		assetNetworkController.editAssetNetwork,
	);

router
	.route("/assetNetwork/selector")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("assetNetwork read"),
		inputValidator(assetNetworkValidation.assetNetworkSelector),
		managerLog("assetNetwork read"),
		assetNetworkController.assetNetworkSelector,
	);

router
	.route("/assetNetwork/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("assetNetwork read"),
		inputValidator(assetNetworkValidation.findById),
		managerLog("assetNetwork read"),
		assetNetworkController.findById,
	)
	.delete(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("assetNetwork delete"),
		inputValidator(assetNetworkValidation.findById),
		managerLog("assetNetwork delete"),
		assetNetworkController.deleteAssetNetwork,
	);

router
	.route("/network")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("network read"),
		inputValidator(networkValidation.network),
		managerLog("network read"),
		networkController.network,
	);

///////////////////////////////// CHARTS /////////////////////////////////////////////////

router
	.route("/chart/user")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("user chart"),
		managerLog("user chart"),
		managerController.UserChart,
	);

router
	.route("/chart/auction-trade")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("trade chart"),
		managerLog("trade chart"),
		managerController.AuctionTradesChart,
	);

///////////////////////////////// NOTIFICATIONS /////////////////////////////////////////////////

router
	.route("/notifications")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("notification read"),
		managerLog("notification read"),
		managerController.notification,
	);

router
	.route("/notifications/:id?")
	.patch(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("notification update"),
		managerLog("notification update"),
		managerController.notificationStatus,
	);

router
	.route("/push-notification/send")
	.post(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("notification update"),
		inputValidator(managerValidation.sendPushNotification),
		managerLog("notification update"),
		managerController.sendPushNotification,
	);

////////// ticket ////////
router
	.route("/ticket")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("ticket read"),
		inputValidator(ticketValidation.managerGetTickets),
		managerLog("ticket read"),
		ticketController.managerGetTickets,
	)
	.post(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("ticket create"),
		inputValidator(ticketValidation.managerAddTicket),
		ticketUpload.fields([{ name: "files", maxCount: 5 }]),
		managerLog("ticket create"),
		ticketController.managerAddTicket,
	)
	.put(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("ticket update"),
		ticketUpload.fields([{ name: "files", maxCount: 5 }]),
		inputValidator(ticketValidation.managerEditTicket),
		managerLog("ticket update"),
		ticketController.managerEditTicket,
	);

//single

router
	.route("/ticket/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("ticket read"),
		inputValidator(ticketValidation.managerGetTicket),
		managerLog("ticket read"),
		ticketController.managerGetTicket,
	)
	.delete(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("ticket delete"),
		inputValidator(ticketValidation.managerDeleteTicket),
		managerLog("ticket delete"),
		ticketController.managerDeleteTicket,
	)
	.put(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("ticket update"),
		inputValidator(ticketValidation.managerChangeTicketStatus),
		managerLog("ticket update"),
		ticketController.managerChangeTicketStatus,
	)
	.patch(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("ticket update"),
		inputValidator(ticketValidation.managerAcceptTicket),
		managerLog("ticket update"),
		ticketController.managerAcceptTicket,
	);

/////reply ticket ////

router
	.route("/reply")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("reply read"),
		inputValidator(ticketValidation.managerGetReplies),
		managerLog("reply read"),
		ticketController.managerGetReplies,
	)
	.post(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("reply create"),
		ticketUpload.fields([{ name: "files", maxCount: 5 }]),
		inputValidator(ticketValidation.managerAddReply),
		managerLog("reply create"),
		ticketController.managerAddReply,
	)
	.put(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("reply update"),
		ticketUpload.fields([{ name: "files", maxCount: 5 }]),
		inputValidator(ticketValidation.managerEditReply),
		managerLog("reply update"),
		ticketController.managerEditReply,
	);

////single

router
	.route("/reply/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("reply read"),
		inputValidator(ticketValidation.managerGetReply),
		managerLog("reply read"),
		ticketController.managerGetReply,
	)
	.delete(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("reply delete"),
		inputValidator(ticketValidation.managerDeleteReply),
		managerLog("reply delete"),
		ticketController.managerDeleteReply,
	);

////////Department//////////////////

router
	.route("/department")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("department update"),
		inputValidator(departmentValidation.getDepartments),
		managerLog("department update"),
		departmentController.getDepartments,
	)
	.post(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("department update"),
		inputValidator(departmentValidation.addDepartment),
		managerLog("department update"),
		departmentController.addDepartment,
	)
	.put(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("department update"),
		inputValidator(departmentValidation.editDepartment),
		managerLog("department update"),
		departmentController.editDepartment,
	);

//selctor
router
	.route("/department/selector")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("department update"),
		inputValidator(departmentValidation.departmentSelector),
		managerLog("department update"),
		departmentController.departmentSelector,
	);

//single

router
	.route("/department/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("department update"),
		inputValidator(departmentValidation.getDepartment),
		managerLog("department update"),
		departmentController.getDepartment,
	)
	.delete(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("department update"),
		inputValidator(departmentValidation.deleteDepartment),
		managerLog("department update"),
		departmentController.deleteDepartment,
	);

///// asset /////////

router
	.route("/asset")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("asset read"),
		managerLog("asset read"),
		assetController.getAssets,
	);

router
	.route("/asset/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("asset read"),
		inputValidator(assetValidation.getAssetSingle),
		managerLog("asset read"),
		assetController.getAssetSingle,
	);

router
	.route("/asset/create-users-wallet")
	.post(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("asset read"),
		inputValidator(assetValidation.createUsersWallet),
		managerLog("asset read"),
		assetController.createUsersWallet,
	);

// Card Type
router
	.route("/card-type")
	.post(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card create"),
		cardTypeUpload.fields([
			{ name: "image", maxCount: 1 },
			{ name: "calculator_image", maxCount: 1 },
		]),
		inputValidator(cardTypeValidation.addCardType),
		managerLog("card create"),
		cardTypeController.addCardType,
	)
	.put(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card update"),
		cardTypeUpload.fields([
			{ name: "image", maxCount: 1 },
			{ name: "calculator_image", maxCount: 1 },
		]),
		inputValidator(cardTypeValidation.editCardType),
		managerLog("card update"),
		cardTypeController.editCardType,
	)
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card read"),
		inputValidator(cardTypeValidation.getCardTypesByManager),
		managerLog("card read"),
		cardTypeController.getCardTypesByManager,
	);

router
	.route("/card-type/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card read"),
		inputValidator(cardTypeValidation.getCardTypeByManager),
		managerLog("card read"),
		cardTypeController.getCardTypeByManager,
	)
	.delete(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card delete"),
		inputValidator(cardTypeValidation.deleteCardType),
		managerLog("card delete"),
		cardTypeController.deleteCardType,
	);

// Tokens
router
	.route("/tokens")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("token read"),
		inputValidator(tokenValidation.getTokensByManager),
		managerLog("token read"),
		tokenController.getTokensByManager,
	);

router
	.route("/tokens/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("token read"),
		inputValidator(tokenValidation.getTokenByManager),
		managerLog("token read"),
		tokenController.getTokenByManager,
	);

router
	.route("/statistic/cards")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("cardsStatistics read"),
		managerLog("cardsStatistics read"),
		cardController.cardStatistic,
	);

// System Wallets
router
	.route("/system/wallets")
	.put(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("systemWallet update"),
		inputValidator(walletValidation.editSystemWallet),
		managerLog("systemWallet update"),
		walletController.editSystemWallet,
	)
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("systemWallet read"),
		inputValidator(walletValidation.getSystemWallets),
		managerLog("systemWallet read"),
		walletController.getSystemWallets,
	);
router
	.route("/system/wallets/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("systemWallet read"),
		inputValidator(walletValidation.getSystemWallet),
		managerLog("systemWallet read"),
		walletController.getSystemWallet,
	);

// Create Permissions
router.route("/permission/bulkCreate").get(managerController.bulk);

// Role
router
	.route("/role")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("role read"),
		inputValidator(roleValidation.getRoles),
		managerLog("role read"),
		managerController.getRoles,
	)
	.post(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("role create"),
		inputValidator(roleValidation.addRole),
		managerLog("role create"),
		managerController.createRole,
	)
	.put(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("role update"),
		inputValidator(roleValidation.editRole),
		managerLog("role update"),
		managerController.updateRole,
	);

router
	.route("/role/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("role read"),
		inputValidator(roleValidation.findRoleById),
		managerLog("role read"),
		managerController.findRoleById,
	)
	.delete(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("role delete"),
		inputValidator(roleValidation.findRoleById),
		managerLog("role delete"),
		managerController.deleteRole,
	);

// Managers
router
	.route("/list")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("manager read"),
		inputValidator(managerValidation.getManagers),
		managerLog("manager read"),
		managerController.getManagers,
	)
	.post(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("manager create"),
		avatarUpload.fields([{ name: "avatar", maxCount: 1 }]),
		inputValidator(managerValidation.addManagers),
		managerLog("manager create"),
		managerController.addManagers,
	)
	.put(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("manager update"),
		avatarUpload.fields([{ name: "avatar", maxCount: 1 }]),
		inputValidator(managerValidation.editManagers),
		managerLog("manager update"),
		managerController.editManagers,
	);

router
	.route("/list/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("manager read"),
		inputValidator(managerValidation.findManagerById),
		managerLog("manager read"),
		managerController.findManagerById,
	)
	.delete(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("manager delete"),
		inputValidator(managerValidation.findManagerById),
		managerLog("manager delete"),
		managerController.deleteManagers,
	);

// Permissions
router
	.route("/permission")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("permission read"),
		inputValidator(managerValidation.getAllPermissions),
		managerLog("permission read"),
		managerController.getAllPermissions,
	);

// Attributes
router
	.route("/attributes")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card read"),
		inputValidator(attributeValidation.getAttributesByManager),
		managerLog("card read"),
		attributeController.getAttributesByManager,
	)
	.post(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card create"),
		attributeUpload.fields([{ name: "icon", maxCount: 1 }]),
		inputValidator(attributeValidation.addAttribute),
		managerLog("card create"),
		attributeController.createAttribute,
	)
	.put(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card update"),
		attributeUpload.fields([{ name: "icon", maxCount: 1 }]),
		inputValidator(attributeValidation.editAttribute),
		managerLog("card update"),
		attributeController.editAttribute,
	);

router
	.route("/attributes/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card read"),
		inputValidator(attributeValidation.getAttributeByManager),
		managerLog("card read"),
		attributeController.getAttributeByManager,
	);
// .delete(
// 	authMiddleware.managerAuthMiddleware,
// 	permissionMiddleware("card delete"),
// 	inputValidator(attributeValidation.deleteAttribute),
// 	attributeController.deleteAttribute,
// );

router
	.route("/user-attributes")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card read"),
		inputValidator(attributeValidation.getUserAttributesByManager),
		managerLog("card read"),
		attributeController.getUserAttributesByManager,
	);

router
	.route("/user-attributes/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card read"),
		inputValidator(attributeValidation.getUserAttributeByManager),
		managerLog("card read"),
		attributeController.getUserAttributeByManager,
	);

// Boxes
router
	.route("/box")
	.post(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card create"),
		inputValidator(boxValidation.addBox),
		managerLog("card create"),
		boxController.addBox,
	)
	.put(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card update"),
		inputValidator(boxValidation.editBox),
		managerLog("card update"),
		boxController.editBox,
	)
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card read"),
		inputValidator(boxValidation.getBoxesByManager),
		managerLog("card read"),
		boxController.getBoxesByManager,
	);

router
	.route("/box/:id")
	.delete(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card delete"),
		inputValidator(boxValidation.deleteBox),
		managerLog("card delete"),
		boxController.deleteBox,
	)
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card read"),
		inputValidator(boxValidation.getBoxByManager),
		managerLog("card read"),
		boxController.getBoxByManager,
	);

// Box Auction
router
	.route("/box-auction")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card read"),
		inputValidator(boxValidation.getBoxAuctionsByManager),
		managerLog("card read"),
		boxController.getBoxAuctionsByManager,
	);

router
	.route("/box-auction/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card read"),
		inputValidator(boxValidation.getBoxAuctionByManager),
		managerLog("card read"),
		boxController.getBoxAuctionByManager,
	);

// Box Setting
router
	.route("/box-settings")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card read"),
		inputValidator(boxValidation.getBoxSettingsByManager),
		managerLog("card read"),
		boxController.getBoxSettingsByManager,
	)
	.post(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card create"),
		inputValidator(boxValidation.addBoxSetting),
		managerLog("card create"),
		boxController.addBoxSetting,
	)
	.put(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card update"),
		inputValidator(boxValidation.editBoxSetting),
		managerLog("card update"),
		boxController.editBoxSetting,
	);

router
	.route("/box-settings/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card read"),
		inputValidator(boxValidation.getBoxSettingByManager),
		managerLog("card read"),
		boxController.getBoxSettingByManager,
	)
	.delete(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card delete"),
		inputValidator(boxValidation.deleteBoxSetting),
		managerLog("card delete"),
		boxController.deleteBoxSetting,
	);

router
	.route("/user/box")
	.post(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card create"),
		inputValidator(boxValidation.createUserBox),
		managerLog("card create"),
		boxController.createUserBoxesByManager,
	)
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card read"),
		inputValidator(boxValidation.getUserBoxesByManager),
		managerLog("card read"),
		boxController.getUserBoxesByManager,
	);

router
	.route("/user/box/:userId")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card read"),
		inputValidator(boxValidation.getUserBoxByManager),
		managerLog("card read"),
		boxController.getUserBoxByManager,
	);

router
	.route("/box-trade")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card read"),
		inputValidator(boxValidation.getBoxTradesByManager),
		managerLog("card read"),
		boxController.getBoxTradesByManager,
	);

router
	.route("/box-trade/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("card read"),
		inputValidator(boxValidation.getBoxTradeByManager),
		managerLog("card read"),
		boxController.getBoxTradeByManager,
	);

// Reserved Cards by Box Purchase
router
	.route("/box/card/reserved")
	.get(
		authMiddleware.managerAuthMiddleware,
		inputValidator(boxValidation.reservedCardsByManager),
		boxController.reservedCardsByManager,
	);

//swap
router
	.route("/swap/:id")
	.get(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("setting update"),
		inputValidator(swapValidation.activeSwapByManager),
		managerLog("setting update"),
		swapController.activation,
	);

router
	.route("/transfer")
	.post(
		authMiddleware.managerAuthMiddleware,
		permissionMiddleware("transaction update"),
		inputValidator(managerValidation.transferValidation),
		managerLog("transaction update"),
		managerController.transfer,
	);

module.exports = router;
