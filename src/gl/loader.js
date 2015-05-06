module.exports = function (GL) {
	/**
	 * Load assets and run the callback once everything is loaded.
	 *
	 * @param {Object} assets           the description af the assets; keys mean asset names
	 * @param {String} assets.type      one of "shaders", "image", "text", "xml", "json"
	 * @param {String} [assets.v]       vertex shader filename (work with type === "shader")
	 * @param {String} [assets.f]       fragment shader filename (work with type === "shader")
	 * @param {String} assets.src       the filename for another kind of asset
	 *
	 * @return {Object}                 an object with `.then()` method that expects the function invoked after all assets are loaded.
	 *                                  That function receives one {Object} param with keys from the `assets` and values equals to appropriate content:
	 *                                  - type === "shaders" -- {v: "shader text", f: "shader text"}
	 *                                  - type === "image" -- {Image}
	 *                                  - type === "text" -- {String}
	 *                                  - type === "xml" -- {Document|null}
	 *                                  - type === "json" -- {Object|null}
	 */
	GL.loadAssets = function (assets) {
		var _loadedAssets = {},
			loaded = 0, files = 0,
			infrastructure = {},
			callback = function () {
			};

		/**
		 * @private
		 * The hook for "file-is-loaded" event
		 */
		function _onload () {
			loaded++;
			if (loaded >= files) {
				callback(_loadedAssets);
			}
		}

		/**
		 * @private
		 * Loads any text content (shaders, xml, json, etc) and performs the callback (XHR object is passed as the param)
		 */
		function _loadText (src, cb, mime) {
			var xhr = new XMLHttpRequest();
			files++;
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					cb(xhr);
					_onload();
				}
			};
			xhr.open('GET', src, true);
			if (mime) {
				xhr.overrideMimeType(mime);
			}
			xhr.send();
		}

		function _loadImage (src, cb) {
			var img = new Image();
			files++;
			img.onload = function () {
				cb(img);
				_onload();
			};
			img.src = src;
		}

		_.each(assets, function (asset, name) {
			if (asset.type === 'shaders') {
				_loadedAssets[name] = {};
				_loadText(asset.v, function (xhr) {
					_loadedAssets[name].v = xhr.responseText;
				});
				_loadText(asset.f, function (xhr) {
					_loadedAssets[name].f = xhr.responseText;
				});
			}

			if (asset.type === 'image') {
				_loadImage(asset.src, function (img) {
					_loadedAssets[name] = img;
				});
			}

			if (asset.type === 'text') {
				_loadText(asset.src, function (xhr) {
					_loadedAssets[name] = xhr.responseText;
				});
			}

			if (asset.type === 'xml') {
				_loadText(asset.src, function (xhr) {
					_loadedAssets[name] = xhr.responseXML;
					if (xhr.responseXML === null) {
						console.log('[ GL-WARN ] The resource "' + asset.src + '" wasn\'t interpreted as XML; the structure might be corrupt');
					}
				}, 'application/xml');
			}

			if (asset.type === 'json') {
				_loadText(asset.src, function (xhr) {
					try {
						_loadedAssets[name] = JSON.parse(xhr.responseText);
					} catch (e) {
						_loadedAssets[name] = null;
						console.log('[ GL-WARN ] The resource "' + asset.src + '" wasn\'t parsed as JSON; the structure might be corrupt');
					}
				});
			}
		});

		infrastructure.then = function (cb) {
			if (_.isFunction(cb)) {
				if (loaded < files) {
					callback = cb;
				} else {
					cb(_loadedAssets);
				}
			}
		};

		setTimeout(function () {
			if (loaded < files) {
				console.log('[ GL-WARN ] It looks like not all the resources were loaded; forcing continuing.');
				console.log('[ GL-WARN ] The application will work incorrect.');
				files = 0;
				_onload();
			}
		}, 3 * 1000);
		return infrastructure;
	};

	return GL;
};