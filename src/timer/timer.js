var CFG = require('../base/config');

module.exports = function (WH) {
	var intervalId,
		beatTimeline;

	WH.Timer = {
		/**
		 * @cfg {WH.Timeline[]}
		 */
		timelines: [],
		interval: CFG.SYSTEM.timerInterval
	};

	/**
	 * @return {Number} how many timelines are running
	 */
	function traverseAllTimelines () {
		var runningTimelinesCount = 0;

		WH.Timer.timelines.forEach(function (timeline) {
			if (!timeline.isRunning || !timeline.isActive) return true;
			runningTimelinesCount++;
			timeline.timerEvent(WH.Timer.interval);
		});

		return runningTimelinesCount;
	}

	function _uiReminder () {
		if (CFG.UI.footer.showReminder === 1) {
			$('.reminder').width(
				Math.round(beatTimeline.timing.absoluteOffset / beatTimeline.duration * 10000) / 100
				+ '%'
			);
		}
	}

	function __tick__ () {
		if (traverseAllTimelines()) {
			_uiReminder();
			intervalId = setTimeout(__tick__, WH.Timer.interval);
		} else {
			console.log('[i] Timer stopped');
		}
	}

	WH.Timer.start = function () {
		var now = Date.now();

		beatTimeline = WH.Timeline.get(CFG.SYSTEM.beatCommonName);
		console.log('[i] Timer started');
		this.timelines.forEach(function (timeline) {
			timeline.start(now);
		});

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

};
