module.exports = function (WH) {
	/**
	 * @callback Number~Callback
	 * @param {Number} index
	 * @return {*|Boolean}			if false - break the sequence
	 */

	/**
	 * Resembles Ruby language
	 * @param {Number~Callback} callback
	 */
	Number.prototype.times = function (callback) {
		for (var i = 0; i < this; i++) {
			if (callback(i) === false) break;
		}
	};

	Math.randomX = function (x) {
		return Math.floor(Math.random() * x);
	};

	Math.round2 = function (x) {
		return Math.round(x * 100) / 100;
	}
};
