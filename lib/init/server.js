#!/usr/bin/env node

var http = require('http');

var readmark = global.readmark;
var closing = false;
var sockets = [];

readmark.server = http.createServer(readmark);

readmark.listen = function()
{
	this.server.listen.apply(this.server, arguments);

	return this;
};

readmark.close = function()
{
	if (closing) {
		process.exit(0);
	}

	closing = true;
	console.log('Shutting down... ');

	this.server.close();
	this.emit('closing');

	var i = sockets.length;
	while (i--) {
		sockets[i].setTimeout(100);
	}

	return this;
};

readmark.server.on('connection', function(socket)
{
	sockets.push(socket);

	socket.on('close', function()
	{
		sockets.splice(sockets.indexOf(socket), 1);
	});
});

readmark.server.on('close', function()
{
	process.exit(0);
});