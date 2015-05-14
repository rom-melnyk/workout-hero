require('./base/workout-hero');

window.start = function () {
	function rnd (n) {
		return Math.floor(Math.random() * n);
	}

	var beat = WH.Timeline.get('beat');
	var beatString = 'p300 p300 p300 '
		+ '3t300 2t1000 3t300 2t1000 3t300 2t1000 3t300 2t1000';

	beat.fromBeatString(beatString);
	console.log('Duration: ' + beat.duration / 1000 + 's');

	WH.Timer.timelines.push(beat);
	WH.Timer.start();
};
