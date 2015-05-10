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
	tempo.push(new WH.Tick(300, 'tempo'));
	tempo.push(new WH.Tick(300, 'tempo'));
	tempo.push(new WH.Tick(300, 'tempo'));
	tempo.push(new WH.Tick(300, ''));
	tempo.push(new WH.Tick(600, 'tempo'));
	tempo.push(new WH.Tick(600, 'tempo'));
	tempo.push(new WH.Tick(600, 'tempo'));
	tempo.push(new WH.Tick(600, 'tempo'));

	WH.Timer.timelines.push(tempo);
	WH.Timer.start();
};
