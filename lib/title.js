#!/usr/bin/env node

var path = require('path');

module.exports = function(filename)
{
	var str = filename;

	str = str.replace(/[\/\\](readme|index)(\.[^\/\\\.]*)?$/i, ''); // Use the directory name if the filename is readme/index.
	str = path.basename(str); // Use only the last part of the path as the title.
	str = str.replace(/^\.+/, ''); // Strip off any leading dots.
	str = str.replace(/\.[^\/\\\.]*$/, ''); // Remove the extension.
	str = str.replace(/[\s_-]+/g, ' ').replace(/(^\s+|\s+$)/, ''); // Turn _, -, and multiple spaces into single spaces.
	str = str.replace(/([a-z0-9-])([A-Z])/g, '$1 $2'); // Put a space after a lower case followed by an upper case.
	str = str.toLowerCase(); // Lower case everything.
	str = str.replace(/\b([a-z])/g, function(match) // Upper case the first letter of all words.
	{
		return match.toUpperCase();
	});

	return str || path.basename(filename) || filename;
};