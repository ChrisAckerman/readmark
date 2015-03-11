#!/usr/bin/env node

"use strict";

var fs = require('fs');
var path = require('path');

var aliases = [
	{ request: 'github-markdown.css', real: 'node_modules/github-markdown-css/github-markdown.css' },
	{ request: 'marked.js', real: 'node_modules/marked/marked.min.js'},
	{ request: /^font-awesome\//,
		real: function(filename)
		{
			return 'node_modules/' + filename;
		}
	}
];

module.exports = function(filename)
{
	if (filename.substr(0, 10) === '/readmark/') {
		return path.join(__dirname, '..', translate(filename.substr(10)));
	} else {
		return path.resolve('.' + filename);
	}
};

function translate(filename)
{
	var request;
	var real;
	var match;

	for (var i = 0, max = aliases.length; i < max; ++i) {
		request = aliases[i].request;
		real = aliases[i].real;

		if (request instanceof RegExp) {
			match = filename.match(request);
			if (match) {
				if (real instanceof Function) {
					return real(filename, match);
				} else {
					return real;
				}
			}
		} else if (request === filename) {
			if (real instanceof Function) {
				return real(filename);
			} else {
				return real;
			}
		}
	}

	return 'readmark/' + filename;
}