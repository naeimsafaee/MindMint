const fwStr = require("fixed-width-string");
module.exports = class Log {
	constructor(label = null, location = null) {
		this.label = label;
		this.location = location;
	}

	form(message) {
		let _string = "";
		if (this.label) _string += `${fwStr(this.label.toUpperCase(), 16)} || `;
		if (this.location) _string += `@ ${this.location} > `;
		_string += message;
		return _string;
	}

	debug(message) {
		if (process.env.NODE_ENV != "production") {
			return console.log(`--- Debug --- || ${this.form(message)}`);
		} else return;
	}

	info(message) {
		return console.log(`--- Info ---- || ${this.form(message)}`);
	}

	error(message) {
		return console.log(`--- Error --- || ${this.form(message)}`);
	}
};
