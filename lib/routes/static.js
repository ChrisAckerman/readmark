#!/usr/bin/env node

"use strict";

var resolve = require('../resolve');
var no_cache = require('../no_cache');
var fs = require('fs');

module.exports = function(req, res, next)
{
	var filename = resolve(req.path);

	if (req.path.substr(0, 10) === '/readmark/') {
		no_cache(res);
	}

	res.sendFile(filename);
};