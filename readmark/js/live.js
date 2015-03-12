void function(){
	"use strict";
	
	var page = window.location.pathname + window.location.search;
	var navigating = false;
	var connected = false;

	readmark.io = io.connect(window.location.origin, {
		'reconnection': true,
		'reconnectionDelay': 250,
		'reconnectionDelayMax': 250,
		'reconnectionAttempts': Infinity,
	});
	
	readmark.live = document.getElementById('live');
	var instance_key = null;
	var reconnect_timeout = null;

	readmark.io.on('key', function(key)
	{
		if (!instance_key) {
			instance_key = key;
		} 
	});

	readmark.io.on('update', function(html)
	{
		if (readmark.live) {
			readmark.live.innerHTML = html;
			readmark.fixExternalLinks();
			readmark.highlight();
			readmark.updateHash();

			status('update');
		}
	});

	readmark.io.on('connect', function()
	{
		connected = true;
	});

	readmark.io.on('reconnect', function()
	{
		clearTimeout(reconnect_timeout);

		readmark.io.emit('init', page, instance_key);

		window.focus();
	});

	readmark.io.on('disconnect', function()
	{
		connected = false;

		if (navigating) {
			return;
		}

		status('disconnect');

		reconnect_timeout = setTimeout(function()
		{
			status('timeout');
		}, 300000);
	});

	readmark.io.emit('init', page, instance_key);

	readmark.bindEvent(window, 'beforeunload', function()
	{
		navigating = true;
		readmark.io.close();
	});

	function status(type)
	{
		clearTimeout(status.timeout);
		
		if (type === 'disconnect') {
			readmark.statusIcon('refresh', false);
			readmark.statusIcon('exclamation-triangle', {
				className: 'warning',
				title: 'Disconnected. Restart the server to resume live updates.'
			});
		} else if (type === 'timeout') {
			readmark.statusIcon('refresh', false);
			readmark.statusIcon('exclamation-triangle', {
				className: 'error',
				title: 'Disconnected. Restart the server and refresh this window to resume live updates.'
			});
		} else if (type === 'connect') {
			readmark.statusIcon('exclamation-triangle', false);
			readmark.statusIcon('refresh', false);
		} else if (type === 'update') {
			readmark.statusIcon('exclamation-triangle', false);
			readmark.statusIcon('refresh', {
				className: 'success',
				title: 'Live update recieved.'
			});
			status.timeout = setTimeout(function()
			{
				status('connect');
			}, 5000);
		}
	}
}();