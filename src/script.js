require('./base/workout-hero');

window.start = function () {
	WH.init();

	var beat = WH.Timeline.get('beat');
	var beatString = 'p1000 '
		+ '3t300 2t1000 p1000 | 3t300 2t1000 p1000 | 3t300 2t1000 p1000 | 3t300 2t1000 p1000';

	beat.fromBeatString(beatString);
	console.log('Duration: ' + beat.getDuration() / 1000 + 's');
	WH.beatVisualizer.add(10 * 1000);

	WH.Timer.start();
};
