var Event = require('events'),
	util = require('util'),
	CFG = require('../base/config'),
	UI = require('../ui/ui');

var intervalId;

/**
 * @inherits Event.EventEmitter
 */
var __timerCtor = function () {
	/**
	 * @cfg {Timeline[]}
	 */
	this.timelines = [];
	this.startedAt = null;
	this.runningTimelines = 0;
};

util.inherits(__timerCtor, Event.EventEmitter);

function __tick__ () {
	var now = Date.now();

	Timer.runningTimelines = 0;

	/**
	 * @event update
	 * @param {Number} elapsed
	 */
	Timer.emit('update', now - Timer.startedAt);

	if (Timer.runningTimelines) {
		intervalId = setTimeout(__tick__, CFG.SYSTEM.timerInterval);
	} else {
		console.log('[i] Timer stopped');
	}
}

__timerCtor.prototype.start = function () {
	this.startedAt = Date.now();

	console.log('[i] Timer started');
	this.timelines.forEach(function (timeline) {
		timeline.start(this.startedAt);
	}, this);

	__tick__();
};

__timerCtor.prototype.pause = function () {
	var now = Date.now();

	clearTimeout(intervalId);
	intervalId = null;

	console.log('[i] Timer paused');
	this.timelines.forEach(function (timeline) {
		timeline.pause(now);
	});
};

__timerCtor.prototype.reset = function () {
	clearTimeout(intervalId);
	intervalId = null;

	console.log('[i] Timer stopped');
	this.timelines.forEach(function (timeline) {
		timeline.reset();
	});
};


var Timer = new __timerCtor();
module.exports = Timer;
