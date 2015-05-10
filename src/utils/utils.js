module.exports = function (WH) {
	/**
	 * @callback Number~Callback
	 * @param {Number} iterator
	 */

	/**
	 * Resembles Ruby language
	 * @param {Number~Callback} callback
	 */
	Number.prototype.times = function (callback) {
		for (var i = 0; i < this; i++) callback(i);
	};
};
