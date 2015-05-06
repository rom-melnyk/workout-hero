module.exports = function (GL) {
	GL.figures = {};

	/**
	 * @constructor
	 * @param {String} name
	 * Creates the figure that contains multiple rectangles with similar fill.
	 */
	function Figure (name) {
		this.name = name;
		this.dirty = true;

		this.posBuffer = GL.gl.createBuffer();
		this.posVertices = [];             // the regular array

		this.txtBuffer = null;
		this.txtVertices = [];             // the regular array

		this.shift = {
			x: 0,
			y: 0
		};

		this.color = 0xFFFFFF;
		this.texture = null;
		this.alpha = 1;

		this.posBufferUpdated = true;
		this.txtBufferUpdated = true;
	}

	Figure.defaultTextureMapping = [0.0, 0.0, 1.0, 1.0];

	/**
	 * @private
	 * @param {Number[]} vertices           vertex array to push values into
	 * @param {Number} x1
	 * @param {Number} y1
	 * @param {Number} x2
	 * @param {Number} y2
	 */
	function _addRectangle (vertices, x1, y1, x2, y2) {
		vertices.push(
			x1, y1,
			x2, y1,
			x2, y2,
			x2, y2,
			x1, y2,
			x1, y1
		);
	}

	/**
	 * @param {Number[]} pos                position vertices, x1, y1, x2, y2. Use real canvas pixel coords!
	 * @param {Number[]} [txt]              texture mapping vertices, s1, t1, s2, t2. Use real texture pixel coords!
	 *                                      Make sure you've set the texture with {@link #setFill()} before setting texture mapping!
	 */
	Figure.prototype.addRectangle = function (pos, txt) {
		_addRectangle(this.posVertices, pos[0], pos[1], pos[2], pos[3]);
		if (txt && this.texture) {
			_addRectangle(this.txtVertices,
				txt[0] / this.texture.width,
				txt[1] / this.texture.height,
				txt[2] / this.texture.width,
				txt[3] / this.texture.height
			);
		} else {
			_addRectangle(this.txtVertices,
				Figure.defaultTextureMapping[0],
				Figure.defaultTextureMapping[1],
				Figure.defaultTextureMapping[2],
				Figure.defaultTextureMapping[3]
			);
		}

		this.posBufferUpdated = true;
		this.txtBufferUpdated = true;
		this.dirty = true;
		return this;
	};

	/**
	 * Same as {@link #addRectangle} but uses [x, y, width, height] coords.
	 * @param {Number[]} pos
	 * @param {Number[]} [txt]
	 */
	Figure.prototype.addRectangleWH = function (pos, txt) {
		pos = [pos[0], pos[1], pos[0] + pos[2], pos[1] + pos[3]];
		if (txt) {
			txt = [txt[0], txt[1], txt[0] + txt[2], txt[1] + txt[3]];
		}
		this.addRectangle(pos, txt);
	};

	Figure.prototype.clean = function () {
		this.posVertices = [];
		this.txtVertices = [];
		this.posBufferUpdated = true;
		this.txtBufferUpdated = true;
		this.dirty = true;
	};

	/**
	 * @param {Object} fill
	 * @param {Number} [fill.color]         for instance, 0xABCDEF
	 * @param {String} [fill.texture]       texture name; any of false values will unset the texture
	 * @param {Number} [fill.alpha]         [0..1]
	 */
	Figure.prototype.setFill = function (fill) {
		if (fill.color !== undefined) {
			this.color = fill.color;
		}
		if (fill.alpha !== undefined) {
			this.alpha = fill.alpha;
		}
		if (fill.hasOwnProperty('texture')) {
			if (fill.texture) {
				this.texture = GL.textures[fill.texture];
				this.txtBuffer = GL.gl.createBuffer();
			} else {
				this.texture = null;
				GL.gl.deleteBuffer(this.txtBuffer);
			}
		}

		return this;
	};

	Figure.prototype.wipeGlData = function () {
		GL.gl.deleteBuffer(this.posBuffer);
		GL.gl.deleteBuffer(this.txtBuffer);
	};

	/**
	 * @param {String} name             the figure name
	 * @return {Figure}
	 */
	GL.createFigure = function (name) {
		GL.figures[name] = new Figure(name);
		return GL.figures[name];
	};

	GL.deleteFigure = function (name) {
		if (GL.figures[name]) {
			GL.figures[name].wipeGlData();
			delete GL.figures[name];
		}
	};

	GL.Figure = Figure;

	return GL;
};