var CFG = require('../base/config'),
	UI = require('../ui/ui');

/**
 * A module for Browserify/Watchify
 */
module.exports = function (WH) {
	WH.beatVisualizer = {
		chunkToReuse0: null,
		chunkToReuse1: null,
		lastTickAdded: 0,
		offset: 0
	};

	function __createChunk () {
		return document.createElement('span');
	}

	/**
	 * Adds HTML chunks representing beats between offsets `from` and `to`
	 * @param {Number} to				offset
	 */
	WH.beatVisualizer.add = function (to) {
		var timeline = WH.Timeline.get(CFG.SYSTEM.beatCommonName),
			tick = timeline.ticks[this.lastTickAdded];

		if (!tick) return;

		do {
			if (!this.chunkToReuse0) this.chunkToReuse0 = __createChunk();
			if (!this.chunkToReuse1) this.chunkToReuse1 = __createChunk();

			this.chunkToReuse0.className = 'chunk';
			this.chunkToReuse1.className = 'chunk';

			this.chunkToReuse0.numWidth = (tick.offset - this.offset)
				/ 1000 * CFG.UI.beatVisualizer.pixelsPerSecond - CFG.UI.beatVisualizer.beatWidth;
			this.chunkToReuse0.style.width = this.chunkToReuse0.numWidth + 'px';

			this.chunkToReuse1.numWidth =  CFG.UI.beatVisualizer.beatWidth;
			this.chunkToReuse1.style.width =  this.chunkToReuse1.numWidth + 'px';

			if (tick.handler) {
				this.chunkToReuse1.className += ' beat';
			}
			UI.domElBeatVisualizer.appendChild(this.chunkToReuse0);
			UI.domElBeatVisualizer.appendChild(this.chunkToReuse1);
			this.chunkToReuse0 = null;
			this.chunkToReuse1 = null;

			this.offset = tick.offset;
			this.lastTickAdded++;
			tick = timeline.ticks[this.lastTickAdded];
		} while (tick && this.offset < to);
	};

	WH.beatVisualizer.move = function (offset) {
		var chunk0 = UI.domElBeatVisualizer.children[0],
			chunk1 = UI.domElBeatVisualizer.children[1];

		if (!UI.domElBeatVisualizer.numLeft) UI.domElBeatVisualizer.numLeft = 0;

		if (-UI.domElBeatVisualizer.numLeft > chunk0.numWidth + chunk1.numWidth) {
			this.chunkToReuse0 = UI.domElBeatVisualizer.removeChild(chunk0);
			this.chunkToReuse1 = UI.domElBeatVisualizer.removeChild(chunk1);
			UI.domElBeatVisualizer.numLeft = 0;
			UI.domElBeatVisualizer.style.left = '0px';
		}

		UI.domElBeatVisualizer.numLeft -= offset / 1000 * CFG.UI.beatVisualizer.pixelsPerSecond;
		UI.domElBeatVisualizer.style.left = UI.domElBeatVisualizer.numLeft + 'px';
	}
};
