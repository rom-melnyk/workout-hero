require('./gl/gl');

window.start = function () {
	function rnd (n) {
		return Math.floor(Math.random() * n);
	}

	Number.prototype.times = function (cb) {
		for (var i = 0; i < this; i++) cb(i);
	};

	GL.init();
	GL.setProgram(GL.defaultProgram, [
		'a_posCoords',
		'a_texCoords',
		'a_color',
		'u_texUnit',
		'u_useTexture',
		'u_shift',
		'u_resolution'
	]);
	GL.useFramebuffer(null);

	var fig = GL.createFigure('fig01');
	fig.setFill({color: rnd(0xFFFFFF), alpha: Math.random()});
	(50).times(function () {
		fig.addRectangleWH([rnd(500), rnd(200), rnd(500), rnd(100)]);
	});

	fig.draw();
};
