/*
| Author : Mohammad Ali Ghazi
| Email  : mohamadalghazy@gmail.com
| Date   : Sun Jan 09 2022
| Time   : 3:39:18 PM
 */

const socketIo = require("socket.io");
const User = require("./lib/User");

/**
	# access to all socket from {req} routes
		let io = req.app.get("socketIo");

	# for send private message
		io.to("UserId:${user.id}").emit("eventname", "data")

	# for send public message
		io.to("room name").emit("eventname", "data")

 */
class socket {
	constructor(server, app) {
		this.server = server;

		this.app = app;
	}

	run() {

		this.io = socketIo(this.server, {
			cors: {
				origin: "*",
				methods: ["GET", "POST"],
				credentials: true,
			},
		});

		this.app.set("socketIo", this.io);

		this.connection();

		console.log(`*** SOCKET Info: Server is running.`);
	}

	connection() {
		this.io.on("connection", async (socket) => {
			// check user access token
			let user = await new User(socket?.handshake?.auth?.authorization).authentication(),
				manager;

			// check manager access token
			if (!user) manager = await new User(socket?.handshake?.auth?.authorization).managerAuthentication();

			socket.userEntity = user;

			socket.managerEntity = manager;

			// set user to private room
			if (user) socket.join(`UserId:${user.id}`);

			if (manager) {
				socket.join(`Manager`);

				return;
			}

			// join client to public room
			socket.join("Auction");

			socket.join("Auction-Offer");
		});
	}
}

module.exports = socket;
