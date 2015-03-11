#!/usr/bin/env node

"use strict";

var glob = require('glob');
var normalize_pkg = require('./normalize_pkg');
var path = require('path');

module.exports = function(dir, callback)
{
	glob(path.join(dir, 'node_modules/*/package.json'), function(err, files)
	{
		var pkgs = [];

		try {
			for (var i = 0, max = files.length; i < max; ++i) {
				pkgs.push(normalize_pkg(require(files[i])));
			}
		} catch (err) {
			callback(err);
			return;
		}

		callback(null, pkgs);
	});
};