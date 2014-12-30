'use strict';

var gulp = require('gulp'),
    fs = require('fs'),
    React = require('react-tools'),
    istanbul = require('istanbul'),
    mocha = require('gulp-mocha'),

// Never use node-jsx or other transform in your testing code!
initIstanbulHookHack = function (options, reactOpts) {
    var Module = require('module'),
        instrumenter = new istanbul.Instrumenter(options);

    global[options.coverageVariable] = {};

    Module._extensions['.js'] = function (module, filename) {
        var src = fs.readFileSync(filename, {encoding: 'utf8'});

        if (filename.match(/\.jsx$/)) {
            try {
                src = React.transform(src, reactOpts);
            } catch (e) {
                throw new Error('Error when transform jsx ' + filename + ': ' + e.toString());
            }
        }

        if (filename.match(/\.coffee$/)) {
            try {
                src = new Buffer(require('coffee-script').compile(src, options.coffeeOpts).js);
            } catch (e) {
                throw new Error('Error when transform coffee ' + filename + ': ' + e.toString());
            }
        }

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
                istanbul.Report.create(R, {dir: options.coverage.directory}).writeReport(collector, true);
            });
        });
    };
};