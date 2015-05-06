module.exports = function (GL) {
	GL.defaultProgram = {
		v: [
			'attribute vec2 a_posCoords;',
			'uniform vec2 u_shift;',
			'uniform vec2 u_resolution;',
			'attribute vec2 a_texCoords;',
			'varying vec2 v_texCoords;',
			'attribute vec4 a_color;',
			'varying vec4 v_color;',
			'void main() {',
			'  vec2 clipSpaceCoords = (a_posCoords + u_shift) / u_resolution * 2.0 - 1.0;',
			'  gl_Position = vec4(clipSpaceCoords * vec2(1, -1), 0, 1);',
			'  v_color = a_color;',
			'  v_texCoords = a_texCoords;',
			'}'
		].join(''),
		f: [
			'precision mediump float;',
			'uniform sampler2D u_texUnit;',
			'varying vec2 v_texCoords;',
			'varying vec4 v_color;',
			'uniform int u_useTexture;',
			'void main() {',
			'  if (u_useTexture == 0) {',
			'    gl_FragColor = v_color;',
			'  } else {',
			'    gl_FragColor = texture2D(u_texUnit, v_texCoords) * v_color;',
			'  }',
			'}'
		].join('')
	};

	return GL;
};