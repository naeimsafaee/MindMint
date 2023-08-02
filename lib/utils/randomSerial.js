const MAX_VALUE = BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935");

const repAt = (string, index, chr) => {
	if (index > string.length - 1) return string;
	return string.substring(0, index) + chr + string.substring(index + 1);
};

exports.generator = (len) => {
	let result = "";
	const numbers = "0123456789";
	let thisLen = len ? len : 32;
	let greater = false;
	do {
		for (let i = 0; i < thisLen; i++) {
			result += numbers.charAt(Math.floor(Math.random() * numbers.length));
		}
		if (Number(result) > MAX_VALUE) {
			result = "";
			greater = true;
			thisLen--;
		} else greater = false;
	} while (greater);

	if (result[0] === "0") {
		result = repAt(result, 0, String(Math.floor(Math.random() * (9 - 1 + 1) + 1)));
	}

	return result;
};
