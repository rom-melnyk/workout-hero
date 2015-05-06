var baseModule = require('./base'),
	shadersModule = require('./shaders'),
	loaderModule = require('./loader'),
	figureModule = require('./figure'),
	framebufferModule = require('./framebuffer'),
	drawModule = require('./draw');

window.GL = GL= {};

baseModule(GL);
shadersModule(GL);
loaderModule(GL);
figureModule(GL);
framebufferModule(GL);
drawModule(GL);
