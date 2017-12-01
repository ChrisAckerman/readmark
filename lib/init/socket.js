#!/usr/bin/env node

"use strict";

var readmark = global.readmark;
var socketio = require('socket.io');
var chokidar = require('chokidar');
var marked = require('marked');
var mustache = require('mustache');
var open = require('open');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var io = readmark.io = socketio(readmark.server);
var watchers = {};
var autoopen = true;

io.on('connection', onConnection);
readmark.on('closing', onClosing);

readmark.server.on('listening', function()
{
	var address = readmark.server.address();
	var url = 'http://' + address.address + ':' + address.port;
	
	console.log(url);
	
	setTimeout(function()
	{
		if (autoopen) {
			console.log('Opening a new browser session.');
			open(url);
		}
		
	}, 1500);
});

function onConnection(socket)
{
	/* jshint validthis: true */

	readmark.log('connect');
	socket.on('init', onInit.bind(this, socket));
}

function onInit(socket, filename, key)
{
	/* jshint validthis: true */

	if (!verifyKey(key)) {
		readmark.log('key mismatch');
		return;
	}

	var watchable = !(/\?/).test(filename);

	filename = path.resolve('.' + filename.replace(/\?.*$/, '')) || '/';

	readmark.log('init', filename);

	if (watchable) {
		var watcher = addWatcher(filename);
		watcher.on('add', onUpdate.bind(this, socket, filename));
		watcher.on('change', onUpdate.bind(this, socket, filename));
	}

	socket.on('disconnect', onDisconnect.bind(this, filename));

	if (key) {
		if (autoopen) {
			console.log('Reconnected to existing browser sessions.');
			autoopen = false;
		}

		if (watchable) {
			onUpdate.call(this, socket, filename);
		} else {
			socket.emit('update');
		}
	} else {
		socket.emit('key', generateKey());
		readmark.log('key generated');
	}
}

function onUpdate(socket, filename)
{
	readmark.log('update', filename);

	var text;
	var html;
	
	try {
		text = fs.readFileSync(filename, 'utf8');
	} catch (err) {
		return;
	}

	if (/[\/\\][^\/\\\.]+$/.test(filename)) {
		html = mustache.render('{{text}}', { text: text });
	} else {
		html = marked(text);
		html = html.replace(/(<h\d[^>]*\sid=['"])(.*?)(['"])/g, function(match, p1, p2, p3) {
			return p1 + p2.replace(/-+$/, '') + p3;
		});
	}

	socket.emit('update', html);
}

function onDisconnect(filename)
{
	readmark.log('disconnect', filename);

	if (!(/\?/).test(filename)) {
		removeWatcher(filename);
	}
}

function onClosing()
{
	io.close();
}

function addWatcher(filename)
{
	var watcher;

	if (!watchers.hasOwnProperty(filename)) {
		readmark.log('watching', filename);

		watcher = watchers[filename] = {
			watcher: chokidar.watch(filename, {
				persistent: true,
				usePolling: true,
				ignoreInitial: true
			}),
			count: 0
		};
	} else {
		watcher = watchers[filename];
	}

	++watcher.count;

	return watcher.watcher;
}

function removeWatcher(filename)
{
	if (!watchers.hasOwnProperty(filename)) {
		return;
	}

	var watcher = watchers[filename];
	--watcher.count;

	if (watcher.count === 0) {
		readmark.log('unwatching', filename);

		watcher.watcher.close();
		delete watchers[filename];
	}
}

function verifyKey(key)
{
	if (key == null) return true;

	var parts = key.split(':', 2);
	var check = generateKey(parts[1]);

	return key === generateKey(parts[1]);
}

function generateKey(seed)
{
	if (seed == null) {
		seed = parseInt(Math.random() * 1000000000, 16);
	}

	return hash(seed, process.cwd()) + ':' + seed;
}

function hash(seed, value)
{
	return crypto.createHash('sha512').update(seed + '\n' + value, 'utf8').digest('hex');
}