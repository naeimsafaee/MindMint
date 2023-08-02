/*
| Author : Mohammad Ali Ghazi
| Email  : mohamadalghazy@gmail.com
| Date   : Thu Sep 09 2021
| Time   : 11:14:22 AM
 */

/**
 * containers: is global variable that defined in app.js and default is empty object = {}
 * Registers a new handler.
 * @param {*} names
 * @param {*} type init | before | after
 * @param {*} callback
 * @param {*} priority
 * @param {*} awaiting
 * @param {*} returning
 */
exports.register = (names, type, callback, priority = 500, awaiting = false, returning = false) => {
	if (typeof names === "string") names = [names];

	for (let key of names) {
		if (!containers[key]) containers[key] = {};

		if (!containers[key][type]) containers[key][type] = [];

		containers[key][type].push({ priority, callback, awaiting, returning });
	}
};

/**
 * register after trigger used by triggerAfter
 * @param {*} names
 * @param {*} callback
 * @param {*} priority
 * @returns
 */
exports.registerAfter = (names, callback, priority = 500) => this.register(names, "after", callback, priority);

/**
 * register before trigger used by triggerBefore
 * @param {*} names
 * @param {*} callback
 * @param {*} priority
 * @returns
 */
exports.registerBefore = (names, callback, priority = 500) => this.register(names, "before", callback, priority);

/**
 * containers: is global variable that defined in app.js and default is empty object = {}
 * triggers a hook
 * @param {*} names
 * @param {*} type
 * @param {*} params
 * @returns
 */
exports.trigger = async (names, type, params = null) => {
	if (typeof names === "string") names = [names];

	for (let name of names) {
		if (!containers[name]) return null;

		if (!containers[name][type]?.length) return null;

		let sorted = containers[name][type]?.sort((a, b) => a.priority - b.priority),
			result = null;

		for (let key in sorted) {
			let item = sorted[key];

			if (typeof item.callback !== "function") continue;

			if (item.awaiting) result = await item.callback(params, result, name, type);
			else result = item.callback(params, result, name, type);

			if (!item.returning) result = null;
		}
	}
};

/**
 * trigger after
 * @param {*} name
 * @param {*} params
 * @returns
 */
exports.triggerAfter = (name, params = null) => this.trigger(name, "after", params);

/**
 * trigger before
 * @param {*} name
 * @param {*} params
 * @returns
 */
exports.triggerBefore = (name, params = null) => this.trigger(name, "before", params);
