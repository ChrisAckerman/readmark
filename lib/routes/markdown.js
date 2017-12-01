#!/usr/bin/env node

"use strict";

var marked = require('marked');
var resolve = require('../resolve');
var render = require('../render');
var title = require('../title');
var fs = require('fs');

module.exports = function(req, res, next)
{
	fs.readFile(req.filename, 'utf8', function(err, text)
	{
		if (err) {
			next();
			return;
		}

		var html;

		try {
			html = marked(text);
			html = html.replace(/(<h\d[^>]*\sid=['"])(.*?)(['"])/g, function(match, p1, p2, p3) {
				return p1 + p2.replace(/-+$/, '') + p3;
			});
			html = render('base', {
				title: title(req.filename),
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