#!/usr/bin/env node

"use strict";

var mimetype = require('mime');
var md_ext = require('./md_ext');

module.exports = function(filename)
{
	var mime;

	if (md_ext.rx.test(filename)) {
		mime = 'text/x-markdown';
	} else if (/(^|\/)[^\/\.]+$/.test(filename)) {
		mime = 'text/plain';
	} else {
		mime = mimetype.lookup(filename).split(';', 2)[0];
	}

	var parts = mime.split(/[\/]/g, 2);

	var info = {
		mime: mime,
		type: parts[0],
		subtype: parts[1],
		friendly: parts[1]
	};

	if (info.subtype === 'html') {
		info.mime += '; charset=UTF-8';
		info.icon = 'file-code-o';
	} else if (info.subtype === 'css' || info.subtype === 'less') {
		info.mime += '; charset=UTF-8';
		info.icon = 'file-o';
	} else if (info.subtype === 'x-markdown') {
		info.friendly = 'markdown';
		info.icon = 'file-code-o';
	} else if (info.type === 'image') {
		info.friendly = 'image';
		info.icon = 'file-image-o';
	} else if (info.type === 'application') {
		if (info.subtype !== 'javascript' && info.subtype !== 'json') {
			info.meme = 'application/octet-stream';
			info.subtype = 'octet-stream';
			info.friendly = 'binary';
		}
		info.icon = 'file-o';
	} else {
		info.mime = 'text/plain; charset=UTF-8';
		info.subtype = 'plain';
		info.friendly = 'text';
		info.icon = 'file-text-o';
	}

	return info;
};