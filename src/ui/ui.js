var CFG = require('../base/config');

var UI = {};

UI.init = function () {
	UI.beatTicker = $('.current-tick');
	UI.reminder = $('.reminder');
	UI.beatTimeline = WH.Timeline.get(CFG.SYSTEM.beatCommonName);
	UI.beatTickerAudio = $('#tick-audio')[0];

	/**
	 * A build-in handler for the beat timeline
	 */
	WH.Handler.register(CFG.SYSTEM.beatCommonName, UI.animateCurrentBeatIndicator);

	UI.beatTickerAudio.crossOrigin = true;
	UI.beatTickerAudio.src = CFG.UI.footer.tickSound;
	UI.beatTickerAudio.load();
	UI.beatTickerAudio.oncanplay = function () {
		this.isReady = true;
	};
};

UI.animateCurrentBeatIndicator = function () {
	UI.beatTicker.addClass('highlight');
	if (UI.beatTickerAudio.isReady) {
		UI.beatTickerAudio.play();
	}
	setTimeout(function () {
		UI.beatTicker.removeClass('highlight');
	}, 50);
};

UI.updateReminder = function () {
	if (CFG.UI.footer.showReminder === 1) {
		UI.reminder.width(
			Math.round2(UI.beatTimeline.elapsed / UI.beatTimeline.getDuration() * 100)
			+ '%'
		);
	}
};

module.exports = UI;
