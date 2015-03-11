#!/usr/bin/env node

"use strict";

exports.list = [
	'md',
	'markdown',
	'mdown',
	'mkdn',
	'mkd',
	'mdwn',
	'mdtxt',
	'mdtext',
	'text'
];

exports.rx = new RegExp('\\.(' + exports.list.join('|') + ')$');