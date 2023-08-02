module.exports = {
	//************************* GAME CENTER ERRORS *************************
	MOBILE_FORMAT: {
		MESSAGE: "The entered mobile number is incorrect",
		CODE: 1000,
	},
	EMAIL_AND_PASSWORD_INCORRECT: {
		MESSAGE: "Email or Password is incorrect",
		CODE: 400,
	},
	MOBILE_AND_PASSWORD_INCORRECT: {
		MESSAGE: "Mobile or Password is incorrect",
		CODE: 1002,
	},
	MOBILE_CONFLICT: {
		MESSAGE: "The entered mobile number is already registered in the system",
		CODE: 1003,
	},
	EMAIL_CONFLICT: {
		MESSAGE: "The entered email address is already registered in the system",
		CODE: 1004,
	},
	USER_NOT_FOUND: {
		MESSAGE: "There is no user with the details entered in the system",
		CODE: 1005,
	},
	USER_NOT_FOUND_TOKEN: {
		MESSAGE: "The token sent is incorrect",
		CODE: 1006,
	},
	USER_PASSWORD_UPDATE: {
		MESSAGE: "Password update operation failed",
		CODE: 1007,
	},
	USER_PASSWORD_INCORRECT: {
		MESSAGE: "The password sent is incorrect",
		CODE: 1008,
	},
	UPDATE_FILED: {
		MESSAGE: "Update operation failed",
		CODE: 1009,
	},
	UNAUTHORIZED: {
		MESSAGE: "You're not authorized to access this resource",
		CODE: 1010,
	},
	ASSET_NETWORK_NOT_FOUND: {
		MESSAGE: "Asset Network not found",
		CODE: 1011,
	},
	MIN_ALLOW_WITHDRAW: {
		MESSAGE: "Minimum allowed for withdraw: ",
		CODE: 1012,
	},
	USER_WALLET_NOT_FOUND: {
		MESSAGE: "User Wallet not found",
		CODE: 1013,
	},
	REQUESTED_AMOUNT_MORE_THAN_THE_USER_BALANCE: {
		MESSAGE: "The requested amount is more than the users balance",
		CODE: 1014,
	},
	TRANSACTION_FAILED: {
		MESSAGE: "An error occurred while registering the transaction",
		CODE: 1015,
	},
	ASSET_NOT_FOUND: {
		MESSAGE: "Asset not found",
		CODE: 1016,
	},
	USER_SIGN_UP: {
		MESSAGE: "An error occurred while registering",
		CODE: 1017,
	},
	USER_TOKEN_VERIFY: {
		MESSAGE: "An error occurred while validating the token",
		CODE: 1018,
	},
	USER_CREATE: {
		MESSAGE: "An error occurred while registering the user",
		CODE: 1019,
	},
	NOTIFICATION_NOT_FOUND: {
		MESSAGE: "Notification not found",
		CODE: 1028,
	},
	PAIR_NOT_FOUND: {
		MESSAGE: "Pair not found",
		CODE: 1029,
	},
	SETTING_FAILED: {
		MESSAGE: "An error occurred while registering the Setting",
		CODE: 1031,
	},
	SETTING_NOT_FOUND: {
		MESSAGE: "Setting not found",
		CODE: 1032,
	},
	TRANSACTION_ALREADY_EDITED: {
		MESSAGE: "Already edited",
		CODE: 1033,
	},
	TRANSACTION_NOT_FOUND: {
		MESSAGE: "Transaction not found",
		CODE: 1034,
	},
	WALLET_ASSET_NOT_FOUND: {
		MESSAGE: "Asset not found",
		CODE: 1035,
	},
	WALLET_NOT_FOUND: {
		MESSAGE: "Wallet not found",
		CODE: 1036,
	},
	ITEM_NETWORK_LIST_NOT_FOUND: {
		MESSAGE: "List not found",
		CODE: 1037,
	},
	USER_LOGIN: {
		MESSAGE: "An error occurred while logging in",
		CODE: 1038,
	},
	USER_FORGOT_PASSWORD: {
		MESSAGE: "An error occurred during the password forgetting operation",
		CODE: 1039,
	},
	NOT_AUTHORIZE: {
		MESSAGE: "You are not authorized to access this content",
		CODE: 1040,
	},
	ORDER_AMOUNT_IS_LOW: {
		MESSAGE: "amount is low",
		CODE: 1041,
	},
	ORDER_BAD_REQUEST_LOW_WALLET_AMOUNT: {
		MESSAGE: "low wallet amount",
		CODE: 1042,
	},
	FIAT_ACCCOUNT_NOT_FOUND: {
		MESSAGE: "Fiat account not found",
		CODE: 1043,
	},
	AMOUNT_NOT_IN_RANGE: {
		MESSAGE: "amount is not in range",
		CODE: 1046,
	},
	ADDRESS_GENERATION_FAILED: {
		MESSAGE: "An error occurred while generating the address",
		CODE: 1048,
	},
	AUCTION_FAILED: {
		MESSAGE: "An error occurred while registering the auction",
		CODE: 1051,
	},
	AUCTION_NOT_FOUND: {
		MESSAGE: "auction not found",
		CODE: 1052,
	},
	OFFER_NOT_FOUND: {
		MESSAGE: "offer not found",
		CODE: 1053,
	},
	MOBILE_AND_EMAIL_ARE_EMPTY: {
		MESSAGE: "Please enter at least one of these fields, mobile or email.",
		CODE: 1054,
	},
	ADD_FAILED: {
		MESSAGE: "An error occurred while adding!",
		CODE: 1055,
	},
	UPDATE_FAILED: {
		MESSAGE: "An error occurred while updating!",
		CODE: 1056,
	},
	DELETE_FAILED: {
		MESSAGE: "An error occurred while deleting!",
		CODE: 1057,
	},
	ITEM_NOT_FOUND: {
		MESSAGE: "Item not found!",
		CODE: 1058,
	},
	NOT_EDITABLE: {
		MESSAGE: "The item is not editable!",
		CODE: 1059,
	},
	SWAP_FAILED: {
		MESSAGE: "Swap failed!",
		CODE: 1060,
	},
	PLAYER_ID_OR_ASSET_ID_REQUIRED: {
		MESSAGE: "One of playerId and assetId is required!",
		CODE: 1061,
	},
	AUCTION_OFFER_NOT_FOUND: {
		MESSAGE: "Auction offer not found!",
		CODE: 1062,
	},
	COMPETITION_NOT_FOUND: {
		MESSAGE: "Competition not found!",
		CODE: 1063,
	},
	COMPETITION_LEAGUE_NOT_FOUND: {
		MESSAGE: "Competition league not found!",
		CODE: 1064,
	},
	PRIZE_NOT_FOUND: {
		MESSAGE: "Prize not found!",
		CODE: 1065,
	},
	PRIZE_POOL_NOT_FOUND: {
		MESSAGE: "Prize pool not found!",
		CODE: 1066,
	},
	AUCTION_OFFER_EXIST: {
		MESSAGE: "One or more auction offer exist!",
		CODE: 1067,
	},
	LANGUAGE_NOT_FOUND: {
		MESSAGE: "Language not found!",
		CODE: 1068,
	},
	LANGUAGE_FAILED: {
		MESSAGE: "Language creation failed!",
		CODE: 1069,
	},
	CARD_LENGTH: {
		MESSAGE: "Cards must contain at least 5 items",
		CODE: 1070,
	},
	POSITION_WRONG: {
		MESSAGE: "Cards position is wrong!",
		CODE: 1071,
	},
	WALLET_LOW: {
		MESSAGE: "Wallet is low!",
		CODE: 1072,
	},
	WALLET_WITHDRAW_ERROR: {
		MESSAGE: "Invalid Request : ",
		CODE: 1073,
	},
	WALLET_ASSET_NETWORK_NOT_FOUND: {
		MESSAGE: "Asset network not found",
		CODE: 1074,
	},
	WALLET_USER_TRANSACTION_NOT_FOUND: {
		MESSAGE: "User transaction not found",
		CODE: 1075,
	},
	DEPARTMENT_NOT_FOUND: {
		MESSAGE: "Department not found.",
		CODE: 1101,
	},
	TICKET_NOT_FOUND: {
		MESSAGE: "Ticket not found.",
		CODE: 1102,
	},
	REPLY_NOT_FOUND: {
		MESSAGE: "Reply not found.",
		CODE: 1103,
	},
	TICKET_IS_CLOSE: {
		MESSAGE: "This ticket is currently closed!",
		CODE: 1115,
	},
	RECAPTCHA_VERIFICATION_FAILED: {
		MESSAGE: "Failed captcha verification",
		CODE: 1125,
	},
	USER_BLOCK: {
		MESSAGE: "You are not allowed to enter",
		CODE: 1126,
	},
	USER_INACTIVE: {
		MESSAGE: "Your account is Inactive",
		CODE: 1127,
	},
	CARDXP_NOT_FOUND: {
		MESSAGE: "card xp not found",
		CODE: 1128,
	},
	VALID_GMAIL_FORMAT: {
		MESSAGE: "Just Gmail extension emails supported",
		CODE: 1129,
	},
	INTERNAL_ERROR: {
		MESSAGE: "Internal Error",
		CODE: 1130,
	},
	INSUFFICIENT_INVENTORY: {
		MESSAGE: "Your wallet balance is insufficient",
		CODE: 1131,
	},
	//************************* FC ERRORS *************************
	FC_COMPETITION_CREATION_FAILED: {
		MESSAGE: "An error occurred while creating the competitions",
		CODE: 2001,
	},
	FC_COMPETITION_NOT_FOUND: {
		MESSAGE: "Competitions not found",
		CODE: 2002,
	},
	FC_COUNTRY_CREATION_FAILED: {
		MESSAGE: "An error occurred while creating the country",
		CODE: 2003,
	},
	FC_COUNTRY_NOT_FOUND: {
		MESSAGE: "Country not found",
		CODE: 2004,
	},
	FC_MATCH_CREATION_FAILED: {
		MESSAGE: "An error occurred while creating the match",
		CODE: 2005,
	},
	FC_MATCH_NOT_FOUND: {
		MESSAGE: "Match not found",
		CODE: 2006,
	},
	FC_PLAYER_CREATION_FAILED: {
		MESSAGE: "An error occurred while creating the player",
		CODE: 2007,
	},
	FC_PLAYER_NOT_FOUND: {
		MESSAGE: "Player not found",
		CODE: 2008,
	},
	FC_TEAM_CREATION_FAILED: {
		MESSAGE: "An error occurred while creating the team",
		CODE: 2009,
	},
	FC_TEAM_NOT_FOUND: {
		MESSAGE: "Team not found",
		CODE: 2010,
	},
	INVALID_GATEWAY: {
		MESSAGE: "Selected gateway is not valid",
		CODE: 2011,
	},
	PLAN_NOT_FOUND: {
		MESSAGE: "Plan not found",
		CODE: 2012,
	},
	DUPLICATE_WALLET: {
		MESSAGE: "Duplicate wallet",
		CODE: 2014,
	},
	WALLET_LOWER_THAN_PLAN_PRICE: {
		MESSAGE: "You wallet amount is lower than desired plan. Please charge your wallet first.",
		CODE: 2016,
	},
	DUPLICATE_SIGNAL: {
		MESSAGE: "Duplicate signal",
		CODE: 2018,
	},
	SIGNAL_NOT_FOUND: {
		MESSAGE: "There is no signal with given id",
		CODE: 2019,
	},
	SIGNAL_UPDATE_FAILED: {
		MESSAGE: "There was an error while updating signal",
		CODE: 2020,
	},
	SUBSCRIPTION_NEEDED: {
		MESSAGE: "You need to get a Subscription plan to access this resource",
		CODE: 2021,
	},
	PLAN_DUPLICATE: {
		MESSAGE: "Duplicate plan",
		CODE: 2022,
	},
	PLAN_NO_USER_CUSTOM_SUBSCRIPTION: {
		MESSAGE: "Please specify an user for custom subscription",
		CODE: 2023,
	},
	PLAN_CREATE_FAILED: {
		MESSAGE: "There was an error while creating plan",
		CODE: 2024,
	},
	PLAN_UPDATE_FAILED: {
		MESSAGE: "There was an error while updating plan",
		CODE: 2025,
	},
	// Card Type
	CARD_TYPE_CREATE_FAILED: {
		MESSAGE: "There was an error while creating card type",
		CODE: 2026,
	},
	CARD_TYPE_UPDATE_FAILED: {
		MESSAGE: "There was an error while updating card type",
		CODE: 2027,
	},
	CARD_TYPE_DELETE_FAILED: {
		MESSAGE: "There was an error while updating card type",
		CODE: 2028,
	},
	CARD_TYPE_NOT_FOUND: {
		MESSAGE: "Card type not found",
		CODE: 2029,
	},
	CARD_TYPE_DUPLICATE: {
		MESSAGE: "Duplicate Card type",
		CODE: 2030,
	},
	CARD_IMAGE_NULL: {
		MESSAGE: "Please upload card image",
		CODE: 2031,
	},
	// Card
	CARD_DUPLICATE: {
		MESSAGE: "Duplicate card",
		CODE: 2032,
	},
	CARD_NOT_FOUND: {
		MESSAGE: "Card not found",
		CODE: 2033,
	},
	CARD_CANNOT_DELETE: {
		MESSAGE: "There are already some assigned tokens assotiated with this card.",
		CODE: 2034,
	},
	// Order
	ORDER_NOT_FOUND: {
		MESSAGE: "Order not found",
		CODE: 2035,
	},

	// User Login/Register/Edit Profile
	EMAIL_ALREADY_EXIST: {
		MESSAGE: "There is another account associated with this email",
		CODE: 2036,
	},
	EMPTY_ADDRESS: {
		MESSAGE: "Please send an address.",
		CODE: 2037,
	},
	ALGOTREX_PLAN_NOT_FOUND: {
		MESSAGE: "AlgoTrex plan not found",
		CODE: 2038,
	},
	AlGOTREX_FAILED: {
		MESSAGE: "An error occurred while registering the AlgoTrex Plan",
		CODE: 2039,
	},
	ALGOTREX_WALLET_AMOUNT_ERROR: {
		MESSAGE: "Your algotrex wallet has insufficient amount.",
		CODE: 2040,
	},
	AUCTION_DUPLICATE: {
		MESSAGE: "There is already an auction on this card. Please Edit that one.",
		CODE: 2041,
	},
	AUCTION_NO_TOKENS_FOUND: {
		MESSAGE: "There is no enough token to be assigned.",
		CODE: 2042,
	},
	AUCTION_UPDATE_FAILED_OFFER_EXIST: {
		MESSAGE: "There is already offers on this auction.",
		CODE: 2043,
	},
	AUCTION_INITIAL_NUMBER_REACHED: {
		MESSAGE: "The number of assigned tokens reached it's limit",
		CODE: 2044,
	},
	AUCTION_OFFER_ALREADY_HAVE_TYPE: {
		MESSAGE: "You already have a camera with this type",
		CODE: 2045,
	},
	AUCTION_TOKEN_NOT_FOUND: {
		MESSAGE: "There is no token assosiated with current auction",
		CODE: 2046,
	},
	COUNTRY_NOT_FOUND: {
		MESSAGE: "Country not found",
		CODE: 2047,
	},
	AUCTION_ASSIGNED_CARD_NOT_FOUND: {
		MESSAGE: "There is no assigned token assosiated with current auction",
		CODE: 2048,
	},
	LIMIT_MAX_TASK: {
		MESSAGE: "limit max tasks",
		CODE: 2050,
	},
	TOKEN_HAS_EXPIRED: {
		MESSAGE: "The token has expired",
		CODE: 2049,
	},
	LIMIT_MAX_SIGNALS: {
		MESSAGE: "Limit the maximum number of signals",
		CODE: 2050,
	},
	SUBSCRIBE_NOT_FOUND: {
		MESSAGE: "Subscribe not found",
		CODE: 2052,
	},
	SUBSCRIBE_FAILED: {
		MESSAGE: "An error occurred while registering the subscribe",
		CODE: 2053,
	},
	DUPLICATE_SUBSCRIBE: {
		MESSAGE: "Duplicate subscribe",
		CODE: 2054,
	},
	DUPLICATE_DATA: {
		MESSAGE: "Duplicate data",
		CODE: 2055,
	},
	CANNOT_JOIN_COMPETITION: {
		MESSAGE: "You don't have required ticket to participate",
		CODE: 2056,
	},
	WRONG_PASSOWORD: {
		MESSAGE: "Wrong Passowrd",
		CODE: 2057,
	},
	DELETE_ACCOUNT_FAILED: {
		MESSAGE: "There was an error while removing your account",
		CODE: 2058,
	},
	BATTERY_IS_LOW: {
		MESSAGE: "The Dopamine is low to participate in this competition",
		CODE: 2059,
	},
	NEGATIVE_IS_LOW: {
		MESSAGE: "The SEROTONIN is low to participate in this competition",
		CODE: 2060,
	},
	DAMAGE_IS_LOW: {
		MESSAGE: "The damage is low to participate in this competition",
		CODE: 2061,
	},
	CARD_TYPE_IMAGE_NOT_FOUND: {
		MESSAGE: "There is no image associated with current card type.",
		CODE: 2059,
	},
	NFT_RELATED_TO_CARD_TYPE_NOT_FOUND: {
		MESSAGE: "You don't have a nft related to current card type.",
		CODE: 2060,
	},
	BOX_ASSIGNED_CARD_NOT_FOUND: {
		MESSAGE: "There is no assigned token assosiated with current box",
		CODE: 2061,
	},
	BOX_SETTING_NOT_FOUND_CRRENT_CARD_TYPE: {
		MESSAGE: "There is no box settings assosiated with current card type and attribute. Please add some.",
		CODE: 2062,
	},
	BOX_ALREADY_HAS_BEEN_TRADED: {
		MESSAGE: "This Box already has been traded and cannot be modified.",
		CODE: 2063,
	},
	REFERRED_USER_NOT_FOUND: {
		MESSAGE: "There is no user with current referred code.",
		CODE: 2061,
	},
	MAX_ALLOW_WITHDRAW_PER_DAY: {
		MESSAGE: "Maximum allowed withdraw per day is: ",
		CODE: 2062,
	},
	MANAGER_LOG_NOT_FOUND: {
		MESSAGE: "Manager log not found",
		CODE: 404,
	},
	HOLDING_NOT_FOUND: {
		MESSAGE: "Holding not found",
		CODE: 404,
	},
	DUPLICATE_HOLDING: {
		MESSAGE: "Duplicate holding",
		CODE: 409,
	},
	LINK_NOT_FOUND: {
		MESSAGE: "link not found",
		CODE: 410,
	},
	LINK_UPDATE_FAILED: {
		MESSAGE: "There was an error while updating link",
		CODE: 411,
	},
	DUPLICATE_LINK: {
		MESSAGE: "Duplicate link",
		CODE: 412,
	},
};
