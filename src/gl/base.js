module.exports = function (GL) {
	/**
	 * Init the WebGL context
	 */
	GL.init = function () {
		GL.canvas = document.getElementsByTagName('canvas')[0];
		GL.canvas.width = document.body.clientWidth;
		GL.canvas.height = document.body.clientHeight;

		GL.gl = GL.canvas.getContext('experimental-webgl', {
			premultipliedAlpha: false,
			depth: false,
			preserveDrawingBuffer: true
		});

		GL.glProps = {};

		GL.gl.disable(GL.gl.DEPTH_TEST);
		GL.gl.enable(GL.gl.BLEND);
		GL.gl.blendFunc(GL.gl.SRC_ALPHA, GL.gl.ONE_MINUS_SRC_ALPHA);
		GL.gl.pixelStorei(GL.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

		// clearing masks
		GL.gl.clearColor(0, 0, 0, 0);
	};


	/**
	 * @private
	 * Load a sahder into glProps.vShader or into glProps.fShader
	 * @param {Number} type         GL.gl.VERTEX_SHADER or .FRAGMENT_SHADER
	 * @param {String} shader       shader text
	 */
	function _loadShader (type, shader) {
		var name = type === GL.gl.VERTEX_SHADER ? 'vShader' : 'fShader',
			shorthand = type === GL.gl.VERTEX_SHADER ? 'v' : 'f';

		GL.glProps[name] = GL.gl.createShader(type);
		GL.gl.shaderSource(GL.glProps[name], shader);
		GL.gl.compileShader(GL.glProps[name]);
		if (!GL.gl.getShaderParameter(GL.glProps[name], GL.gl.COMPILE_STATUS)) {
			console.log('[ ERR ] An error occurred compiling the ' + shorthand + '-shader: '
				+ GL.gl.getShaderInfoLog(GL.glProps[name])
			);
			throw new Error('Shader compilation exception');
		}
	}

	/**
	 * Set the program (shaders) to work with and updates the locations where the data will be injected into shader.
	 * @param {Object} program                  `{ v: "vertex-shader-text", f: "fragment-shader-text" }`
	 * @param {String[]} locations				list of locations in shaders
	 */
	GL.setProgram = function (program, locations) {
		GL.glProps.program = GL.gl.createProgram();

		_loadShader(GL.gl.VERTEX_SHADER, program.v);
		_loadShader(GL.gl.FRAGMENT_SHADER, program.f);

		GL.gl.attachShader(GL.glProps.program, GL.glProps.vShader);
		GL.gl.attachShader(GL.glProps.program, GL.glProps.fShader);
		GL.gl.linkProgram(GL.glProps.program);
		if (!GL.gl.getProgramParameter(GL.glProps.program, GL.gl.LINK_STATUS)) {
			console.log('[ ERR ] Unable to initialize the shader program');
			throw new Error('Shader program initialization exception');
		}

		GL.gl.useProgram(GL.glProps.program);

		GL.glProps.locations = {};

		_.each(locations, function (loc) {
			//var locName = loc.substring(2);
			switch (loc[0]) {
				case 'a':
					GL.glProps.locations[loc] = GL.gl.getAttribLocation(GL.glProps.program, loc);
					break;
				case 'u':
					GL.glProps.locations[loc] = GL.gl.getUniformLocation(GL.glProps.program, loc);
					break;
			}
		});

	};

	return GL;
};
