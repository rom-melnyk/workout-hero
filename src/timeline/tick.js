/**
 * @constructor Tick
 * @param {Number} offset					offset from the beginning of the timeline, ms
 * @param {String} handler					what to do
 */
var Tick = function (offset, handler) {
	this.offset = offset;
	this.handler = handler;
};

module.exports = Tick;
