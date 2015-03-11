#!/usr/bin/env node

var readmark = global.readmark;
var glob = require('glob');
var fs = require('fs');
var path = require('path');

readmark.views = {};

glob(__dirname + '/../views/**/*.mustache', function(err, files)
{
	var key;

	for (var i = 0, max = files.length; i < max; ++i) {
		key = path.relative(__dirname + '/../views', files[i]).replace(/\.mustache$/, '');
		readmark.views[key] = fs.readFileSync(files[i], 'utf8');
	}
});

module.exports = readmark.views;