/**
 * A module for Browserify/Watchify
 */
var CFG = require('../base/config');

module.exports = function (WH) {
	function _uiTick () {
		$('.current-tick').addClass('highlight');
		setTimeout(function () {
			$('.current-tick').removeClass('highlight');
		}, 50);
	}

	/**
	 * A build-in handler for the beat timeline
	 */
	WH.Handler.register(CFG.SYSTEM.beatCommonName, function (timeline) {
		//var d = new Date();
		//console.log('tick @' + d.getMinutes() + ':' + d.getSeconds() + ':' + d.getMilliseconds());
		//console.log('\t' + timeline.currentTick.handler + '/' + timeline.currentTick.interval);
		_uiTick();
	});


};
