#!/usr/bin/env node

"use strict";

var less = require('less');
var resolve = require('../resolve');
var no_cache = require('../no_cache');
var fs = require('fs');
var path = require('path');

module.exports = function(req, res, next)
{
	var filename = resolve(req.path);

	fs.readFile(filename, 'utf8', function(err, text)
	{
		if (err) {
			next();
			return;
		}

		less.render(text, {
			paths: [path.dirname(filename)],
			filename: path.basename(filename)
		},
		function(err, rendered)
		{
			if (err) {
				next(err);
			} else {
				if (req.path.substr(0, 10) === '/readmark/') {
					no_cache(res);
				}
				
				res.type('css').send(rendered.css);
			}
		});
	});
};