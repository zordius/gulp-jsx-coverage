'use strict';

var gulp = require('gulp'),
    istanbul = require('istanbul'),

// Never use node-jsx or other transform in your testing code!
initIstanbulHookHack = function (options) {
    var Module = require('module'),
        instrumenter = new istanbul.Instrumenter(configs.test_coverage.istanbul);

    global[configs.test_coverage.istanbul.coverageVariable] = {};

    Module._extensions['.js'] = function (module, filename) {
        var src = fs.readFileSync(filename, {encoding: 'utf8'});

        if (filename.match(/\.jsx/)) {
            try {
                src = React.transform(src);
            } catch (e) {
                throw new Error('Error when transform ' + filename + ': ' + e.toString());
            }
        }

        if (!filename.match(configs.test_coverage.istanbul.skip)) {
            src = instrumenter.instrumentSync(src, filename);
        }

        module._compile(src, filename);
    };
},

createTask = function (options) {
    return function () {
        var init = initIstanbulHookHack(options.istanbul),
            Collector = istanbul.Collector,
            mocha = require('gulp-mocha');

        return gulp.src(['test/**/*.js', 'test/components/*.js*'])
        .pipe(mocha(options.mocha))
        .on('end', function () {
            var collector = new Collector();

            collector.add(global[configs.test_coverage.istanbul.coverageVariable]);

            options.istanbulReports.reporters.forEach(function (R) {
                istanbul.Report.create(R, {dir: configs.test_coverage.istanbul.directory}).writeReport(collector, true);
            });
        });
    };
};

module.exports = createTask;