require('./base/workout-hero');

window.start = function () {
	function rnd (n) {
		return Math.floor(Math.random() * n);
	}

	WH.Handler.register('beat', function (timeline) {
		//var d = new Date();
		//console.log('tick @' + d.getMinutes() + ':' + d.getSeconds() + ':' + d.getMilliseconds());
		//console.log('\t' + timeline.currentTick.handler + '/' + timeline.currentTick.interval);
		$('.current-tick').addClass('highlight');
		setTimeout(function () {
			$('.current-tick').removeClass('highlight');
		}, 50);
	});

	var beat = new WH.Timeline('beat');
	var beatString = 'p300 p300 p300 '
		+ '3t300 2t1000 3t300 2t1000'/* 3t300 2t1000 3t300 2t1000'*/;

	beat.fromBeatString(beatString);
	console.log('Duration: ' + beat.duration / 1000 + 's');

	WH.Timer.timelines.push(beat);
	WH.Timer.start();
};
