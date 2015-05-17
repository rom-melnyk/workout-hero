var CFG = require('../base/config');

var UI = {};

UI.init = function () {
	UI.domElBeatTicker = $('.current-tick');
	UI.domElReminder = $('.reminder');
	UI.domElBeatTickerAudio = $('#tick-audio')[0];

	UI.domElBeatTickerAudio.crossOrigin = true;
	UI.domElBeatTickerAudio.src = CFG.UI.footer.tickSound;
	UI.domElBeatTickerAudio.load();
	UI.domElBeatTickerAudio.oncanplay = function () {
		this.isReady = true;
	};

	UI.domElBeatVisualizer = $('.beat-visualizer')[0];
};

UI.animateCurrentBeatIndicator = function (tick, timeline) {
	if (!tick.handler) return;

	UI.domElBeatTicker.addClass('highlight');
	if (UI.domElBeatTickerAudio.isReady) {
		UI.domElBeatTickerAudio.play();
	}
	setTimeout(function () {
		UI.domElBeatTicker.removeClass('highlight');
	}, 50);
};

UI.updateReminder = function () {
	var tl = WH.Timeline.get(CFG.SYSTEM.beatCommonName);
	if (CFG.UI.footer.showReminder === 1) {
		UI.domElReminder.width(
			Math.round2(tl.elapsed / tl.getDuration() * 100)
			+ '%'
		);
	}
};


module.exports = UI;
