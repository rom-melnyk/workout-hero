module.exports = function (GL) {
	var textureCount = 0;
	GL.textures = {};

	/**
	 * @constructor
	 * @param {String} name
	 * @param {Image|HTMLCanvasElement|String} image            Image or Canvas or base64
	 */
	function Texture (name, image) {
		if (textureCount === 16) {
			console.log('[ GL-ERR ] Unable to create the texture, MAX_COUNT (16) reached');
			return;
		}

		this.name = name;
		this.texture = GL.gl.createTexture();
		this.index = textureCount;
		this.image = null;

		this.update(image);

		textureCount++;
	}

	function getImageFromString (str) {
		var img = new Image();
		img.src = str;
		return img;
	}

	/**
	 * @param {Image|HTMLCanvasElement|String} image            Image or Canvas or base64
	 */
	Texture.prototype.update = function (image) {
		if (typeof image === 'string') {
			image = getImageFromString(image);
		}

		if (!(image instanceof Image || image instanceof HTMLCanvasElement)) {
			image = Texture.emptyImage;
		}

		this.width = image.width;
		this.height = image.height;
		this.image = image;
	};

	Texture.emptyImage = new Image();
	Texture.emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

	Texture.prototype.activate = function () {
		GL.gl.bindTexture(GL.gl.TEXTURE_2D, this.texture);

		GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_WRAP_S, GL.gl.CLAMP_TO_EDGE);
		GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_WRAP_T, GL.gl.CLAMP_TO_EDGE);
		GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_MIN_FILTER, GL.gl.LINEAR);
		GL.gl.texParameteri(GL.gl.TEXTURE_2D, GL.gl.TEXTURE_MAG_FILTER, GL.gl.LINEAR);

		GL.gl.texImage2D(GL.gl.TEXTURE_2D, 0, GL.gl.RGBA, GL.gl.RGBA, GL.gl.UNSIGNED_BYTE, image);
	};

	Texture.prototype.wipeGlData = function () {
		GL.gl.deleteTexture(this.texture);
	};

	/**
	 * @param {String} name
	 * @param {Image|HTMLCanvasElement} image
	 * @return {GL.Figure}
	 */
	GL.createTexture = function (name, image) {
		GL.textures[name] = new Texture(name, image);
		return GL.textures[name];
	};

	GL.deleteTexture = function (name) {
		if (GL.textures[name]) {
			GL.textures[name].wipeGlData();
			delete GL.textures[name];
		}
	};

	GL.Texture = Texture;
	return GL;
};