/*
| Author : Mohammad Ali Ghazi
| Email  : mohamadalghazy@gmail.com
| Date   : Wed Jan 19 2022
| Time   : 6:28:45 PM
 */

const amqp = require("amqplib/callback_api");
const config = require("config");

/**
 * create message queue broker
 */
class MessageBroker {
	// default url for connection
	url = config.get("services.rabbitmq.url");

	/**
	 * register app in this class
	 * @param {*} app
	 */
	constructor(app) {
		this.app = app;
	}

	/**
	 * connect to queue
	 * @returns
	 */
	connect() {
		return new Promise(async (resolve, reject) => {
			amqp.connect(this.url, (err, connection) => {
				if (err) return reject(err);

				this.connection = connection;

				resolve(true);
			});
		});
	}

	/**
	 * create channel and queue for all active pairs
	 * set channel config in app settings and that all routes have access to it
	 * @returns
	 */
	createChannel() {
		return new Promise(async (resolve, reject) => {
			this.connection.createChannel(async (err, channel) => {
				if (err) return reject(err);

				// set channel in app for access other clients
				this.app.set("channel", channel);

				resolve(channel);
			});
		});
	}

	/**
	 * return modified app
	 * @returns
	 */
	returnApp() {
		return this.app;
	}
}

module.exports = MessageBroker;
