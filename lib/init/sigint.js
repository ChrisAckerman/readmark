#!/usr/bin/env node

"use strict";

var readmark = global.readmark;
var readline = require('readline');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.on('SIGINT', function()
{
	process.emit('SIGINT');
});

process.on('SIGINT', function()
{
	readmark.close();

	setTimeout(function()
	{
		console.log('(^C again to quit)');
	}, 200);
});