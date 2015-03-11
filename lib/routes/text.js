#!/usr/bin/env node

"use strict";

var render = require('../render');
var resolve = require('../resolve');
var title = require('../title');
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

		var name = title(filename);
		var html;

		try {
			html = render('base', {
				title: name,
				text: {
					title: name,
					text: text
				}
			});
		} catch (err) {
			res.status(500).send('error rendering template');
			return;
		}

		res.type('html').send(html);
	});
};