var Events = require('events'),
	util = require('util'),
	Timer = require('../timer/timer'),
	Tick = require('./tick'),
	Parser = require('./parser');

var timelines = {};

/**
 * @constructor Timeline
 * @param {String} name
 */
var Timeline = function (name) {
	this.name = name;

	/**
	 * @cfg {Tick[]} ticks                each value means the time offset before next tick
	 */
	this.ticks = [];
	this.currentTick = 0;

	this.elapsed = 0;

	this.startedAt = 0;
	this.stoppedAt = 0;

	this.isRunning = false;
	this.isActive = true;

	timelines[name] = this;

	Timer.addListener('update', function (elapsed) {
		var tick = this.getCurrentTick(),
			nextTick;

		if (!this.isActive) return;
		if (!this.isRunning || !tick) {
			this.reset();
			return;
		}

		this.elapsed = elapsed;

		if (this.elapsed >= tick.offset) {
			this.currentTick++;
			nextTick = this.getCurrentTick();
			while (nextTick && this.elapsed >= nextTick.offset) {
				tick = this.getCurrentTick();
				this.currentTick++;
				nextTick = this.getCurrentTick();
			}
			/**
			 * @event tick
			 * @param {Tick} tick
			 * @param {Timeline} timeline
			 */
			this.emit('tick', tick, this);
		}

		Timer.runningTimelines++;
	}.bind(this));
};

util.inherits(Timeline, Events.EventEmitter);


Timeline.prototype.getCurrentTick = function () {
	return this.ticks[this.currentTick];
};

Timeline.prototype.getDuration = function () {
	return (this.ticks[this.ticks.length - 1] || {offset: 0}).offset;
};

/**
 * @param {Tick} tick
 */
Timeline.prototype.push = function (tick) {
	if (!(tick instanceof Tick)) return;
	this.ticks.push(tick);
};

Timeline.prototype.clean = function () {
	this.ticks = [];
	this.reset();
};


// ------------------------------------------- player methods -------------------------------------------
Timeline.prototype.start = function (time) {
	this.isRunning = true;
	this.startedAt = time || Date.now();
};

Timeline.prototype.pause = function (time) {
	this.isRunning = false;
	this.stoppedAt = time || Date.now();
};

Timeline.prototype.reset = function () {
	this.currentTick = 0;
	this.startedAt = 0;
	this.stoppedAt = 0;
	this.elapsed = 0;
	this.isRunning = false;
};
// ----------------------------------------- end of player methods -----------------------------------------


// ------------------------------------------------ statics ------------------------------------------------
/**
 * @static
 * @param {String} name
 * @return {Timeline}
 */
Timeline.get = function (name) {
	return timelines[name];
};

Timeline.prototype.fromBeatString = Parser.fromBeatString;


module.exports = Timeline;
