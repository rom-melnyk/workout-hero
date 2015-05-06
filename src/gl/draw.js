module.exports = function (GL) {
	function _setPositionBuffer (figure) {
		GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, figure.posBuffer);
		if (figure.posBufferUpdated) {
			GL.gl.bufferData(GL.gl.ARRAY_BUFFER, new Float32Array(figure.posVertices), GL.gl.STATIC_DRAW);
			figure.posBufferUpdated = false;
			GL.gl.enableVertexAttribArray(GL.glProps.locations.a_posCoords); // must be enabled for any figure
		}
		GL.gl.vertexAttribPointer(GL.glProps.locations.a_posCoords, 2, GL.gl.FLOAT, false, 0, 0);
	}

	function _setTextureBuffer (figure) {
		GL.gl.bindBuffer(GL.gl.ARRAY_BUFFER, figure.txtBuffer);
		if (figure.txtBufferUpdated) {
			GL.gl.bufferData(GL.gl.ARRAY_BUFFER, new Float32Array(figure.txtVertices), GL.gl.STATIC_DRAW);
			figure.txtBufferUpdated = false;
		}
		// we enable/disable it depending on whether or not the texture is used; see .draw();
		//GL.gl.enableVertexAttribArray(GL.glProps.location.a_texCoords);
		GL.gl.vertexAttribPointer(GL.glProps.location.a_texCoords, 2, GL.gl.FLOAT, false, 0, 0);
	}

	function _setTextureAttribs (figure) {
		GL.gl.uniform1i(GL.glProps.location.u_texUnit, figure.texture.index);
		_setTextureBuffer(figure);
		GL.gl.activeTexture(GL.gl.TEXTURE0 + figure.texture.index);
		GL.gl.bindTexture(GL.gl.TEXTURE_2D, figure.texture.texture);
	}

	function _setColorAttrib (figure) {
		GL.gl.vertexAttrib4f(GL.glProps.locations.a_color,
			(figure.color >>> 16) / 255,
			(figure.color >>> 8 & 0x0000FF) / 255,
			(figure.color & 0x0000FF) / 255,
			figure.alpha
		);
	}

	/**
	 * @param {Boolean} [lazy=false]        if set, do not render unchanged objects
	 */
	GL.Figure.prototype.draw = function (lazy) {
		if (lazy && this.dirty) {
			return this;
		}

		if (this.texture) {
			GL.gl.uniform1i(GL.glProps.locations.u_useTexture, 1);
			GL.gl.enableVertexAttribArray(GL.glProps.location.a_texCoords);
			_setTextureAttribs(this);
		} else {
			GL.gl.uniform1i(GL.glProps.locations.u_useTexture, 0);
			GL.gl.disableVertexAttribArray(GL.glProps.locations.a_texCoords);
		}

		_setPositionBuffer(this);
		_setColorAttrib(this);
		GL.gl.uniform2f(GL.glProps.locations.u_shift, this.shift.x, this.shift.y);

		GL.gl.drawArrays(GL.gl.TRIANGLES, 0, this.posVertices.length / 2);

		this.dirty = false;
		return this;
	};

	GL.clear = function () {
		GL.gl.clear(GL.gl.COLOR_BUFFER_BIT);
	};

	return GL;
};