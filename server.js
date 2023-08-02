require("dotenv").config();
const {
	postgres: { sequelize },
} = require("./lib/databases");
const config = require("config");
const serverConfig = config.get("server");
const socketService = require("./lib/services/socket.service");

require("./cron");

var app = require("./lib/app");

process.on("uncaughtException", (ex) => {
	console.log(ex);
	// throw ex;
});
process.on("unhandledRejection", (ex) => {
	console.log(ex);
	// throw ex;
});

const { messageBroker } = require("./lib/middlewares");
const { walletServices } = require("./lib/services");

console.log(`*** SERVER Info: ENVIRONMENT: ${process.env.NODE_ENV}`);
console.log(`*** SERVER Info: Please wait; Starting...`);

let server;

sequelize
	.sync(config.get("databases.postgres.sync"))
	.then(async () => {
		console.log(`*** POSTGRES Info: Tables are synced!`);

		// register db triggers
		// require("./lib/databases/postgres/init")();

		// require("./lib/databases/postgres/migration/card.migration")();

		// create new instance from message broker
		let queue = new messageBroker(app);

		// connect to message broker
		await queue.connect();

		// create channel
		let channel = await queue.createChannel();

		app = queue.returnApp();

		server = app.listen(serverConfig.port, () => {
			console.log(`*** SERVER Info: Server is running on port ${serverConfig.port}...`);
		});

		// server.timeout = 10000;

		// initial socket services
		new socketService(server, app).run();

		// //? call deposit listener for transaction result
		walletServices.listenForDepositResults(channel, app);

		// //? call withdraw listener for transaction result
		walletServices.listenForWithdrawResults(channel, app);

		walletServices.listenForCreateWallet(channel, app);

	})
	.catch((e) => {
		console.log(e);

		throw e;
	});
