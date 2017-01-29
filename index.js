'use strict';

var gulp = require('gulp');
var fs = require('fs');
var babel = require('babel-core');
var SM = require('source-map');
var coverage = require('istanbul-lib-coverage');
var report = require('istanbul-lib-report');
var reporters = require('istanbul-reports');

var sourceCache = undefined;
var finalSummary = undefined;
var sourceMapCache = {};
var coverageVariable = '__coverage__';

// Never use node-jsx or other transform in your testing code!
var initModuleLoader = function (options) {
    var Module = require('module');
    var babelFiles = Object.assign({
        include: /\.jsx?$/,
        exclude: /node_modules/,
        omitExt: false
    }, options.transpile ? options.transpile.babel : undefined);
    var moduleLoader = function (module, filename) {
        var srcCache = sourceCache[filename],
            src = srcCache || fs.readFileSync(filename, {encoding: 'utf8'}),
            tmp;

        if (srcCache) {
            return;
        }

        if (filename.match(babelFiles.include) && !filename.match(babelFiles.exclude)) {
            try {
                tmp = babel.transform(src, Object.assign({
                    filename: filename
                }, filename.match(options.istanbul.exclude) ? {} : {plugins: [['istanbul', {include: '*', exclude: '/_NOT_ME_'}]]}));
                srcCache = tmp.map || 1;
                src = "try {require('source-map-support').install();}\ncatch (E) {" + (options.ignoreSourceMapSupport ? '' : "console.warn('Can not install source-map-support, add option.ignoreSourceMapSupport to stop this message.');") + "}\n" + tmp.code;
            } catch (e) {
                throw new Error('Error when transform es2015/jsx ' + filename + ': ' + e.toString());
            }
        }

        if (srcCache) {
            sourceCache[filename] = src;
            sourceMapCache[filename] = srcCache;
        }

        module._compile(src, filename);
    };

    global[coverageVariable] = {};
    sourceCache = {};
    sourceMapCache = {};

    Module._extensions['.js'] = moduleLoader;
    if (babelFiles.omitExt) {
        babelFiles.omitExt.forEach(function (V) {
            Module._extensions[V] = moduleLoader;
        });
    }
};

var GJC = {
    initModuleLoader: function (options) {
        initModuleLoader(options);
    },
    collectIstanbulCoverage: function (options) {
        return function () {
            var map = coverage.createCoverageMap(global[coverageVariable]);
            var context = report.createContext({
                dir: options.coverage.directory
            });
            var tree = report.summarizers.pkg(map);

            finalSummary = coverage.createCoverageSummary();

            map.files().forEach(function (F) {
                finalSummary.merge(map.fileCoverageFor(F).toSummary());
            });

            options.coverage.reporters.forEach(function (R) {
                try {
                    tree.visit(reporters.create(R), context);
                } catch (E) {
                    this.emit('error', new (require('gulp-util').PluginError)({
                        plugin: 'gulp-jsx-coverage',
                        message: 'ERROR when generate instanbul report ' + R + ':' + E.message
                    }));
                }
            });

            if ('function' === (typeof options.cleanup)) {
                options.cleanup(this);
            }

            if (options.threshold && ('function' === (typeof options.threshold.forEach))) {
                options.threshold.forEach(function (O) {
                    GJC.failWithThreshold(O.min, O.type).apply(this);
                }.bind(this));
            }
        };
    },
    failWithThreshold: function (threshold, type) {
        return function () {
            var T = type || 'lines';
            if (!finalSummary || !threshold) {
                return;
            }
            if (finalSummary[T].pct < threshold) {
                this.emit('error', new (require('gulp-util').PluginError)({
                    plugin: 'gulp-jsx-coverage',
                    message: T + ' coverage ' + finalSummary[T].pct + '% is lower than threshold ' + threshold + '%!'
                }));
            }
        };
    },
    createTask: function (options) {
        return function () {
            GJC.initModuleLoader(options);

            return gulp.src(options.src)
            .pipe(require('gulp-mocha')(options.mocha))
            .on('end', GJC.collectIstanbulCoverage(options));
        };
    }
};

module.exports = GJC;

require('object.assign').shim();
