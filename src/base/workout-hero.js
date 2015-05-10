var modUtils = require('../utils/utils'),
	modHandler = require('../handler/handler'),
	modTick = require('../timeline/tick'),
	modTimeline = require('../timeline/timeline'),
	modTimer = require('../timer/timer'),
	modParser = require('../timeline/parser');

var WH = window.WH = {};
modUtils(WH);
modHandler(WH);
modTick(WH);
modTimeline(WH);
modTimer(WH);
modParser(WH);

module.exports = WH;