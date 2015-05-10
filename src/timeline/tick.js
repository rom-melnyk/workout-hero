module.exports = function (WH) {
	/**
	 * @constructor Tick
	 * @param {Number} interval					how many ms wait till next tick
	 * @param {String} handler					what to do
	 */
	WH.Tick = function (interval, handler) {
		this.interval = interval;
		this.handler = handler;
	}
};
