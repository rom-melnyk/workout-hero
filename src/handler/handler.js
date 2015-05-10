/**
 * A module for Browserify/Watchify
 */
module.exports = function (WH) {
	var handlers = {};

	WH.Handler = {};

	/**
	 * @param {String} name
	 * @param {...*} [args] 		arguments to pass into the handler
	 */
	WH.Handler.run = function (name, args) {
		if (typeof handlers[name] === 'function') {
			handlers[name].apply(this, Array.prototype.slice.call(arguments, 1));
		}
	};

	/**
	 * @param {String} name
	 * @param {Function} handler
	 */
	WH.Handler.register = function (name, handler) {
		handlers[name] = (typeof handler === 'function') ? handler : function () {};
	};

	WH.Handler.unregister = function (name) {
		delete handlers[name];
	};
};
