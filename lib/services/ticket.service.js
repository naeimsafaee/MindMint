const { postgres } = require("../databases");
const { Settings } = postgres;
const { NotFoundError, HumanError } = require("../services/errorhandler/index");
const Errors = require("./errorhandler/MessageText");
const { DataTypes } = require("sequelize");
const ticketMail = require("../utils/ticketMail");
const config = require("config");
const trackingNumber = (pr = "100", su = "TK") => {
	for (let i = 0; i < 5; i++) pr += ~~(Math.random() * 10);
	return pr + su;
};

/**
 * Add a ticket
 * @param
 * @returns
 */
function userAddTicket(userId, title, text, priority, departmentId, files, io) {
	return new Promise(async (resolve, reject) => {
		let data = [];

		if (Object.keys(files).length) {
			//files is name of field that we passed to multer
			for (let key in files.files) {
				let file = files.files[key];

				data.push({
					name: file.newName,
					key: file.key,
					location: file.location,
				});
			}
		}
		const ticketCode = trackingNumber();
		const ticket = await postgres.Ticket.build({
			userId,
			title,
			text,
			priority,
			departmentId,
			code: ticketCode,
			status: "CREATED",
			...(data && { file: data }),
		}).save();
		const user = await postgres.User.findByPk(userId);

		let content = `User ${
			user.name ? (user.email ? user.email : user.mobile) : null
		} registered a new ticket with code ${ticketCode} `;
		let notif = await postgres.ManagerNotification.create({ title: content, userId: userId, tag: "TICKET" });

		// send notification to admin
		io.to(`Manager`).emit("notification", JSON.stringify(notif));

		resolve(ticket);
	});
}

function userEditTicket(userId, id, title, text, priority, departmentId, files) {
	return new Promise(async (resolve, reject) => {
		let data = [];

		if (Object.keys(files).length) {
			//files is name of field that we passed to multer
			for (let key in files.files) {
				let file = files.files[key];

				data.push({
					name: file.newName,
					key: file.key,
					location: file.location,
				});
			}
		}

		const ticket = await postgres.Ticket.update(
			{
				...(title && { title: title }),
				...(text && { text: text }),
				...(priority && { priority: priority }),
				...(departmentId && { departmentId: departmentId }),
				...(data && { file: data }),
			},
			{
				where: {
					userId,
					id,
				},
			},
		);
		if (!ticket.shift())
			throw new NotFoundError(Errors.TICKET_NOT_FOUND.MESSAGE, Errors.TICKET_NOT_FOUND.CODE, { id });
		resolve(ticket);
	});
}

function userGetTickets(userId, priority, departmentId, status, page, limit, sortDirection) {
	return new Promise(async (resolve, reject) => {
		let offset = (page - 1) * limit;
		const tickets = await postgres.Ticket.findAndCountAll({
			where: {
				...(userId && { userId: userId }),
				...(priority && { priority: priority }),
				...(departmentId && { departmentId: departmentId }),
				...(status && { status: status }),
			},
			include: [
				{
					model: postgres.User,
					as: "user",
					attributes: { exclude: ["password", "salt"] },
				},
				{
					model: postgres.Department,
					as: "department",
				},
				{
					model: postgres.Manager,
					as: "manager",
				},
			],
			offset,
			limit,
			order: [["updatedAt", sortDirection]],
		});
		resolve({
			total: tickets.count,
			pageSize: limit,
			page,
			data: tickets.rows,
		});
	});
}

function userGetTicket(userId, id) {
	return new Promise(async (resolve, reject) => {
		const ticket = await postgres.Ticket.findOne({
			where: {
				userId,
				id,
			},
			include: [
				{
					model: postgres.User,
					as: "user",
					attributes: { exclude: ["password", "salt"] },
				},
				{
					model: postgres.Department,
					as: "department",
				},
				{
					model: postgres.Manager,
					as: "manager",
				},
			],
		});
		if (!ticket)
			return reject(new NotFoundError(Errors.TICKET_NOT_FOUND.MESSAGE, Errors.TICKET_NOT_FOUND.CODE, { id }));
		resolve(ticket);
	});
}

function userDeleteTicket(userId, id) {
	return new Promise(async (resolve, reject) => {
		let ticket = await postgres.Ticket.destroy({ where: { userId, id } });

		if (!ticket)
			return reject(new NotFoundError(Errors.TICKET_NOT_FOUND.MESSAGE, Errors.TICKET_NOT_FOUND.CODE, { id }));
		resolve(ticket);
	});
}

function userChangeTicketStatus(userId, id, status) {
	return new Promise(async (resolve, reject) => {
		const ticket = await postgres.Ticket.update(
			{
				status,
			},
			{
				where: {
					userId,
					id,
				},
			},
		);
		if (!ticket.shift())
			throw new NotFoundError(Errors.TICKET_NOT_FOUND.MESSAGE, Errors.TICKET_NOT_FOUND.CODE, { id });
		resolve(ticket);
	});
}

function managerAddTicket(managerId, userId, title, text, priority, departmentId, files, io) {
	return new Promise(async (resolve, reject) => {
		let data = [];

		if (Object.keys(files).length) {
			//files is name of field that we passed to multer
			for (let key in files.files) {
				let file = files.files[key];

				data.push({
					name: file.newName,
					key: file.key,
					location: file.location,
				});
			}
		}
		const ticketCode = trackingNumber();
		const ticket = await postgres.Ticket.build({
			userId,
			managerId,
			title,
			text,
			priority,
			departmentId,
			code: ticketCode,
			...(data && { file: data }),
			status: "CREATED",
		}).save();

		const notif = await postgres.UserNotification.create({
			userId: userId,
			title: `A new ticket was registered for you with code ${ticketCode}`,
			flash: false,
			status: false,
		});

		io.to(`UserId:${user.id}`).emit("notification", JSON.stringify(notif));

		resolve(ticket);
	});
}

function managerEditTicket(managerId, id, title, text, priority, departmentId, note, tag, status, files) {
	return new Promise(async (resolve, reject) => {
		let data = [];

		if (Object.keys(files).length) {
			//files is name of field that we passed to multer
			for (let key in files.files) {
				let file = files.files[key];

				data.push({
					name: file.newName,
					key: file.key,
					location: file.location,
				});
			}
		}

		const ticket = await postgres.Ticket.update(
			{
				...(title && { title: title }),
				...(status && { status: status }),
				...(note && { note: note }),
				...(tag && { tag: JSON.parse(tag) }),
				...(text && { text: text }),
				...(priority && { priority: priority }),
				...(departmentId && { departmentId: departmentId }),
				...(data && { file: data }),
			},
			{
				where: {
					id,
				},
			},
		);
		if (!ticket.shift())
			throw new NotFoundError(Errors.TICKET_NOT_FOUND.MESSAGE, Errors.TICKET_NOT_FOUND.CODE, { id });
		resolve(ticket);
	});
}

function managerGetTickets(
	id, //1
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
) {
	return new Promise(async (resolve, reject) => {
		let tickets;
		let offset = (page - 1) * limit;
		let where = {
			...(priority && { priority: { [postgres.Op.in]: priority } }),
			...(departmentId && { departmentId: departmentId }),
			...(status && { status: { [postgres.Op.in]: status } }),
			...(title && { title: { [postgres.Op.iLike]: "%" + title + "%" } }),
			...(code && { code: { [postgres.Op.iLike]: "%" + code + "%" } }),
			...(createdAt && { createdAt: createdAt }),
		};

		if (searchQuery) {
			where = {
				[postgres.Op.or]: [
					{ title: { [postgres.Op.like]: "%" + searchQuery + "%" } },
					{ "$user.name$": { [postgres.Op.like]: "%" + searchQuery + "%" } },
					{ "$user.email$": { [postgres.Op.like]: "%" + searchQuery + "%" } },
					{ "$user.mobile$": { [postgres.Op.like]: "%" + searchQuery + "%" } },

					{ "$department.name$": { [postgres.Op.like]: "%" + searchQuery + "%" } },

					{ "$manager.name$": { [postgres.Op.like]: "%" + searchQuery + "%" } },
				],
			};
		}

		let whereUser = {
			...(userName && { name: { [postgres.Op.iLike]: "%" + userName + "%" } }),
		};
		let whereDepatment = {
			...(departmentName && { name: { [postgres.Op.iLike]: "%" + departmentName + "%" } }),
		};
		if (type == "USER") {
			where = {
				...where,
				...(id && { userId: id }),
			};
			tickets = await postgres.Ticket.findAndCountAll({
				where,
				offset,
				limit,
				order: [[sort, order]],
				nest: true,
				include: [
					{
						where: whereUser,
						model: postgres.User,
						as: "user",
						attributes: { exclude: ["password", "salt"] },
					},
					{
						where: whereDepatment,
						model: postgres.Department,
						as: "department",
					},
					{
						model: postgres.Manager,
						as: "manager",
					},
				],
				raw: true,
				order: [["updatedAt", sortDirection]],
			});
		} else {
			where = {
				...where,
				...(id && { managerId: id }),
			};
			tickets = await postgres.Ticket.findAndCountAll({
				where,
				offset,
				limit,
				order: [[sort, order]],
				nest: true,
				include: [
					{
						where: whereUser,
						model: postgres.User,
						as: "user",
						attributes: { exclude: ["password", "salt"] },
					},
					{
						where: whereDepatment,
						model: postgres.Department,
						as: "department",
					},
					{
						model: postgres.Manager,
						as: "manager",
					},
				],
				raw: true,
				order: [["updatedAt", sortDirection]],
			});
		}
		resolve({
			total: tickets.count,
			pageSize: limit,
			page,
			data: tickets.rows,
		});
	});
}

function managerGetTicket(id) {
	return new Promise(async (resolve, reject) => {
		const ticket = await postgres.Ticket.findByPk(id, {
			nest: true,
			include: [
				{
					model: postgres.User,
					as: "user",
					attributes: { exclude: ["password", "salt"] },
				},
				{
					model: postgres.Department,
					as: "department",
				},
				{
					model: postgres.Manager,
					as: "manager",
				},
			],
			raw: true,
		});
		if (!ticket) {
			return reject(new NotFoundError(Errors.TICKET_NOT_FOUND.MESSAGE, Errors.TICKET_NOT_FOUND.CODE, { id }));
		}

		resolve(ticket);
	});
}

function managerDeleteTicket(id) {
	return new Promise(async (resolve, reject) => {
		let ticket = await postgres.Ticket.destroy({ where: { id } });

		if (!ticket)
			return reject(new NotFoundError(Errors.TICKET_NOT_FOUND.MESSAGE, Errors.TICKET_NOT_FOUND.CODE, { id }));
		resolve(ticket);
	});
}

function managerChangeTicketStatus(id, status) {
	return new Promise(async (resolve, reject) => {
		const ticket = await postgres.Ticket.update(
			{
				status,
			},
			{
				where: {
					id,
				},
			},
		);
		if (!ticket.shift())
			throw new NotFoundError(Errors.TICKET_NOT_FOUND.MESSAGE, Errors.TICKET_NOT_FOUND.CODE, { id });
		resolve(ticket);
	});
}

function managerAcceptTicket(managerId, id) {
	return new Promise(async (resolve, reject) => {
		const ticket = await postgres.Ticket.update(
			{
				managerId,
			},
			{
				where: {
					id,
				},
			},
		);
		if (!ticket.shift())
			throw new NotFoundError(Errors.TICKET_NOT_FOUND.MESSAGE, Errors.TICKET_NOT_FOUND.CODE, { id });
		resolve(ticket);
	});
}

function userAddReply(userId, ticketId, text, files, io) {
	return new Promise(async (resolve, reject) => {
		const ticket = await postgres.Ticket.findByPk(ticketId);
		if (ticket.status != "CLOSED") {
			ticket.status = "PENDING";
			await ticket.save();
			let data = [];

			if (Object.keys(files).length) {
				//files is name of field that we passed to multer
				for (let key in files.files) {
					let file = files.files[key];

					data.push({
						name: file.newName,
						key: file.key,
						location: file.location,
					});
				}
			}

			const reply = await postgres.Reply.build({
				userId,
				ticketId,
				text,
				...(data && { file: data }),
			}).save();
			const user = await postgres.User.findByPk(userId);
			const ticketData = await postgres.Ticket.findByPk(ticketId);

			let content = `User ${
				user.name ? (user.email ? user.email : user.mobile) : null
			} registered a new answer for the ticket with the code ${ticketData.code} `;

			let notif = await postgres.ManagerNotification.create({ title: content, userId: userId, tag: "TICKET" });

			io.to(`Manager`).emit("notification", JSON.stringify(notif));

			resolve(reply);
		} else {
			reject(new HumanError(Errors.TICKET_IS_CLOSE.MESSAGE, Errors.TICKET_IS_CLOSE.CODE, { id: ticketId }));
		}
	});
}

function userEditReply(userId, id, ticketId, text, files) {
	return new Promise(async (resolve, reject) => {
		const ticket = await postgres.Ticket.findByPk(ticketId);
		if (ticket.status != "CLOSED") {
			ticket.status = "REPLIED";
			await ticket.save();
			let data = [];

			if (Object.keys(files).length) {
				//files is name of field that we passed to multer
				for (let key in files.files) {
					let file = files.files[key];

					data.push({
						name: file.newName,
						key: file.key,
						location: file.location,
					});
				}
			}

			const reply = await postgres.Reply.update(
				{
					...(text && { text }),
					...(data && { file: data }),
				},
				{
					where: {
						id,
						userId,
					},
				},
			);
			if (!reply.shift())
				throw new NotFoundError(Errors.REPLY_NOT_FOUND.MESSAGE, Errors.REPLY_NOT_FOUND.CODE, { id });
			resolve(reply);
		}
	});
}

async function userGetReplies(userId, ticketId, page, limit, sortDirection) {
	const ticket = await postgres.Ticket.findByPk(ticketId);
	if (ticket.userId != userId) throw new HumanError("This ticket doesn't belong to you");

	let offset = (page - 1) * limit;
	const replies = await postgres.Reply.findAndCountAll({
		where: {
			...(ticketId && { ticketId: ticketId }),
		},
		offset,
		limit,
		include: [
			{
				model: postgres.User,
				as: "user",
				attributes: { exclude: ["password", "salt"] },
			},
			{
				model: postgres.Manager,
				as: "manager",
			},
		],
		order: [["updatedAt", sortDirection]],
	});
	return {
		total: replies.count,
		pageSize: limit,
		page,
		data: replies.rows,
	};
}

function userGetReply(userId, id) {
	return new Promise(async (resolve, reject) => {
		const reply = await postgres.Reply.findOne({
			where: {
				userId,
				id,
			},
			include: [
				{
					model: postgres.User,
					as: "user",
					attributes: { exclude: ["password", "salt"] },
				},
				{
					model: postgres.Manager,
					as: "manager",
				},
			],
		});
		if (!reply)
			return reject(new NotFoundError(Errors.REPLY_NOT_FOUND.MESSAGE, Errors.REPLY_NOT_FOUND.CODE, { id }));
		resolve(reply);
	});
}

function userDeleteReply(userId, id) {
	return new Promise(async (resolve, reject) => {
		let reply = await postgres.Reply.destroy({ where: { userId, id } });

		if (!reply)
			return reject(new NotFoundError(Errors.REPLY_NOT_FOUND.MESSAGE, Errors.REPLY_NOT_FOUND.CODE, { id }));
		resolve(reply);
	});
}

function managerAddReply(req, managerId, ticketId, text, files, io) {
	return new Promise(async (resolve, reject) => {
		const ticket = await postgres.Ticket.findByPk(ticketId);
		if (ticket.status != "CLOSED") {
			ticket.status = "REPLIED";
			ticket.managerId = managerId;
			await ticket.save();
			let data = [];

			if (Object.keys(files).length) {
				//files is name of field that we passed to multer
				for (let key in files.files) {
					let file = files.files[key];

					data.push({
						name: file.newName,
						key: file.key,
						location: file.location,
					});
				}
			}

			const reply = await postgres.Reply.build({
				managerId,
				ticketId,
				text,
				...(data && { file: data }),
			}).save();
			const ticketData = await postgres.Ticket.findByPk(ticketId);
			const user = await postgres.User.findByPk(ticketData.userId);

			const notif = await postgres.UserNotification.create({
				userId: ticketData.userId,
				title: `A new answer was registered for the ticket with the code ${ticketData.code}`,
				flash: false,
				status: false,
			});

			io.to(`UserId:${user.id}`).emit("notification", JSON.stringify(notif));

			if (user.email) {
				await ticketMail(
					user.email,
					ticketData.code,
					config.get("app.cors.origin") + `/profile/ticket/${ticketData.id}`,
				);
			}

			resolve(reply);
		} else {
			throw new HumanError(Errors.TICKET_IS_CLOSE.MESSAGE, Errors.TICKET_IS_CLOSE.CODE, { id: ticketId });
		}
	});
}

function managerEditReply(managerId, id, ticketId, text, files) {
	return new Promise(async (resolve, reject) => {
		const ticket = await postgres.Ticket.findByPk(ticketId);
		if (ticket.status != "CLOSED") {
			ticket.status = "REPLIED";
			ticket.managerId = managerId;
			await ticket.save();
			let data = [];

			if (Object.keys(files).length) {
				//files is name of field that we passed to multer
				for (let key in files.files) {
					let file = files.files[key];

					data.push({
						name: file.newName,
						key: file.key,
						location: file.location,
					});
				}
			}

			const reply = await postgres.Reply.update(
				{
					...(text && { text }),
					...(data && { file: data }),
				},
				{
					where: {
						id,
						managerId,
					},
				},
			);
			if (!reply.shift())
				throw new NotFoundError(Errors.REPLY_NOT_FOUND.MESSAGE, Errors.REPLY_NOT_FOUND.CODE, { id });
			resolve(reply);
		}
	});
}

function managerGetReplies(ticketId, page, limit, sortDirection) {
	return new Promise(async (resolve, reject) => {
		let offset = (page - 1) * limit;
		const replies = await postgres.Reply.findAndCountAll({
			where: {
				...(ticketId && { ticketId: ticketId }),
			},
			nest: true,
			include: [
				{
					model: postgres.User,
					as: "user",
					attributes: { exclude: ["password", "salt"] },
				},
				{
					model: postgres.Manager,
					as: "manager",
				},
			],
			raw: true,
			offset,
			limit,
			order: [["updatedAt", sortDirection]],
		});
		resolve({
			total: replies.count,
			pageSize: limit,
			page,
			data: replies.rows,
		});
	});
}

function managerGetReply(id) {
	return new Promise(async (resolve, reject) => {
		const reply = await postgres.Reply.findByPk(id, {
			nest: true,
			include: [
				{
					model: postgres.User,
					as: "user",
					attributes: { exclude: ["password", "salt"] },
				},
				{
					model: postgres.Manager,
					as: "manager",
				},
			],
			raw: true,
		});
		if (!reply)
			return reject(new NotFoundError(Errors.REPLY_NOT_FOUND.MESSAGE, Errors.REPLY_NOT_FOUND.CODE, { id }));
		resolve(reply);
	});
}

function managerDeleteReply(id) {
	return new Promise(async (resolve, reject) => {
		let reply = await postgres.Reply.destroy({ where: { id } });

		if (!reply)
			return reject(new NotFoundError(Errors.REPLY_NOT_FOUND.MESSAGE, Errors.REPLY_NOT_FOUND.CODE, { id }));
		resolve(reply);
	});
}

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
