#! /usr/bin/env node

console.log("in index.js: ", process.argv)

var run = {}
module.exports = run

run.translator = require('./translator')
