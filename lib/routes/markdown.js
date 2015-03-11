#!/usr/bin/env node

"use strict";

var marked = require('marked');
var resolve = require('../resolve');
var render = require('../render');
var title = require('../title');
var no_cache = require('../no_cache');
var fs = require('fs');

module.exports = function(req, res, next)
{
	var filename = resolve(req.path);

	fs.readFile(filename, 'utf8', function(err, text)
	{
		if (err) {
			next();
			return;
		}

		var html;

		try {
			html = marked(text);
			html = render('base', {
				title: title(filename),
				markdown: {
					html: html
				}
			});
		} catch (err) {
			next(err);
			return;
		}

		if (req.path.substr(0, 3) === '/_/') {
			no_cache(res);
		}

		res.type('html').send(html);
	});
};