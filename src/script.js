require('./base/workout-hero');

window.start = function () {
	function rnd (n) {
		return Math.floor(Math.random() * n);
	}

	WH.Handler.register('tempo', function () {
		var d = new Date();
		console.log('tick @' + d.getMinutes() + ':' + d.getSeconds() + ':' + d.getMilliseconds());
		$('.current-tick').addClass('highlight');
		setTimeout(function () {
			$('.current-tick').removeClass('highlight');
		}, 50);
	});

	var tempo = new WH.Timeline('tempo');
	var tempoString = 'p300'
		+ '3t300 2t1000 3t300 2t1000 3t300 2t1000 3t300 2t1000';

	tempo.fromString(tempoString);
	console.log('Duration: ' + tempo.duration / 1000 + 's');

	WH.Timer.timelines.push(tempo);
	WH.Timer.start();
};
