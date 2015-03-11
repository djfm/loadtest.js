#!/usr/bin/env node

var spawn = require('child_process').spawn;
var path = require('path');

var url = process.argv[2];
var stress = process.argv[3] || 1;

function usage() {
    return 'Usage: multiload.js http://some.url [parallel_connections=1]';
}

if (!url) {
    console.log('Missing URL argument.');
    console.log(usage());
    process.exit(1);
}

console.log('Going to stress %s with %d connection(s)', url, stress);

var phantomJSPath = path.join(__dirname, 'node_modules', '.bin', 'phantomjs');
var loadtimeScript = path.join(__dirname, 'loadtime.js');

var resultExp = /(.*?):\s+(-?\d+)$/;
var startExp = /^start: (.*?)$/;

var ok = 0, total = 0, okTime = 0, parallel = 0, maxParallelReached = 0;

for (var i = 0; i < stress; ++i) {
    ++total;
    spawn(phantomJSPath, [loadtimeScript, url])
        .stdout.on('data', function (data) {
            data = data.toString().trim();

            var start = startExp.exec(data);
            var result = resultExp.exec(data);

            if (start) {
                console.log('Started request to %s', start[1]);
                ++parallel;
                if (parallel > maxParallelReached) {
                    maxParallelReached = parallel;
                }
            } else if (result) {
                --parallel;
                var t = +result[2];
                if (t < 0) {
                    console.log('ERRORED: %s', result[1]);
                } else {
                    ++ok;
                    okTime += t;
                    console.log('%s took %dms to load', result[1], t);
                }
            }
        });
}

process.on('exit', function () {
    console.log(
        '\nRan %s queries (%d parallel), average OK time %d (failures: %d)',
        total,
        maxParallelReached,
        Math.round(okTime / ok),
        total - ok
    );
});
