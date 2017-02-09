#! /usr/bin/env node

console.log("in index.js, see cmd line params: ", process.argv)

var run = {}
module.exports = run

run.translator    = require('./translator')
run.gcodeTrimmer  = require('./gcodeTrimmer')
