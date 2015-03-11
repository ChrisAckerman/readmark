#!/usr/bin/env node

"use strict";

var pkg = require('./pkg');
var views = require('./init/views');
var mustache = require('mustache');
var assign = require('lodash').assign;
var fs = require('fs');
var path = require('path');

var node_modules = fs.existsSync('./node_modules');

function render(view, model)
{
	model = assign({
		pkg: pkg,
		node_modules: node_modules
	}, model);

	return mustache.render(views[view], model, views);
}

module.exports = render;