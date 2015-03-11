#!/usr/bin/env node

var path = require('path');

module.exports = function(filename)
{
	var str = filename.replace(/\/(readme|index)(\.[^\/\.]*)?$/i, '');
	str = path.basename(str).replace(/\.[^\/\.]*$/, '');
	str = str.replace(/[\s_]+/g, ' ').replace(/(^\s+|\s+$)/, '');
	str = str.replace(/([a-z0-9-])([A-Z])/g, '$1 $2');
	str = str.toLowerCase();
	str = str.replace(/(^|\s)([a-z])/g, function(match, p1, p2)
	{
		return p1 + p2.toUpperCase();
	});

	return str || 'Readmark';
};