#!/usr/bin/env node

"use strict";

var md_ext = require('../md_ext');
var fs = require('fs');

var rx = new RegExp('^(index|readme)\\.(' + md_ext.list.join('|') + ')$', 'i');

module.exports = function(req, res, next)
{
	findIndex('.' + req.path, function(err, index)
	{
		if (err) {
			next();
		} else if (index) {
			res.redirect(req.path + index);
		} else {
			res.redirect(req.path + '?ls');
		}
	});
};

function findIndex(dir, callback)
{
	fs.readdir(dir, function(err, files)
	{
		if (err) {
			callback(err);
			return;
		}

		for (var i = 0, max = files.length; i < max; ++i) {
			if (rx.test(files[i])) {
				callback(null, files[i]);
				return;
			}
		}

		callback(null, null);
	});
}