#!/usr/bin/env node

"use strict";

var less = require('less');
var resolve = require('../resolve');
var fs = require('fs');
var path = require('path');

module.exports = function(req, res, next)
{
	fs.readFile(req.filename, 'utf8', function(err, text)
	{
		if (err) {
			next();
			return;
		}

		less.render(text, {
			paths: [path.dirname(req.filename)],
			filename: path.basename(req.filename)
		},
		function(err, rendered)
		{
			if (err) {
				next(err);
			} else {
				res.type('css').send(rendered.css);
			}
		});
	});
};