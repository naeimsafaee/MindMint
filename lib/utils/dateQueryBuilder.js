exports.dateQueryBuilder = (date) => {
	const start = new Date(date);
	const end = new Date(date);
	start.setUTCHours(0, 0, 0, 0);
	end.setUTCHours(23, 59, 59, 999);

	return { start, end };
};

exports.extractStartAndEndOfDay = (s, e) => {
	const start = new Date(s);
	const end = new Date(e);
	start.setUTCHours(0, 0, 0, 0);
	end.setUTCHours(23, 59, 59, 999);

	return { startAt: start, endAt: end };
};
