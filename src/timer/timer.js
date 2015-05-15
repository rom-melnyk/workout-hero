var CFG = require('../base/config'),
	UI = require('../ui/ui');

module.exports = function (WH) {
	var intervalId;

	WH.Timer = {
		/**
		 * @cfg {WH.Timeline[]}
		 */
		timelines: [],
		interval: CFG.SYSTEM.timerInterval,
		startedAt: null
	};

	function __tick__ () {
		var runningTimelinesCount = 0,
			now = Date.now();

		WH.Timer.timelines.forEach(function (timeline) {
			if (!timeline.isRunning || !timeline.isActive) return true;
			runningTimelinesCount++;
			timeline.timerEvent(now - WH.Timer.startedAt);
		});

		if (runningTimelinesCount) {
			UI.updateReminder();
			intervalId = setTimeout(__tick__, WH.Timer.interval);
		} else {
			console.log('[i] Timer stopped');
		}
	}

	WH.Timer.start = function () {
		this.startedAt = Date.now();

		console.log('[i] Timer started');
		this.timelines.forEach(function (timeline) {
			timeline.start(this.startedAt);
		}, this);

		__tick__();
	};

	WH.Timer.pause = function () {
		var now = Date.now();

		clearTimeout(intervalId);
		intervalId = null;

		console.log('[i] Timer paused');
		this.timelines.forEach(function (timeline) {
			timeline.pause(now);
		});
	};

	WH.Timer.reset = function () {
		clearTimeout(intervalId);
		intervalId = null;

		console.log('[i] Timer stopped');
		this.timelines.forEach(function (timeline) {
			timeline.reset();
		});
	};

};
