#!/usr/bin/env node

"use strict";

var path = require('path');

global.readmark = require('./lib/init/app');
//global.readmark.log = console.log.bind(console);

require('./lib/init/server');
require('./lib/init/sigint');
require('./lib/init/views');
require('./lib/init/routes');
require('./lib/init/socket');

var fs = require('fs');

if (module === require.main) {
	if (fs.existsSync('./readmark.js')) {
		require(path.resolve('./readmark.js'));
	} else {
		readmark.listen(process.argv[2]<<0 || 8080, '127.0.0.1');
	}

	require('./lib/init/404');
}

module.exports = readmark;