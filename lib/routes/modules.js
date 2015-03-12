#!/usr/bin/env node

"use strict";

var render = require('../render');
var get_modules = require('../get_modules');
var no_cache = require('../no_cache');

module.exports = function(req, res, next)
{
	if (!req.query.hasOwnProperty('modules')) {
		next();
		return;
	}
	
	get_modules(process.cwd(), function(err, pkgs)
	{
		if (err) {
			next();
			return;
		}
		
		var html;

		try {
			html = render('base', {
				title: 'Node Modules',
				generated: true,
				modules: {
					pkgs: pkgs
				}
			});
		} catch (err) {
			res.status(500).send('error rendering template');
			return;
		}

		no_cache(res);

		res.type('html').send(html);
	});
};