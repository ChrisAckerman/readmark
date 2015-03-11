#!/usr/bin/env node

"use strict";

var render = require('../render');
var get_modules = require('../get_modules');
var path = require('path');

var cache = null;

module.exports = function(req, res, next)
{
	if (!req.query.hasOwnProperty('credits')) {
		next();
		return;
	}
	
	get_credits(function(err, pkgs)
	{
		if (err) {
			next();
			return;
		}
		
		var html;

		try {
			html = render('base', {
				title: 'Credits',
				credits: {
					pkgs: pkgs
				}
			});
		} catch (err) {
			res.status(500).send('error rendering template');
			return;
		}

		res.type('html').send(html);
	});
};

function get_credits(callback)
{
	if (cache) {
		callback(null, cache);
		return;
	}

	get_modules(path.join(__dirname, '../..'), function(err, pkgs)
	{
		if (err) {
			callback(err);
		} else {
			cache = pkgs;
			callback(null, pkgs);
		}
	});
}