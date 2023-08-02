const axios = require("axios");
const axiosRetry = require("axios-retry");
axiosRetry(axios, {
	retries: 5,
});

const get = async (path) => {
	try {
		const res = await axios.get(path);
		const { data } = await res;
		return data;
	} catch (error) {
		console.log("error", error);
	}
};

const post = async (path, items) => {
	try {
		let form = [];
		for (let property in items) {
			let encodedKey = encodeURIComponent(property);
			let encodedValue = encodeURIComponent(items[property]);
			form.push(encodedKey + "=" + encodedValue);
		}
		form = form.join("&");
		const res = axios.post(path, items);
		const { data } = await res;
		return data;
	} catch (error) {
		return await error;
	}
};

module.exports = {
	get,
	post,
};
