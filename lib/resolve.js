#!/usr/bin/env node

"use strict";

var fs = require('fs');
var path = require('path');

module.exports = function(filename)
{
	if (filename.substr(0, 10) === '/readmark/') {
		return path.join(__dirname, '..', filename.substr(1));
	} else {
		return path.resolve('.' + filename);
	}
};