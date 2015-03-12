#!/usr/bin/env node

"use strict";

var readmark = global.readmark;
var md_ext = require('../md_ext');
var resolve = require('../resolve');
var check_file_type = require('../check_file_type');
var no_cache = require('../no_cache');
var fs = require('fs');

var handlers = readmark.handlers = {
	md: require('../routes/markdown'),
	less: require('../routes/less'),
	txt: require('../routes/text')
};

readmark.use(function(req, res, next)
{
	req.pathname = decodeURIComponent(req.path.replace(/\+/g, ' '));
	next();
});
readmark.get('/', require('../routes/credits'));
readmark.get('/', require('../routes/modules'));
readmark.get(/\/$/, require('../routes/ls'));
readmark.get(/\/$/, require('../routes/index'));
readmark.use(function(req, res, next)
{
	if (req.path.substr(0, 10) !== '/readmark/') {
		no_cache(res);
	}

	req.filename = resolve(req.pathname);

	next();
});
readmark.use(function(req, res, next)
{
	var type = check_file_type(req.filename);
	console.log(req.filename);

	if (!type) {
		next();
		return;
	}

	fs.exists(req.filename, function(exists)
	{
		if (!exists) {
			next();
			return;
		}

		if (!req.query.hasOwnProperty('raw')) {
			if (type.friendly === 'markdown') {
				handlers.md(req, res, next);
				return;
			} else if (type.friendly === 'less') {
				handlers.less(req, res, next);
				return;
			} else if (type.friendly === 'text') {
				handlers.txt(req, res, next);
				return;
			}

			res.type(type.mime);
		} else {
			if (type.type === 'text') {
				res.type('text/plain; charset=UTF-8');
			} else {
				res.type(type.mime);
			}
		}

		res.sendFile(req.filename);
	});
});