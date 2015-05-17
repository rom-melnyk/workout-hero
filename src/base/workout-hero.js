var modUtils = require('../utils/utils'),
	//modHandler = require('./handler'),
	//modTick = require('../timeline/tick'),
	modTimeline = require('../timeline/timeline'),
	modTimer = require('../timer/timer'),
	//modParser = require('../timeline/parser'),
	modBeatVisualizer = require('../timeline/beat-visualizer'),
	UI = require('../ui/ui'),
	CFG = require('./config');

var WH = window.WH = {};
//modUtils(WH);
//modHandler(WH);
//modTick(WH);
WH.Timeline = modTimeline;
WH.Timer = modTimer;
//modParser(WH);
modBeatVisualizer(WH);

WH.init = function () {
	var beat = new WH.Timeline(CFG.SYSTEM.beatCommonName);
	beat.on('tick', UI.animateCurrentBeatIndicator);

	WH.Timer.timelines.push(beat);
	WH.Timer.on('update', UI.updateReminder);
	WH.Timer.on('update', function () {
		WH.beatVisualizer.move(40);
	});
	//WH.beatVisualizer.move(40);

	UI.init();
};

module.exports = WH;