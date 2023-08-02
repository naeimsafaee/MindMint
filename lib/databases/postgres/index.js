const config = require("config").get("databases.postgres");

const { Sequelize, Op, literal } = require("sequelize");

/** ===================================================================================================== **/
/**
 * Game Center Models and Database
 */

const sequelize = new Sequelize(config.database, config.username, config.password, config.options);
// const sequelize = new Sequelize(config.database, config.username, config.password, {
// 	...config.options,
// 	...{ logging: console.log },
// });

sequelize
	.authenticate()
	.then(() => {
		// console.log(`*** Syncing database...`);
	})
	.catch((e) => {
		console.log("*** POSTGRES Error: ", e);
	});

const __user = require("./models/user");
const User = sequelize.define("user", __user.attributes, __user.options);

User.sync({ alter: true })
	.then()
	.catch((err) => {});

const __userWallet = require("./models/userWallet");
const UserWallet = sequelize.define("userWallet", __userWallet.attributes, __userWallet.options);
UserWallet.sync({ alter: true })
	.then()
	.catch((err) => {});

const __userSession = require("./models/userSession");
const UserSession = sequelize.define("userSession", __userSession.attributes, __userSession.options);

UserSession.sync({ alter: true })
	.then()
	.catch((err) => {});

const __userNotification = require("./models/userNotification");
const UserNotification = sequelize.define(
	"userNotification",
	__userNotification.attributes,
	__userNotification.options,
);

const __asset = require("./models/asset");
const Asset = sequelize.define("asset", __asset.attributes, __asset.options);

const __settings = require("./models/settings");
const Settings = sequelize.define("setting", __settings.attributes, __settings.options);

const __referralReward = require("./models/referralReward");
const ReferralReward = sequelize.define("referralReward", __referralReward.attributes, __referralReward.options);

const __userTransaction = require("./models/userTransaction");
const UserTransaction = sequelize.define("userTransaction", __userTransaction.attributes, __userTransaction.options);

UserTransaction.sync({ alter: true })
	.then()
	.catch((err) => {});

const __userErrorTransaction = require("./models/userErrorTransaction");
const UserErrorTransaction = sequelize.define(
	"userErrorTransaction",
	__userErrorTransaction.attributes,
	__userErrorTransaction.options,
);

const __assetNetwork = require("./models/assetNetwork");
const AssetNetwork = sequelize.define("assetNetwork", __assetNetwork.attributes, __assetNetwork.options);

const __network = require("./models/network");
const Network = sequelize.define("network", __network.attributes, __network.options);

const __systemWallet = require("./models/systemWallet");
const SystemWallet = sequelize.define("systemWallet", __systemWallet.attributes, __systemWallet.options);

const __manager = require("./models/manager");
const Manager = sequelize.define("manager", __manager.attributes, __manager.options);
Manager.sync({ alter: true })
	.then()
	.catch((err) => {
		console.log("error", err);
	});

const __managerLog = require("./models/managerLog");
const ManagerLog = sequelize.define("managerLog", __managerLog.attributes, __managerLog.options);

const __managerSession = require("./models/managerSession");
const ManagerSession = sequelize.define("managerSession", __managerSession.attributes, __managerSession.options);

ManagerSession.sync({ alter: true })
	.then()
	.catch((err) => {});

const __auction = require("./models/auction");
const Auction = sequelize.define("auction", __auction.attributes, __auction.options);

Auction.sync({ alter: true })
	.then()
	.catch((err) => {});

const __userAuctionTrade = require("./models/userAuctionTrade");
const UserAuctionTrade = sequelize.define(
	"userAuctionTrade",
	__userAuctionTrade.attributes,
	__userAuctionTrade.options,
);

const __language = require("./models/language");
const Language = sequelize.define("language", __language.attributes, __language.options);

const __assignedCard = require("./models/assignedCard");
const AssignedCard = sequelize.define("assignedCard", __assignedCard.attributes, __assignedCard.options);

AssignedCard.sync({ alter: true })
	.then()
	.catch((err) => {});

const __managerNotification = require("./models/managerNotification");
const ManagerNotification = sequelize.define(
	"managerNotification",
	__managerNotification.attributes,
	__managerNotification.options,
);

const __swapTransaction = require("./models/swapTransaction");
const SwapTransaction = sequelize.define("swapTransactions", __swapTransaction.attributes, __swapTransaction.options);

SwapTransaction.sync({ alter: true })
	.then()
	.catch((err) => {});

const __prize = require("./models/prize");
const Prize = sequelize.define("prize", __prize.attributes, __prize.options);

Prize.sync({ alter: true })
	.then()
	.catch((err) => {});

const __matchParticipant = require("./models/matchParticipant");
const MatchParticipant = sequelize.define(
	"matchParticipant",
	__matchParticipant.attributes,
	__matchParticipant.options,
);

MatchParticipant.sync({ alter: true })
	.then()
	.catch((err) => {});

const __fee = require("./models/fee");
const Fee = sequelize.define("fee", __fee.attributes, __fee.options);

Fee.sync({ alter: true })
	.then()
	.catch((err) => {});

const __department = require("./models/department");
const Department = sequelize.define("department", __department.attributes, __department.options);

const __ticket = require("./models/ticket");
const Ticket = sequelize.define("ticket", __ticket.attributes, __ticket.options);

const __reply = require("./models/reply");
const Reply = sequelize.define("reply", __reply.attributes, __reply.options);

const __userPrize = require("./models/userPrize");
const UserPrize = sequelize.define("userPrizes", __userPrize.attributes, __userPrize.options);

UserPrize.sync({ alter: true })
	.then()
	.catch((err) => {});

const __card = require("./models/card");
const Card = sequelize.define("card", __card.attributes, __card.options);

Card.sync({ alter: true })
	.then()
	.catch((err) => {});

const __owner = require("./models/owner");
const Owner = sequelize.define("owner", __owner.attributes, __owner.options);

const __cardType = require("./models/cardType");
const CardType = sequelize.define("cardTypes", __cardType.attributes, __cardType.options);

CardType.sync({ alter: true })
	.then()
	.catch((err) => {});

const __country = require("./models/country");
const Country = sequelize.define("country", __country.attributes, __country.options);
Country.sync({ alter: true })
	.then()
	.catch((err) => {
		console.log("error", err);
	});

const __role = require("./models/role");
const Role = sequelize.define("role", __role.attributes, __role.options);

const __permission = require("./models/permission");
const Permission = sequelize.define("permission", __permission.attributes, __permission.options);

const __auctionLog = require("./models/auctionLog");
const AuctionLog = sequelize.define("auctionLogs", __auctionLog.attributes, __auctionLog.options);

const __tokenPrize = require("./models/tokenPrize");
const TokenPrize = sequelize.define("tokenPrizes", __tokenPrize.attributes, __tokenPrize.options);

const __agentSession = require("./models/agentSession");
const AgentSession = sequelize.define("agentSession", __agentSession.attributes, __agentSession.options);

AgentSession.sync({ alter: true })
	.then()
	.catch((err) => {});

const __agentReward = require("./models/agentReward");
const AgentReward = sequelize.define("agentReward", __agentReward.attributes, __agentReward.options);

AgentReward.sync({ alter: true })
	.then()
	.catch((err) => {});

const __attribute = require("./models/attribute");
const Attribute = sequelize.define("attribute", __attribute.attributes, __attribute.options);

Attribute.sync({ alter: true })
	.then()
	.catch((err) => {});

const __userAttribute = require("./models/userAttribute");
const UserAttribute = sequelize.define("userAttribute", __userAttribute.attributes, __userAttribute.options);

UserAttribute.sync({ alter: true })
	.then()
	.catch((err) => {});

const __box = require("./models/box");
const Box = sequelize.define("box", __box.attributes, __box.options);

Box.sync({ alter: true })
	.then()
	.catch((err) => {});

const __userBox = require("./models/userBox");
const UserBox = sequelize.define("userBox", __userBox.attributes, __userBox.options);

UserBox.sync({ alter: true })
	.then()
	.catch((err) => {});

const __boxAuction = require("./models/boxAuction");
const BoxAuction = sequelize.define("boxAuction", __boxAuction.attributes, __boxAuction.options);

const __boxSetting = require("./models/boxSetting");
const BoxSetting = sequelize.define("boxSetting", __boxSetting.attributes, __boxSetting.options);
BoxSetting.sync({ alter: true })
	.then()
	.catch((err) => {});

const __boxTrade = require("./models/boxTrade");
const BoxTrade = sequelize.define("boxTrade", __boxTrade.attributes, __boxTrade.options);

const __appConfig = require("./models/appConfig");
const AppConfig = sequelize.define("appConfig", __appConfig.attributes, __appConfig.options);

User.hasMany(BoxTrade, { foreignKey: "userId" });
BoxTrade.belongsTo(User, { foreignKey: "userId" });

BoxAuction.hasMany(BoxTrade, { foreignKey: "boxAuctionId" });
BoxTrade.belongsTo(BoxAuction, { foreignKey: "boxAuctionId" });

CardType.hasMany(BoxSetting, { foreignKey: "cardTypeId" });
BoxSetting.belongsTo(CardType, { foreignKey: "cardTypeId" });

CardType.hasMany(Box, { foreignKey: "cardTypeId" });
Box.belongsTo(CardType, { foreignKey: "cardTypeId" });

Card.hasMany(Box, { foreignKey: "cardId" });
Box.belongsTo(Card, { foreignKey: "cardId" });

User.hasMany(UserBox, { foreignKey: "userId" });
UserBox.belongsTo(User, { foreignKey: "userId" });

Box.hasMany(UserBox, { foreignKey: "boxId" });
UserBox.belongsTo(Box, { foreignKey: "boxId" });

BoxAuction.hasMany(UserBox, { foreignKey: "boxAuctionId" });
UserBox.belongsTo(BoxAuction, { foreignKey: "boxAuctionId" });

Box.hasMany(BoxAuction, { foreignKey: "boxId" });
BoxAuction.belongsTo(Box, { foreignKey: "boxId" });

Asset.hasMany(BoxAuction, { foreignKey: "assetId" });
BoxAuction.belongsTo(Asset, { foreignKey: "assetId" });

CardType.hasMany(Attribute, { foreignKey: "cardTypeId" });
Attribute.belongsTo(CardType, { foreignKey: "cardTypeId" });

User.hasMany(UserAttribute, { foreignKey: "userId" });
UserAttribute.belongsTo(User, { foreignKey: "userId" });

Card.hasMany(UserAttribute, { foreignKey: "cardId" });
UserAttribute.belongsTo(Card, { foreignKey: "cardId" });

Attribute.hasMany(UserAttribute, { foreignKey: "attributeId" });
UserAttribute.belongsTo(Attribute, { foreignKey: "attributeId" });

Asset.hasMany(UserAttribute, { foreignKey: "assetId" });
UserAttribute.belongsTo(Asset, { foreignKey: "assetId" });

BoxTrade.hasMany(UserAttribute, { foreignKey: "boxTradeId" });
UserAttribute.belongsTo(BoxTrade, { foreignKey: "boxTradeId" });

CardType.hasMany(TokenPrize, { foreignKey: "cardTypeId" });
TokenPrize.belongsTo(CardType, { foreignKey: "cardTypeId" });

Asset.hasMany(TokenPrize, { foreignKey: "assetId" });
TokenPrize.belongsTo(Asset, { foreignKey: "assetId" });

Asset.hasMany(Prize, { foreignKey: "assetId" });
Prize.belongsTo(Asset, { foreignKey: "assetId" });

User.hasMany(ReferralReward, { foreignKey: "userId", as: "user" });
ReferralReward.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(ReferralReward, { foreignKey: "referredUserId", as: "referredUser" });
ReferralReward.belongsTo(User, { foreignKey: "referredUserId", as: "referredUser" });

Prize.belongsTo(CardType, { foreignKey: "cardTypeId" });
CardType.hasMany(Prize, { foreignKey: "cardTypeId" });

CardType.hasMany(UserPrize, { foreignKey: "cardTypeId" });
UserPrize.belongsTo(CardType, { foreignKey: "cardTypeId" });

Asset.hasMany(UserPrize, { foreignKey: "assetId" });
UserPrize.belongsTo(Asset, { foreignKey: "assetId" });

User.hasMany(UserPrize, { foreignKey: "userId" });
UserPrize.belongsTo(User, { foreignKey: "userId" });

CardType.hasMany(Card, { foreignKey: "cardTypeId" });
Card.belongsTo(CardType, { foreignKey: "cardTypeId" });

Card.hasMany(AssignedCard, { foreignKey: "cardId" });
AssignedCard.belongsTo(Card, { foreignKey: "cardId" });

User.hasMany(AssignedCard, { foreignKey: "userId" });
AssignedCard.belongsTo(User, { foreignKey: "userId" });

User.hasMany(UserAuctionTrade, { foreignKey: "payerId", as: "payerAuctionTrade" });
UserAuctionTrade.belongsTo(User, { foreignKey: "payerId", as: "payer" });

User.hasMany(UserAuctionTrade, { foreignKey: "payeeId", as: "payeeAuctionTrade" });
UserAuctionTrade.belongsTo(User, { foreignKey: "payeeId", as: "payee" });

Auction.hasMany(UserAuctionTrade, { foreignKey: "auctionId", as: "auctionTrade" });
UserAuctionTrade.belongsTo(Auction, { foreignKey: "auctionId", as: "auction" });

User.hasMany(Auction, { foreignKey: "userId", as: "auction" });
Auction.belongsTo(User, { foreignKey: "userId", as: "user" });

Card.hasMany(Auction, { foreignKey: "cardId" });
Auction.belongsTo(Card, { foreignKey: "cardId" });

Manager.hasMany(ManagerSession, { foreignKey: "userId", as: "sessions" });
ManagerSession.belongsTo(Manager, { foreignKey: "userId", as: "manager" });

ManagerLog.belongsTo(Manager, { foreignKey: "managerId" });

User.hasMany(UserSession, { foreignKey: "userId", as: "sessions" });
UserSession.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(UserWallet, { foreignKey: "userId", as: "assets" });
UserWallet.belongsTo(User, { foreignKey: "userId", as: "user" });

Asset.hasMany(UserWallet, { foreignKey: "assetId", as: "wallets" });
UserWallet.belongsTo(Asset, { foreignKey: "assetId", as: "asset" });

User.hasMany(UserNotification, { foreignKey: "userId" });
UserNotification.belongsTo(User, { foreignKey: "userId" });

Asset.hasMany(AssetNetwork, { foreignKey: "assetId", as: "networks" });
AssetNetwork.belongsTo(Asset, { foreignKey: "assetId", as: "asset" });

Network.hasMany(AssetNetwork, { foreignKey: "networkId", as: "assetNetworks" });
AssetNetwork.belongsTo(Network, { foreignKey: "networkId", as: "network" });

SystemWallet.belongsTo(Asset, { foreignKey: "assetId", as: "asset" });

User.hasMany(UserTransaction, { foreignKey: "userId", as: "transaction" });
UserTransaction.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(UserErrorTransaction, { foreignKey: "userId" });
UserErrorTransaction.belongsTo(User, { foreignKey: "userId" });

Asset.hasMany(UserTransaction, {
	foreignKey: "assetId",
	as: "asset",
});

UserTransaction.belongsTo(Asset, {
	foreignKey: "assetId",
	as: "asset",
});

AssetNetwork.hasMany(UserTransaction, {
	foreignKey: "assetNetworkId",
	as: "transaction",
});

UserTransaction.belongsTo(AssetNetwork, {
	foreignKey: "assetNetworkId",
	as: "assetNetworks",
});

User.hasMany(ManagerNotification, {
	foreignKey: "userId",
	as: "pushNotification",
});

ManagerNotification.belongsTo(User, {
	foreignKey: "userId",
	as: "user",
});

User.hasMany(SwapTransaction, { foreignKey: "userId", as: "swap" });
SwapTransaction.belongsTo(User, { foreignKey: "userId", as: "user" });

SwapTransaction.belongsTo(Asset, {
	foreignKey: "assetInId",
	as: "assetIn",
});

SwapTransaction.belongsTo(Asset, {
	foreignKey: "assetOutId",
	as: "assetOut",
});

Card.hasMany(MatchParticipant, { foreignKey: "cardId" });
MatchParticipant.belongsTo(Card, { foreignKey: "cardId" });

AssignedCard.hasMany(MatchParticipant, { foreignKey: "assignedCardId" });
MatchParticipant.belongsTo(AssignedCard, { foreignKey: "assignedCardId" });

User.hasMany(MatchParticipant, { foreignKey: "userId" });
MatchParticipant.belongsTo(User, { foreignKey: "userId" });

Ticket.belongsTo(User, { foreignKey: "userId", as: "user" });
Ticket.belongsTo(Department, { foreignKey: "departmentId", as: "department" });

Ticket.belongsTo(Manager, { foreignKey: "managerId", as: "manager" });
Ticket.hasMany(Reply, { foreignKey: "ticketId", as: "reply" });
Reply.belongsTo(Ticket, { foreignKey: "ticketId", as: "ticket" });
Reply.belongsTo(User, { foreignKey: "userId", as: "user" });
Reply.belongsTo(Manager, { foreignKey: "managerId", as: "manager" });

Department.hasMany(Ticket, { foreignKey: "departmentId", as: "ticket" });
Manager.hasMany(Ticket, { foreignKey: "managerId", as: "manager" });

Manager.hasMany(Department, { foreignKey: "headManagerId", as: "department" });
Department.belongsTo(Manager, { foreignKey: "headManagerId", as: "headManager" });

Manager.belongsToMany(Department, { through: "manager_department" });
Department.belongsToMany(Manager, { through: "manager_department" });

Asset.hasMany(ReferralReward, { foreignKey: "assetId" });
ReferralReward.belongsTo(Asset, { foreignKey: "assetId" });

Country.hasMany(User, { foreignKey: "countryId" });
User.belongsTo(Country, { foreignKey: "countryId" });

Asset.hasMany(Fee, { foreignKey: "assetId" });
Fee.belongsTo(Asset, { foreignKey: "assetId" });

Auction.hasMany(ReferralReward, { foreignKey: "auctionId" });
ReferralReward.belongsTo(Auction, { foreignKey: "auctionId" });

Auction.hasMany(AuctionLog, { foreignKey: "auctionId" });
AuctionLog.belongsTo(Auction, { foreignKey: "auctionId" });

User.hasMany(AuctionLog, { foreignKey: "userId" });
AuctionLog.belongsTo(User, { foreignKey: "userId" });

Card.hasMany(AuctionLog, { foreignKey: "cardId" });
AuctionLog.belongsTo(Card, { foreignKey: "cardId" });

AssignedCard.hasMany(AuctionLog, { foreignKey: "assignedCardId" });
AuctionLog.belongsTo(AssignedCard, { foreignKey: "assignedCardId" });

// Permission Role M-M
Manager.belongsToMany(Permission, { through: "Permission_Manager" });
Permission.belongsToMany(Manager, { through: "Permission_Manager" });

Role.belongsToMany(Permission, { through: "Permission_Role" });
Permission.belongsToMany(Role, { through: "Permission_Role" });

Role.belongsToMany(Manager, { through: "Role_Manager" });
Manager.belongsToMany(Role, { through: "Role_Manager" });

User.hasMany(AgentSession, { foreignKey: "userId", as: "session" });
AgentSession.belongsTo(User, { foreignKey: "userId", as: "agent" });

User.hasMany(AgentReward, { foreignKey: "userId", as: "userAgentReward" });
AgentReward.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(AgentReward, { foreignKey: "agentId", as: "agentReward" });
AgentReward.belongsTo(User, { foreignKey: "agentId", as: "agent" });

Auction.hasMany(AgentReward, { foreignKey: "auctionId" });
AgentReward.belongsTo(Auction, { foreignKey: "auctionId" });

const models = {
	Asset,
	User,
	UserSession,
	UserWallet,
	UserNotification,
	Settings,
	ReferralReward,
	UserTransaction,
	UserErrorTransaction,
	Network,
	AssetNetwork,
	SystemWallet,
	Manager,
	ManagerSession,
	Auction,
	UserAuctionTrade,
	Language,
	CardType,
	Card,
	AssignedCard,
	ManagerNotification,
	SwapTransaction,
	Prize,
	Fee,
	Ticket,
	Reply,
	Department,
	UserPrize,
	MatchParticipant,
	Country,
	AuctionLog,
	TokenPrize,
	Role,
	Permission,
	AgentSession,
	AgentReward,
	Attribute,
	UserAttribute,
	Box,
	UserBox,
	BoxAuction,
	BoxSetting,
	BoxTrade,
	Owner,
	ManagerLog,
	AppConfig,
};

module.exports = { sequelize, Op, Sequelize, literal, ...models };
