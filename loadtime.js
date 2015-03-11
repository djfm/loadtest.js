#!/usr/bin/env phantomjs

/* global phantom */

var args = require('system').args;

var url = args[1];

if (!url) {
    console.log('null: -1');
    phantom.exit(1);
}

var page = require('webpage').create();
var start = Date.now();

page.viewportSize = {
  width: 1280,
  height: 1024
};

console.log('start: ' + url);

page.open(url, function(status) {
    if (status === "success") {
        var took = Date.now() - start;
        console.log(url + ": " + took);
    } else {
        console.log(url + ": -1");
    }
    phantom.exit(0);
});
