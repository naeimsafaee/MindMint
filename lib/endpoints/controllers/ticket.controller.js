const { ticketService } = require("../../services");
const {
	httpResponse: { response, apiError },
	httpStatus,
} = require("../../utils");

exports.userAddTicket = async (req, res) => {
	const { title, text, priority, departmentId } = req.body;
	const io = req.app.get("socketIo");
	const data = await ticketService.userAddTicket(
		req.userEntity.id,
		title,
		text,
		priority,
		departmentId,
		req.files,
		io,
	);
	return response({ res, statusCode: httpStatus.CREATED, data });
};

exports.userEditTicket = async (req, res) => {
	const { id, title, text, priority, departmentId } = req.body;
	const data = await ticketService.userEditTicket(
		req.userEntity.id,
		id,
		title,
		text,
		priority,
		departmentId,
		req.files,
	);
	return response({ res, statusCode: httpStatus.CREATED, data });
};

exports.userGetTickets = async (req, res) => {
	const { priority, departmentId, status, page, limit, sortDirection } = req.query;
	const data = await ticketService.userGetTickets(
		req.userEntity.id,
		priority,
		departmentId,
		status,
		page,
		limit,
		sortDirection,
	);
	return response({ res, statusCode: httpStatus.CREATED, data });
};

exports.userGetTicket = async (req, res) => {
	const { id } = req.params;
	const data = await ticketService.userGetTicket(req.userEntity.id, id);
	return response({ res, statusCode: httpStatus.CREATED, data });
};

exports.userDeleteTicket = async (req, res) => {
	const { id } = req.params;
	const data = await ticketService.userDeleteTicket(req.userEntity.id, id);
	return response({ res, statusCode: httpStatus.CREATED, data });
};

exports.userChangeTicketStatus = async (req, res) => {
	const { id } = req.params;
	const { status } = req.query;
	const data = await ticketService.userChangeTicketStatus(req.userEntity.id, id, status);
	return response({ res, statusCode: httpStatus.CREATED, data });
};

exports.managerAddTicket = async (req, res) => {
	const io = req.app.get("socketIo");
	const { userId, title, text, priority, departmentId, managerId } = req.body;
	const data = await ticketService.managerAddTicket(
		managerId,
		userId,
		title,
		text,
		priority,
		departmentId,
		req.files,
		io,
	);

	return response({ res, statusCode: httpStatus.CREATED, data });
};

exports.managerEditTicket = async (req, res) => {
	const { id, title, text, priority, departmentId, note, tag, status, managerId } = req.body;

	const data = await ticketService.managerEditTicket(
		managerId,
		id,
		title,
		text,
		priority,
		departmentId,
		note,
		tag,
		status,
		req.files,
	);
	return response({ res, statusCode: httpStatus.CREATED, data });
};

exports.managerGetTickets = async (req, res) => {
	const {
		userId,
		type,
		priority,
		departmentId,
		status,
		page,
		limit,
		sortDirection,
		userName,
		title,
		code,
		departmentName,
		createdAt,
		searchQuery,
		sort,
		order,
	} = req.query;
	let data;
	if (type == "MANAGER")
		data = await ticketService.managerGetTickets(
			req.session.userId, //1
			type, //2
			priority, //3
			departmentId, //4
			status, //5
			page, //6
			limit, //7
			sortDirection, //8
			userName, //9
			title,
			code,
			departmentName,
			createdAt,
			searchQuery,
			sort,
			order,
		);
	else
		data = await ticketService.managerGetTickets(
			userId, //1
			type, //2
			priority, //3
			departmentId, //4
			status, //5
			page, //6
			limit, //7
			sortDirection, //8
			userName, //9
			title,
			code,
			departmentName,
			createdAt,
			searchQuery,
			sort,
			order,
		);

	return response({ res, statusCode: httpStatus.CREATED, data });
};

exports.managerGetTicket = async (req, res) => {
	const { id } = req.params;

	const data = await ticketService.managerGetTicket(id);
	return response({ res, statusCode: httpStatus.CREATED, data });
};

exports.managerDeleteTicket = async (req, res) => {
	const { id } = req.params;
	const data = await ticketService.managerDeleteTicket(id);
	return response({ res, statusCode: httpStatus.CREATED, data });
};

exports.managerChangeTicketStatus = async (req, res) => {
	const { status, id } = req.body;
	const data = await ticketService.managerChangeTicketStatus(id, status);
	return response({ res, statusCode: httpStatus.CREATED, data });
};

exports.managerAcceptTicket = async (req, res) => {
	const { id } = req.params;
	const data = await ticketService.managerAcceptTicket(req.session.userId, id);
	return response({ res, statusCode: httpStatus.CREATED, data });
};

exports.userAddReply = async (req, res) => {
	const { ticketId, text } = req.body;
	const io = req.app.get("socketIo");
	const data = await ticketService.userAddReply(req.userEntity.id, ticketId, text, req.files, io);
	return response({ res, statusCode: httpStatus.CREATED, data });
};

exports.userEditReply = async (req, res) => {
	const { id, ticketId, text } = req.body;
	const data = await ticketService.userEditReply(req.userEntity.id, id, ticketId, text, req.files);
	return response({ res, statusCode: httpStatus.CREATED, data });
};

exports.userGetReplies = async (req, res) => {
	const { ticketId, page, limit, sortDirection } = req.query;
	const data = await ticketService.userGetReplies(req.userEntity.id, ticketId, page, limit, sortDirection);
	return response({ res, statusCode: httpStatus.CREATED, data });
};

exports.userGetReply = async (req, res) => {
	const { id } = req.params;
	const data = await ticketService.userGetReply(req.userEntity.id, id);
	return response({ res, statusCode: httpStatus.CREATED, data });
};

exports.userDeleteReply = async (req, res) => {
	const { id } = req.params;
	const data = await ticketService.userDeleteReply(req.userEntity.id, id);
	return response({ res, statusCode: httpStatus.CREATED, data });
};

exports.managerAddReply = async (req, res) => {
	const { ticketId, text, managerId } = req.body;
	const io = req.app.get("socketIo");
	const data = await ticketService.managerAddReply(req, managerId, ticketId, text, req.files, io);
	return response({ res, statusCode: httpStatus.CREATED, data });
};

exports.managerEditReply = async (req, res) => {
	const { id, ticketId, text, managerId } = req.body;
	const data = await ticketService.managerEditReply(managerId, id, ticketId, text, req.files);
	return response({ res, statusCode: httpStatus.CREATED, data });
};

exports.managerGetReplies = async (req, res) => {
	const { ticketId, page, limit, sortDirection } = req.query;
	const data = await ticketService.managerGetReplies(ticketId, page, limit, sortDirection);
	return response({ res, statusCode: httpStatus.CREATED, data });
};

exports.managerGetReply = async (req, res) => {
	const { id } = req.params;
	const data = await ticketService.managerGetReply(id);
	return response({ res, statusCode: httpStatus.CREATED, data });
};

exports.managerDeleteReply = async (req, res) => {
	const { id } = req.params;
	const data = await ticketService.managerDeleteReply(id);
	return response({ res, statusCode: httpStatus.CREATED, data });
};
