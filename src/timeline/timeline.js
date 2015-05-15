module.exports = function (WH) {
	var timelines = {};

	function __validateTick (tick, timeline) {
		if (!tick) {
			console.warn('[!] Timeline "' + timeline.name + '": wrong tick @' + timeline.currentTick + '; stopped');
			timeline.reset();
		}
		return !!tick;
	}

	/**
	 * @constructor Timeline
	 * @param {String} name
	 */
	WH.Timeline = function (name) {
		this.name = name;
		/**
		 * @cfg {Tick[]} ticks				each value means the time offset before next tick
		 */
		this.ticks = [];
		this.currentTick = 0;

		this.elapsed =  0;

		this.startedAt = 0;
		this.stoppedAt = 0;

		this.isRunning = false;
		this.isActive = true;

		timelines[name] = this;
	};

	WH.Timeline.prototype.getCurrentTick = function () {
		return this.ticks[this.currentTick];
	};

	WH.Timeline.prototype.getNextTick = function () {
		return this.ticks[this.currentTick + 1];
	};

	WH.Timeline.prototype.getDuration = function () {
		return (this.ticks[this.ticks.length - 1] || {offset: 0}).offset;
	};


// ----- player methods -----
	WH.Timeline.prototype.start = function (time) {
		this.isRunning = true;
		this.startedAt = time || Date.now();
	};

	WH.Timeline.prototype.pause = function (time) {
		this.isRunning = false;
		this.stoppedAt = time || Date.now();
	};

	WH.Timeline.prototype.reset = function () {
		this.currentTick = 0;
		this.startedAt = 0;
		this.stoppedAt = 0;
		this.elapsed = 0;
		this.isRunning = false;
	};
// ----- end of player methods -----


	/**
	 * @param {Tick|WH.Tick} tick
	 */
	WH.Timeline.prototype.push = function (tick) {
		if (!(tick instanceof WH.Tick)) return;
		this.ticks.push(tick);
	};

	WH.Timeline.prototype.timerEvent = function (elapsed) {
		var tick = this.getCurrentTick(),
			nextTick;

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
			WH.Handler.run(tick.handler, this);
		}
	};

	// ------------------------------------------------ statics ------------------------------------------------
	/**
	 * @static
	 * @param {String} name
	 * @return {WH.Timeline}
	 */
	WH.Timeline.get = function (name) {
		return timelines[name];
	};

	WH.Timeline.clean = function () {
		this.ticks = [];
		this.reset();
	};

};
