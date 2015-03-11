#!/usr/bin/env node

"use strict";

var express = require('express');

module.exports = express();
module.exports.set('views', process.cwd());
module.exports.log = function() {};