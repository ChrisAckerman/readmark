#!/usr/bin/env node

"use strict";

var marked = require('marked');
var resolve = require('../resolve');
var render = require('../render');
var title = require('../title');
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

		res.type('html').send(html);
	});
};