/**
 * A module for Browserify/Watchify.
 * Must be included after `WH.Timeline`.
 */
var CFG = require('../base/config');

module.exports = function (WH) {
	function __proceedWithExpr (timeline, rep, cmd, offset, predefined) {
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

	// ------------- SAX-like CST -------------
	/**
	 * @private
	 * @param {String} el
	 * @param {RegExp|RegExp[]} expectations
	 * @return {RegExp|Boolean}			false if didn't meet
	 */
	function __meetsExpectations (el, expectations) {
		var meets = false;
		expectations = (expectations.constructor === Array) ? expectations : [expectations];

		(expectations.length).times(function (i) {
			if (expectations[i].test(el)) {
				meets = expectations[i];
				return false;
			}
		});

		return meets;
	}

	var SYNTAX = {
		repetitions: /\d+/,
		command: /[ptx]/i,
		offset: /\d+/,
		predefinedAt: /@/,
		predefinedName: /[a-zA-Z_]+/
	};

	// ---------- end of SAX-like CST ---------
	/**
	 * Parses string of following format: "(<expression><separator>)+"
	 * 		where
	 * 		<expression> is (<repetitions>?)<command>(<offset>|<predefined>)
	 * 		 		where
	 * 				<repetitions> is Number; optional; 1 if omitted
	 * 				<command> is /[ptx]/
	 * 					"p" for pause (do nothing),
	 * 					"t" for regular beat tick,
	 * 					"x" for proceeding with the predefined sequence
	 * 				<offset> is Number and means ms after the previous beat. Expected after "p" or "t"
	 * 				<predefined> is String starting with "@" and means the reference to the sequence defined formerly.
	 * 					Expected after "x"
	 * 		<separator> is anything that does not match the <expression>
	 *
	 * @param {String} str
	 */
	WH.Timeline.prototype.fromBeatString = function (str) {
		var repetitions, command, offset, predefined, expectations, meet;

		function _startNewExpression () {
			repetitions = '';
			command = '';
			offset = '';
			predefined = '';
			expectations = [SYNTAX.repetitions, SYNTAX.command];
		}

		_startNewExpression();

		for (var i = 0; i < str.length; i++) {
			meet = __meetsExpectations(str[i], expectations);
			if (meet) {
				switch (meet) {
					case SYNTAX.repetitions:
						repetitions += str[i];
						expectations = [SYNTAX.repetitions, SYNTAX.command];
						break;
					case SYNTAX.command:
						// Scenario: found a command right after another one without any separator
						if (offset || predefined) {
							__proceedWithExpr(this, repetitions, command, offset, predefined);
							_startNewExpression();
						}

						command = str[i];
						expectations = (command === 'x' || command === 'X')
							? SYNTAX.predefinedAt
							: SYNTAX.offset;
						break;
					case SYNTAX.offset:
						offset += str[i];
						expectations = [SYNTAX.offset, SYNTAX.command];
						break;
					case SYNTAX.predefinedAt:
						predefined += str[i];
						expectations = SYNTAX.predefinedName;
						break;
					default : // do nothing
				}
			} else {
				if (command && (offset || predefined)) {
					__proceedWithExpr(this, repetitions, command, offset, predefined);
				} // else - separator
				_startNewExpression();
			}
		}
		__proceedWithExpr(this, repetitions, command, offset, predefined);
	}
};
