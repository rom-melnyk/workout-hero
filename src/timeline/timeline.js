module.exports = function (WH) {
	/**
	 * @constructor Timeline
	 * @param {String} name
	 */
	WH.Timeline = function (name) {
		this.name = name;
		/**
		 * @cfg {Tick[]} timeline				each value means the time offset before next tick
		 */
		this.timeline = [];

		this.currentTickIndex = 0;
		this.currentTick = this.timeline[0];
		this.timing = {
			/**
			 * @cfg {Date} startedAt
			 */
			startedAt: 0,
			/**
			 * @cfg {Date} stoppedAt
			 */
			stoppedAt: 0,
			currentTickOffset: 0,
			absoluteOffset: 0
		};

		this.isRunning = false;
		this.isActive = true;
		this.duration = 0;
	};

	/**
	 * @param {Tick|WH.Tick} tick
	 */
	WH.Timeline.prototype.push = function (tick) {
		tick = tick instanceof WH.Tick ? tick : new WH.Tick(0, '');
		this.timeline.push(tick);
		this.duration += tick.interval;
		if (this.timeline.length === 1) this.currentTick = this.timeline[0];
	};

	WH.Timeline.prototype.moveToNextTick = function () {
		if (!this.isRunning) return;

		this.timing.currentTickOffset += (this.currentTick || {interval: 0}).interval;
		this.currentTickIndex++;
		this.currentTick = this.timeline[this.currentTickIndex];
	};

	function __isCurrentTickOk (timeline) {
		if (!(timeline.currentTick instanceof WH.Tick)) {
			timeline.reset();
			return false;
		} else {
			return true;
		}
	}

	function __proceedWithCurrentTick (timeline) {
		if (__isCurrentTickOk(timeline)) {
			WH.Handler.run(timeline.currentTick.handler, timeline);
		}
	}

	/**
	 * @param {Number} [time=Date.now()]
	 */
	WH.Timeline.prototype.start = function (time) {
		if (this.isRunning) return;

		this.isRunning = true;
		this.timing.startedAt = time || Date.now();

		__proceedWithCurrentTick(this);
	};

	/**
	 * @param {Number} [time=Date.now()]
	 */
	WH.Timeline.prototype.pause = function (time) {
		this.isRunning = false;
		this.timing.stoppedAt = time || Date.now();
	};

	WH.Timeline.prototype.reset = function () {
		this.currentTickIndex = 0;
		this.currentTick = this.timeline[0];
		this.timing.startedAt = 0;
		this.timing.stoppedAt = 0;
		this.timing.currentTickOffset = 0;
		this.timing.absoluteOffset = 0;
		this.isRunning = false;
	};

	WH.Timeline.prototype.timerEvent = function (interval) {
		if (!__isCurrentTickOk(this)) return;

		this.timing.absoluteOffset += interval;
		if (this.timing.absoluteOffset > this.timing.currentTickOffset + this.currentTick.interval) {
			this.moveToNextTick();

			__proceedWithCurrentTick(this);
		}
	}
};
