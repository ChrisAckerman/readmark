void function(){
	"use strict";

	window.readmark = {
		getTop: function(el)
		{
			var value = 0;

			while (el) {
				value += el.offsetTop;
				el = el.offsetParent;
			}

			return value;
		},

		triggerEvent: function(el, name)
		{
			var event; // The custom event that will be created

			if (document.createEvent) {
				event = document.createEvent("HTMLEvents");
				event.initEvent(name, true, true);
			} else {
				event = document.createEventObject();
				event.eventType = name;
			}

			event.eventName = name;

			if (document.createEvent) {
				return el.dispatchEvent(event);
			} else {
				return el.fireEvent("on" + event.eventType, event);
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

		highlight: function(el)
		{
			if (typeof hljs === 'undefined') return;

			var blocks = document.querySelectorAll('pre code');

			for (var i = 0, max = blocks.length; i < max; ++i) {
				hljs.highlightBlock(blocks[i]);
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

				var h = document.querySelectorAll('h1[id],h2[id],h3[id],h4[id],h5[id],h6[id]');
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

	if (window.addEventListener) {
		window.addEventListener('scroll', readmark.updateHash);
		window.addEventListener('click', function(event)
		{
			if (event.target.id === 'ls') {
				if (window.location.search === '?ls') {
					window.location = './';
				} else {
					window.location = './?ls';
				}
			}
		});
	}

	readmark.highlight();
}();