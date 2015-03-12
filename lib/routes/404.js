#!/usr/bin/env node

"use strict";

var render = require('../render');
var no_cache = require('../no_cache');

module.exports = function(req, res, next)
{
	var html;

	try {
		html = render('base', {
			title: 'Error 404',
			generated: true,
			error: {
				code: 404,
				reason: '"' + req.path + '" was not found.'
			}
		});
	} catch (err) {
		res.status(500).send('error rendering template');
		return;
	}

	no_cache(res);

	res.type('html').status(404).send(html);
};