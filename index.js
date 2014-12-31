'use strict';

var gulp = require('gulp'),
    fs = require('fs'),
    React = require('react-tools'),
    istanbul = require('istanbul'),
    mocha = require('gulp-mocha'),
    sourceStore = istanbul.Store.create('memory'),

getDataURI = function (sourceMap) {
    return 'data:application/json;base64,' + new Buffer(unescape(encodeURIComponent(sourceMap)), 'binary').toString('base64');
},

fixSourceMapContent = function (sourceMap, source) {
    var map = JSON.parse(sourceMap);

    map.sourcesContent = [source];
    return JSON.stringify(map);
},

// Never use node-jsx or other transform in your testing code!
initIstanbulHookHack = function (options, reactOpts, coffeeOpts) {
    var Module = require('module'),
        instrumenter = new istanbul.Instrumenter(options);

    global[options.coverageVariable] = {};
    sourceStore.dispose();

    Module._extensions['.js'] = function (module, filename) {
        var src = fs.readFileSync(filename, {encoding: 'utf8'}),
            tmp;

        if (filename.match(/\.jsx$/)) {
            try {
                src = React.transform(src, reactOpts);
            } catch (e) {
                throw new Error('Error when transform jsx ' + filename + ': ' + e.toString());
            }
        }

        if (filename.match(/\.coffee$/)) {
            try {
                tmp = require('coffee-script').compile(src, coffeeOpts);
                src = tmp.js + '\n//# sourceMappingURL=' + getDataURI(fixSourceMapContent(tmp.v3SourceMap, src));
            } catch (e) {
                throw new Error('Error when transform coffee ' + filename + ': ' + e.toString());
            }
        }

        sourceStore.set(filename, src);

        if (!filename.match(options.exclude)) {
            src = instrumenter.instrumentSync(src, filename);
        }

        module._compile(src, filename);
    };
};

module.exports.createTask = function (options) {
    return function () {
        var init = initIstanbulHookHack(options.istanbul, options.react, options.coffee),
            Collector = istanbul.Collector;

        return gulp.src(options.src)
        .pipe(mocha(options.mocha))
        .on('end', function () {
            var collector = new Collector();

            collector.add(global[options.istanbul.coverageVariable]);

            options.coverage.reporters.forEach(function (R) {
                istanbul.Report.create(R, {
                    sourceStore: sourceStore,
                    dir: options.coverage.directory
                }).writeReport(collector, true);
            });
        });
    };
};