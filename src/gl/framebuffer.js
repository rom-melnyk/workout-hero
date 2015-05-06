module.exports = function (GL) {
	GL.framebuffers = {};

	GL.createFramebuffer = function (name, opts) {
		var fb = {};

		fb.buffer = GL.gl.createFramebuffer();
		fb.width = opts.width || GL.canvas.width;
		fb.height = opts.height || GL.canvas.height;

		GL.framebuffers[name] = fb;
	};

	GL.useFramebuffer = function (fb) {
		if (fb === null) {
			GL.gl.bindFramebuffer(GL.gl.FRAMEBUFFER, null);
			GL.gl.uniform2f(GL.glProps.locations.u_resolution, GL.canvas.width, GL.canvas.height);
		} else {
			GL.gl.bindFramebuffer(GL.gl.FRAMEBUFFER, null);
			GL.gl.uniform2f(GL.glProps.locations.u_resolution, GL.canvas.width, GL.canvas.height);
		}
	};

	return GL;
};
