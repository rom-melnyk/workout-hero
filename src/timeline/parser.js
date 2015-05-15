/**
 * A module for Browserify/Watchify.
 * Must be included after `WH.Timeline`.
 */
var CFG = require('../base/config');

module.exports = function (WH) {
	function _proceedWithSequence (timeline, rep, cmd, offset) {
		var duration;
		rep = +rep || 1;
		offset = +offset;

		//console.log('> found: ' + rep + '/' + cmd + '/' + offset);
		(rep).times(function () {
			//if (cmd === 'p') {
			//	if (timeline.ticks.length > 0) {
			//		timeline.ticks[timeline.ticks.length - 1].offset += offset;
			//		return true;
			//	}
			//}
			duration = timeline.getDuration();
			timeline.push(
				new WH.Tick(duration + offset, cmd === 'p' ? '' : CFG.SYSTEM.beatCommonName)
			);
		});
	}

	/**
	 * Parses string of following format: "/<formula><separator>{0,}/{1,}"
	 * 		where:
	 * 		<formula> is <repetitions><command><offset>
	 * 		 		where:
	 * 				<repetitions> is number
	 * 				<command> is /[ptx]/
	 * 					"p" for pause,
	 * 					"t" or "x" for regular beat tick
	 * 				<offset> is number and means ms after the previous beat
	 * 		<separator> is anything that does not match the <formula>
	 *
	 * @param {String} str
	 */
	WH.Timeline.prototype.fromBeatString = function (str) {
		var repetitions, command, offset, expectation;

		function _startNewFragment () {
			repetitions = '';
			command = '';
			offset = '';
			expectation = /[ptx]|\d/;
		}

		_startNewFragment();

		for (var i = 0; i < str.length; i++) {
			if (expectation.test(str[i])) {
				if (/[ptx]/.test(str[i])) {

					// Scenario: found a command right after another one without any separator
					if (offset) {
						_proceedWithSequence(this, repetitions, command, offset);
						_startNewFragment();
					}

					command = (str[i] === 't' || str[i] === 'x') ? 'x' : 'p';
					expectation = /\d/;
				} else if (/\d/.test(str[i])) {
					if (command) {
						offset += str[i];
					} else {
						repetitions += str[i];
					}
					expectation = /[ptx]|\d/;
				}
			} else {
				if (command && offset) {
					_proceedWithSequence(this, repetitions, command, offset);
				} // else - separator
				_startNewFragment();
			}
		}
		_proceedWithSequence(this, repetitions, command, offset);

	}
};
