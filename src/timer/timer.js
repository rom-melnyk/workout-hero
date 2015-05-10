module.exports = function (WH) {
	var intervalId;

	WH.Timer = {
		/**
		 * @cfg {WH.Timeline[]}
		 */
		timelines: [],
		interval: 40
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

	function __tick__ () {
		if (traverseAllTimelines()) {
			intervalId = setTimeout(__tick__, WH.Timer.interval);
		} else {
			console.log('[i] Timer stopped');
		}
	}

	WH.Timer.start = function () {
		var now = Date.now();

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
