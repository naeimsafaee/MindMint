const Joi = require("joi");

const userAddTicket = {
	body: {
		title: Joi.string(),
		text: Joi.string(),
		priority: Joi.string().valid("LOW", "MEDIUM", "HIGH").default("LOW"),
		departmentId: Joi.number(),
	},
};
const userEditTicket = {
	body: {
		id: Joi.number(),
		title: Joi.string(),
		text: Joi.string(),
		priority: Joi.string().valid("LOW", "MEDIUM", "HIGH"),
		departmentId: Joi.number(),
	},
};
const userGetTickets = {
	query: {
		priority: Joi.string().valid("LOW", "MEDIUM", "HIGH"),
		departmentId: Joi.number(),
		status: Joi.string().valid("CREATED", "REPLIED", "CLOSED"),
		page: Joi.string().default(1),
		limit: Joi.string().default(10),
		sortDirection: Joi.valid("asc", "desc").default("desc"),
	},
};
const userGetTicket = {
	params: {
		id: Joi.number(),
	},
};
const userDeleteTicket = {
	params: {
		id: Joi.number(),
	},
};
const userChangeTicketStatus = {
	params: {
		id: Joi.number(),
	},
	query: {
		status: Joi.string().valid("CREATED", "REPLIED", "CLOSED"),
	},
};
const managerAddTicket = {
	body: {
		userId: Joi.string(),
		title: Joi.string(),
		text: Joi.string(),
		priority: Joi.string().valid("LOW", "MEDIUM", "HIGH").default("LOW"),
		managerId: Joi.string(),
		departmentId: Joi.number(),
	},
};
const managerEditTicket = {
	body: {
		id: Joi.number(),
		title: Joi.string(),
		text: Joi.string(),
		priority: Joi.string().valid("LOW", "MEDIUM", "HIGH"),
		departmentId: Joi.number(),
		managerId: Joi.number(),
		note: Joi.string(),
		tag: Joi.string(),
		status: Joi.string(),
	},
};
const managerGetTickets = {
	query: {
		userId: Joi.string(),
		type: Joi.string().valid("MANAGER", "USER").default("MANAGER"),
		priority: Joi.array().items(Joi.valid("LOW", "MEDIUM", "HIGH")),
		departmentId: Joi.number(),
		status: Joi.array().items(Joi.valid("CREATED", "REPLIED", "CLOSED")),
		page: Joi.string().default(1),
		limit: Joi.string().default(10),
		sortDirection: Joi.valid("asc", "desc").default("desc"),
		userName: Joi.string(),
		title: Joi.string(),
		code: Joi.string(),
		departmentName: Joi.string(),
		createdAt: Joi.date(),
		searchQuery: Joi.string().allow(null, ""),
		sort: Joi.string().default("id"),
		order: Joi.valid("DESC", "ASC").default("DESC"),
	},
};
const managerGetTicket = {
	params: {
		id: Joi.number(),
	},
};
const managerDeleteTicket = {
	params: {
		id: Joi.number(),
	},
};
const managerChangeTicketStatus = {
	body: {
		status: Joi.string(),
		id: Joi.number(),
	},
};
const managerAcceptTicket = {
	params: {
		id: Joi.number(),
	},
};

const userAddReply = {
	body: {
		ticketId: Joi.number(),
		text: Joi.string(),
	},
};
const userEditReply = {
	body: {
		id: Joi.number(),
		ticketId: Joi.number(),
		text: Joi.string(),
	},
};
const userGetReplies = {
	query: {
		ticketId: Joi.number(),
		page: Joi.string().default(1),
		limit: Joi.string().default(10),
		sortDirection: Joi.valid("asc", "desc").default("desc"),
	},
};
const userGetReply = {
	params: {
		id: Joi.number(),
	},
};
const userDeleteReply = {
	params: {
		id: Joi.number(),
	},
};
const managerAddReply = {
	body: {
		ticketId: Joi.number(),
		text: Joi.string(),
		managerId: Joi.number(),
	},
};
const managerEditReply = {
	body: {
		id: Joi.number(),
		ticketId: Joi.number(),
		text: Joi.string(),
		managerId: Joi.number(),
	},
};
const managerGetReplies = {
	query: {
		ticketId: Joi.number(),
		page: Joi.string().default(1),
		limit: Joi.string().default(10),
		sortDirection: Joi.valid("asc", "desc").default("desc"),
	},
};

const managerGetReply = {
	params: {
		id: Joi.number(),
	},
};

const managerDeleteReply = {
	params: {
		id: Joi.number(),
	},
};

module.exports = {
	userAddTicket,
	userEditTicket,
	userGetTickets,
	userGetTicket,
	userDeleteTicket,
	userChangeTicketStatus,
	managerAddTicket,
	managerEditTicket,
	managerGetTickets,
	managerGetTicket,
	managerDeleteTicket,
	managerChangeTicketStatus,
	managerAcceptTicket,

	userAddReply,
	userEditReply,
	userGetReplies,
	userGetReply,
	userDeleteReply,
	managerAddReply,
	managerEditReply,
	managerGetReplies,
	managerGetReply,
	managerDeleteReply,
};
