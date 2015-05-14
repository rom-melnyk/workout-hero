var modUtils = require('../utils/utils'),
	modHandler = require('../handler/handler'),
	modTick = require('../timeline/tick'),
	modTimeline = require('../timeline/timeline'),
	modTimer = require('../timer/timer'),
	modParser = require('../timeline/parser'),
	modbeatHandler = require('../handler/beat-handler'),
	CFG = require('./config');

var WH = window.WH = {};
modUtils(WH);
modHandler(WH);
modTick(WH);
modTimeline(WH);
modTimer(WH);
modParser(WH);
modbeatHandler(WH);

// ---------------------------------- init ----------------------------------
new WH.Timeline(CFG.SYSTEM.beatCommonName);
// --------------------------------------------------------------------------

module.exports = WH;