module.exports = (object) => {
	const x = object;
	Object.keys(x).forEach((m) => {
		if (x[m] === "true") x[m] = true;
		else if (x[m] === "false") x[m] = false;
		else if (!isNaN(+x[m])) x[m] = +x[m];
		else x[m] = x[m];
	});
	return x;
};
