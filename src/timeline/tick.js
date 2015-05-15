module.exports = function (WH) {
	/**
	 * @constructor Tick
	 * @param {Number} offset					offset from the beginning of the timeline, ms
	 * @param {String} handler					what to do
	 */
	WH.Tick = function (offset, handler) {
		this.offset = offset;
		this.handler = handler;
	}
};
