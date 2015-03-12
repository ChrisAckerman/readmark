void function(){
	"use strict";

	window.readmark = {
		find: function(el)
		{
			if (typeof el === 'string') {
				el = document.querySelectorAll(el);
			} else if (!(el instanceof Array)) {
				el = [el];
			}

			return el;
		},

		getTop: function(el)
		{
			el = readmark.find(el)[0];

			var value = 0;

			while (el) {
				value += el.offsetTop;
				el = el.offsetParent;
			}

			return value;
		},

		triggerEvent: function(el, name)
		{
			el = readmark.find(el);

			var ev; // The custom event that will be created

			if (typeof name === 'string') {
				if (document.createEvent) {
					ev = document.createEvent("HTMLEvents");
					ev.initEvent(name, true, true);
				} else {
					ev = document.createEventObject();
					ev.eventType = name;
				}
			} else {
				ev = name;
			}

			ev.eventName = name;

			for (var i = 0, max = el.length; i < max; ++i) {
				if (document.createEvent) {
					canceled = !el[i].dispatchEvent(ev) || canceled;
				} else {
					canceled = !el[i].fireEvent("on" + ev.eventType, ev) || canceled;
				}
			}

			return canceled;
		},

		bindEvent: function(el, name, callback)
		{
			if (typeof window.addEventListener === 'undefined') return;

			el = readmark.find(el);

			for (var i = 0, max = el.length; i < max; ++i) {
				el[i].addEventListener(name, callback);
			}
		},

		unbindEvent: function(el, name, callback)
		{
			if (typeof window.removeEventListener === 'undefined') return;

			el = readmark.find(el);

			for (var i = 0, max = el.length; i < max; ++i) {
				if (callback) {
					el[i].removeEventListener(name, callback);
				} else {
					el[i].removeEventListener(name);
				}
			}
		},

		statusIcon: function(name, options)
		{
			var el = document.getElementById('status');
			if (!el) return;

			var container = el.getElementsByClassName('icons')[0];
			if (!container) return;
			
			var icons = Array.prototype.slice.call(el.getElementsByClassName('fa-' + name));
			var i;

			if (!options && options != null) {
				i = icons.length;

				while (i--) {
					container.removeChild(icons[i]);
				}

				if (container.getElementsByClassName('fa').length === 0) {
					el.style.display = 'none';
				}
			} else {
				options = Object(options);

				el.style.display = 'inline';

				if (icons.length === 0) {
					icons[0] = document.createElement('span');
					icons[0].className = "fa fa-" + name;
					container.appendChild(icons[0]);

					if (options.className != null) {
						icons[0].className += " " + options.className;
					}
				} else if (options.className != null) {
					icons[0].className = "fa fa-" + name + " " + options.className;
				}

				if (options.title != null) {
					icons[0].title = options.title;
				}
			}
		},

		fixExternalLinks: function()
		{
			var links = readmark.find('a[href]');

			for (var i = 0, max = links.length; i < max; ++i) {
				if (links[i].target) continue;
				if (!(/^([a-z]+:)?\/{2}/i).test(links[i].getAttribute('href'))) continue;

				links[i].target = '_blank';
			}
		},

		highlight: function()
		{
			if (typeof hljs === 'undefined') return;

			var blocks = readmark.find('pre code');

			for (var i = 0, max = blocks.length; i < max; ++i) {
				hljs.highlightBlock(blocks[i]);
			}
		},

		home: function()
		{
			if (!document.getElementById('home')) return;
			
			window.location = '/';
		},

		raw: function()
		{
			if (!document.getElementById('raw')) return;

			window.location = '?raw';
		},

		nodeModules: function()
		{
			if (!document.getElementById('modules')) return;

			window.location = './?modules';
		},

		toggleList: function()
		{
			if (!document.getElementById('ls')) return;

			if (window.location.search === '?ls') {
				window.location = './';
			} else {
				window.location = './?ls';
			}
		}
	};

	if (window.history.replaceState) {
		readmark.updateHash = function()
		{
			if (readmark.updateHash.hasOwnProperty('timeout')) {
				return;
			}

			readmark.updateHash.timeout = setTimeout(function()
			{
				delete readmark.updateHash.timeout;

				var h = readmark.find('h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]');
				var id = '';
				var scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;

				for (var i = 0, max = h.length; i < max; ++i) {
					if (readmark.getTop(h[i]) - 10 >= scrollTop) {
						break;
					}
					
					id = h[i].id.replace(/^#/, '');
				}

				if (window.location.hash.replace(/^#/, '') !== id) {
					window.history.replaceState(null, null, '#' + id);
				}
			}, 33);
		};
	} else {
		readmark.updateHash = function() {};
	}

	readmark.bindEvent(window, 'scroll', readmark.updateHash);

	readmark.bindEvent(window, 'click', function(ev)
	{
		ev = ev || window.event;
		if (ev.target.id === 'ls') {
			readmark.toggleList();
			ev.preventDefault();
		}
	});

	readmark.bindEvent(window, 'keydown', function(ev)
	{
		ev = ev || window.event;

		var c = ev.char ? ev.char : (ev.key ? ev.key : String.fromCharCode(ev.charCode || ev.which || ev.keyCode));
		//c = c.toLowerCase();

		if (c === 'h') {
			readmark.home();
		} else if (c === 'n') {
			readmark.nodeModules();
		} else if (c === 'r') {
			readmark.raw();
		} else if (c === 'l') {
			readmark.toggleList();
		} else {
			return;
		}

		ev.preventDefault();
	});

	readmark.fixExternalLinks();
	readmark.highlight();
}();