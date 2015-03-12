#!/usr/bin/env nodef

"use strict";

var mime = require('mime');
var render = require('../render');
var md_ext = require('../md_ext');
var check_file_type = require('../check_file_type');
var no_cache = require('../no_cache');
var fs = require('fs');
var path = require('path');

module.exports = function(req, res, next)
{
	if (!req.query.hasOwnProperty('ls')) {
		next();
		return;
	}

	if (req.path.substr(-1) !== '/') {
		res.redirect(req.path.replace(/[^\/]*$/, '') + '?ls');
		return;
	}

	var dir = req.path;
	var parent = dir.replace(/([^\/]+\/)?$/, '');

	findFiles(dir, function(err, files)
	{
		if (err) {
			next();
			return;
		}

		dir = dir.slice(0, -1);

		var html;

		try {
			html = render('base', {
				title: dir || '/',
				generated: true,
				dir: dir,
				parent: parent + '?ls',
				ls: {
					files: files
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

function findFiles(dir, callback)
{
	fs.readdir('.' + dir, function(err, files)
	{
		if (err) {
			callback(err);
			return;
		}

		var items = [];

		for (var i = 0, max = files.length; i < max; ++i) {

			if (path.basename(files[i])[0] === '.') {
				continue;
			}

			if (fs.statSync('.' + dir + files[i]).isDirectory()) {
				items.push({
					name: files[i],
					href: dir + files[i] + '/?ls',
					icon: 'folder',
					file: 0
				});

				continue;
			}

			var type = check_file_type(files[i]);
			if (!type) continue;

			items.push({
				name: files[i],
				href: dir + files[i],
				icon: type.icon,
				file: 1
			});
		}

		items.sort(function(a, b)
		{
			return (a.file - b.file) || a.name.localeCompare(b.name);
		});

		callback(null, items);
	});
}