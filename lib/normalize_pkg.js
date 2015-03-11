#!/usr/bin/env node

"use strict";

module.exports = function(pkg)
{
	if (!(pkg instanceof Object)) {
		return pkg;
	}

	var normal = {
		name: pkg.name == null ? '' : pkg.name,
		description: pkg.description == null ? '' : pkg.description,
		version: pkg.version == null ? '' : pkg.version,
		url: '',
		author: {
			name: '',
			url: ''
		}
	};

	if (pkg.homepage) {
		normal.url = pkg.homepage;
	} else if (pkg.repository.url) {
		normal.url = pkg.repository.url;
	}

	normal.url = fix_git_url(normal.url);

	var author = pkg.author || pkg.maintainer;

	if (author) {
		if (typeof author === "string") {
			var match = author.match(/^\s*([^<(]+?)\s*(?:<([^\]]+)>)?\s*(?:\(([^)]+)\))?$/);
			if (!match) {
				normal.author.name = author;
			} else {
				normal.author.name = match[1];
				if (match[2]) {
					normal.author.url = 'mailto:' + match[2];
				} else if (match[3]) {
					normal.author.url = match[3];
				}
			}
		} else {
			normal.author.name = author.name;
			if (author.url) {
				normal.author.url = author.email ? 'mailto:' + author.email : author.url;
			}
		}

		if (normal.author.url) {
			normal.author.url = normal.author.url.replace(/^mailto:((?:git|https?):)/, '$1');
			normal.author.url = fix_git_url(normal.author.url);

			if (normal.author.url === pkg.url) {
				normal.author.url = '';
			}
		}

		if (!normal.author.name) {
			normal.author = '';
		}
	} else {
		normal.author = '';
	}

	return normal;
};

function fix_git_url(url)
{
	if (typeof url === 'string') {
		url = url.replace(/^git:/, 'https:');
	}

	return url;
}