#!/usr/bin/env node

"use strict";

var readmark = global.readmark;
var route = require('../routes/404');

readmark.use(function(req, res, next)
{
	if (req.accepts('html')) {
		route(req, res, next);
	} else {
		next();
	}
});

readmark.use(function(req, res, next)
{
	res.type('text').status(404).send('File Not Found');
});