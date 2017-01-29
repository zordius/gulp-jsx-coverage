'use strict';

var gulp = require('gulp');
var fs = require('fs');
var babel = require('babel-core');
var coverage = require('istanbul-lib-coverage');
var report = require('istanbul-lib-report');
var reporters = require('istanbul-reports');

var sourceCache = undefined;
var finalSummary = undefined;
var sourceMapCache = {};
var coverageVariable = '__coverage__';
var pluginName = 'gulp-jsx-coverage';

// Never use node-jsx or other transform in your testing code!
var initModuleLoader = function (options) {
    var Module = require('module');
    var babelFiles = Object.assign({
        include: /\.jsx?$/,
        exclude: /node_modules/,
        omitExt: false
    }, options.babel);
    var istanbulCfg = Object.assign({
        exclude: /node_modules/
    }, options.istanbul);
    var moduleLoader = function (module, filename) {
        var srcCache = sourceCache[filename];
        var src = srcCache || fs.readFileSync(filename, {encoding: 'utf8'});
        var bbl;
        var cov;
        var tmp;

        if (srcCache) {
            return;
        }

        bbl = (filename.match(babelFiles.include) && !filename.match(babelFiles.exclude));
        cov = !filename.match(istanbulCfg.exclude);

        if (bbl || cov) {
            try {
                tmp = babel.transform(src, Object.assign({
                    filename: filename,
                    babelrc: bbl,
                    sourceMap: 'both'
                }, cov ? {plugins: [['istanbul', {include: '*', exclude: '/_NOT_ME_'}]]} : {}));
                srcCache = tmp.map || 1;
                src = tmp.code;
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

    try {
        require('source-map-support').install({
            handleUncaughtExceptions: false,
            environment : 'node',
            retrieveSourceMap: function (source) {
                var map = sourceMapCache[source];
                return map ? {
                    url: null,
                    map: map
                } : null;
            }
        });
    } catch (E) {
        console.warn('Can not install "source-map-support" .'); 
    }
};

var GJC = {
    initModuleLoader: function (options) {
        initModuleLoader(options);
    },
    collectIstanbulCoverage: function (options) {
        return function () {
            var map;
            var context;
            var tree;
            var covCfg = Object.assign({
                directory: 'coverage',
                reporters: ['text']
            }, options.coverage);

            if (!global[coverageVariable]) {
                this.emit('error', new (require('gulp-util').PluginError)({
                    plugin: pluginName,
                    message: 'No coverage info! Check your options.src or options.istanbul.exclude to ensure you include proper files'
                }));
            }

            if (!covCfg.reporters || !covCfg.reporters.forEach) {
                this.emit('error', new (require('gulp-util').PluginError)({
                    plugin: pluginName,
                    message: 'Bad config! Check your options.coverage.reports, it should be an array.'
                }));
            }

            context = report.createContext({
                dir: covCfg.directory
            });
            map = coverage.createCoverageMap(global[coverageVariable]);
            tree = report.summarizers.pkg(map);

            finalSummary = coverage.createCoverageSummary();

            map.files().forEach(function (F) {
                finalSummary.merge(map.fileCoverageFor(F).toSummary());
            });

            covCfg.reporters.forEach(function (R) {
                try {
                    tree.visit(reporters.create(R), context);
                } catch (E) {
                    this.emit('error', new (require('gulp-util').PluginError)({
                        plugin: pluginName,
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
                    plugin: pluginName,
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
