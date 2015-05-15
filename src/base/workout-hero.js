var modUtils = require('../utils/utils'),
	modHandler = require('../handler/handler'),
	modTick = require('../timeline/tick'),
	modTimeline = require('../timeline/timeline'),
	modTimer = require('../timer/timer'),
	modParser = require('../timeline/parser'),
	modUI = require('../ui/ui'),
	CFG = require('./config');

var WH = window.WH = {};
modUtils(WH);
modHandler(WH);
modTick(WH);
modTimeline(WH);
modTimer(WH);
modParser(WH);

WH.init = function () {
	new WH.Timeline(CFG.SYSTEM.beatCommonName);
	modUI.init();
};

module.exports = WH;