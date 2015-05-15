var CFG = require('../base/config');

var UI = {};

UI.init = function () {
	UI.beatTicker = $('.current-tick');
	UI.reminder = $('.reminder');
	UI.beatTimeline = WH.Timeline.get(CFG.SYSTEM.beatCommonName);

	/**
	 * A build-in handler for the beat timeline
	 */
	WH.Handler.register(CFG.SYSTEM.beatCommonName, UI.animateCurrentBeatIndicator);
};

UI.animateCurrentBeatIndicator = function () {
	UI.beatTicker.addClass('highlight');
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
