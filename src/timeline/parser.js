/**
 * A module for Browserify/Watchify.
 * Must be included after `WH.Timeline`.
 */
module.exports = function (WH) {
	WH.Timeline.clean = function () {
		this.timeline = 0;
		this.reset();
	};

	function _proceedWithSequence (timeline, rep, cmd, dur) {
		rep = +rep || 1;
		dur = +dur;

		console.log('> found: ' + rep + '/' + cmd + '/' + dur);
		(rep).times(function () {
			timeline.push(
				new WH.Tick(dur, cmd === 'p' ? '' : 'tempo')
			);
		});
	}

	WH.Timeline.prototype.fromString = function (str) {
		var repetitions, command, duration, expectation;

		function _startNewFragment () {
			repetitions = '';
			command = '';
			duration = '';
			expectation = /[ptx]|\d/;
		}

		_startNewFragment();

		for (var i = 0; i < str.length; i++) {
			if (expectation.test(str[i])) {
				if (/[ptx]/.test(str[i])) {

					// Scenario: found a command right after another one without any separator
					if (duration) {
						_proceedWithSequence(this, repetitions, command, duration);
						_startNewFragment();
					}

					command = (str[i] === 't' || str[i] === 'x') ? 'x' : 'p';
					expectation = /\d/;
				} else if (/\d/.test(str[i])) {
					if (command) {
						duration += str[i];
					} else {
						repetitions += str[i];
					}
					expectation = /[ptx]|\d/;
				}
			} else {
				if (command && duration) {
					_proceedWithSequence(this, repetitions, command, duration);
				} // else - separator
				_startNewFragment();
			}
		}
		_proceedWithSequence(this, repetitions, command, duration);

	}
};
