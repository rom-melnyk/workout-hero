/**
 * A module for Browserify/Watchify
 */
module.exports = {
	UI: {
		footer: {
			/**
			 * @cfg {Number} beatTickerPosition				0..100, means left margin of the bear ticker
			 */
			beatTickerPosition: 25,
			/**
			 * @cfg {Number} showReminder
			 * 		0: no not show the reminder
			 * 		1: show the total reminder
			 * 		2: show the round reminder
			 */
			showReminder: 1,
			tickSound: '/assets/sound/tick-01.mp3'
		},
		beatVisualizer: {
			pixelsPerSecond: 100,
			beatWidth: 10
		}
	},

	SYSTEM: {
		beatCommonName: 'beat',
		timerInterval: 40
	}
};
