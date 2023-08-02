const twilioConfig = require("config").get("clients.twilio");
const twilio = require("twilio");
const client = twilio(twilioConfig.accountSId, twilioConfig.authToken);

function send(to) {
	return new Promise((resolve, reject) => {
		client.verify
			.services(twilioConfig.serviceId)
			.verifications.create({ to, channel: "sms" })
			.then((verification) => {
				if (verification?.sendCodeAttempts.length) resolve(true);
				else resolve(false);
			})
			.catch((e) => {
				console.log(e);
				resolve(null);
			});
	});
}

function check(to, code) {
	return new Promise((resolve, reject) => {
		client.verify
			.services(twilioConfig.serviceId)
			.verificationChecks.create({ to, code, channel: "sms" })
			.then((verification) => {
				if (verification.valid) resolve(true);
				else resolve(false);
			})
			.catch((e) => {
				resolve(null);
			});
	});
}

/**
 * send notice or custom message to user
 * @param {*} to
 * @param {*} message
 * @returns
 */
function notice(to, message) {
	return new Promise(async (resolve, reject) => {
		client.messages
			.create({
				body: message,
				to: to,
				from: "+447360273866",
			})
			.then((message) => {
				console.log("====================================");
				console.log(message);
				console.log("====================================");
				resolve(true);
			})
			.catch((e) => {
				console.log("====================================");
				console.log(e);
				console.log("====================================");
				resolve(false);
			});
	});
}

module.exports = {
	send,
	check,
	notice,
};
