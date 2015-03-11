#!/usr/bin/env node

var normalize_pkg = require('./normalize_pkg');

module.exports = normalize_pkg(require('../package.json'));