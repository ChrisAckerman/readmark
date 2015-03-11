#!/usr/bin/env node

"use strict";

var readmark = global.readmark;
var md_ext = require('../md_ext');
var resolve = require('../resolve');
var check_file_type = require('../check_file_type');
var fs = require('fs');

var handler = {
	md: require('../routes/markdown'),
	less: require('../routes/less'),
	txt: require('../routes/text'),
	static: require('../routes/static')
};

readmark.get('/', require('../routes/credits'));
readmark.get('/', require('../routes/modules'));
readmark.get(/\/$/, require('../routes/ls'));
readmark.get(/\/$/, require('../routes/index'));
readmark.use(function(req, res, next)
{
	var filename = resolve(req.path);
	var type = check_file_type(filename);

	if (!type) {
		res.status(403).send('Disallowed File Type');
	}

	fs.exists(filename, function(exists)
	{
		if (!exists) {
			next();
			return;
		}

		if (type.friendly === 'markdown') {
			handler.md(req, res, next);
		} else if (type.friendly === 'less') {
			handler.less(req, res, next);
		} else if (type.friendly === 'text') {
			handler.txt(req, res, next);
		} else {
			res.type(type.mime);
			handler.static(req, res, next);
		}
	});
});