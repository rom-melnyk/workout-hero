/**
 * @param {Number|String} t				number of seconds or /\d+[hms]?/i
 * @return {Number}						number of seconds
 */
function parseTime (t) {
	var parsed,
		mult = 1;

	if (+t === t) {
		return t;
	}

	parsed = /^(\d+)([hms]?)$/i.exec(t);
	if (!parsed) {
		return 0;
	}
	if (parsed[2] === 'h' || parsed[2] === 'H') {
	 	mult = 60 * 60;
	} else if (parsed[2] === 'm' || parsed[2] === 'M') {
		mult = 60;
	}
	return +parsed[1] * mult;
}

function parseBeat (beat) {

}

/**
 * @return {Number}	bpm
 */
function Beat (opts) {

}

/**
 * @param {Object} opts
 *
 * @cfg {Number|String} offset			seconds after previous period ended; "1m" supported
 * @cfg {Number|String} [duration]		duration in seconds; "1m" supported.
 *										This is overridden if next Period has {@link #Period.offset}.
 *										If not provided and not set by next period, considered as 10s.
 * @cfg {String} beat
 */
function Period (opts) {
 	this.offset = parseTime(opts.offset);
 	this.duration = opts.duration || 10;
}