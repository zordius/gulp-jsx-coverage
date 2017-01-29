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

var getDataURI = function (sourceMap) {
    return 'data:application/json;base64,' + new Buffer(unescape(encodeURIComponent(sourceMap)), 'binary').toString('base64');
};

var fixSourceMapContent = function (sourceMap, source) {
    var map = JSON.parse(sourceMap);

    map.sourcesContent = [source];
    return map;
};

var betterIndent = function (string, loc) {
    var size = string.length,
        newloc = size - (size % 4) + 8;

    if (newloc < loc) {
        newloc = loc;
    }

    return string + (new Array(newloc - size + 1)).join(' ');
};

var addSourceComments = function (source, sourceMap, filename) {
    var oldlines,
        lines = source.split(/\n/),
        mappings = [],
        loc = 0,
        line,
        smc,
        outputs = [];

    if (sourceMap && sourceMap.sourcesContent && sourceMap.sourcesContent[0]) {
        sourceMap.newLines = lines.slice(0);
        oldlines = sourceMap.sourcesContent[0].split(/\n/);
        smc = new SM.SourceMapConsumer(sourceMap);

        lines.forEach(function (L, I) {
            var XY = smc.originalPositionFor({
                line: I + 1,
                column: 1
            });

            if (!XY.line && L) {
                XY = smc.originalPositionFor({
                    line: I + 1,
                    column: L.length - 1
                });
            }

            if (!XY.line || !L) {
                loc -= 8;
                return;
            }

            // Do not comment when transform nothing
            if (oldlines[XY.line - 1] === L) {
                return;
            }

            line = betterIndent(L, loc);
            loc = line.length;

            // Add comment to hint original code
            lines[I] = line + '// ' + ((XY.line !== I + 1) ? ('Line ' + XY.line + ': ') : '') + oldlines[XY.line - 1];
        });
        sourceMap.smc = smc;
        sourceMap.oldLines = oldlines;
        sourceMapCache[filename] = sourceMap;
        source = lines.join('\n').replace(/\/\/# sourceMappingURL=.+/, '// SourceMap was distributed to comments by gulp-jsx-coverage');
    }

    return source;
};

// Never use node-jsx or other transform in your testing code!
var initModuleLoaderHack = function (options) {
    var Module = require('module');
    var babelFiles = Object.assign({
        include: /\.jsx?$/,
        exclude: /node_modules/,
        omitExt: false
    }, options.transpile ? options.transpile.babel : undefined);
    var coffeeFiles = Object.assign({
        include: /\.coffee$/,
        exclude: /^$/,
        omitExt: false
    }, options.transpile ? options.transpile.coffee : undefined);
    var cjsxFiles = Object.assign({
        include: /\.cjsx$/,
        exclude: /^$/,
        omitExt: false
    }, options.transpile ? options.transpile.cjsx : undefined);
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
                src = tmp.code;
            } catch (e) {
                throw new Error('Error when transform es2015/jsx ' + filename + ': ' + e.toString());
            }
        }

        if (filename.match(cjsxFiles.include) && !filename.match(cjsxFiles.exclude)) {
            try {
                src = require('coffee-react-transform')(src);
            } catch (e) {
                throw new Error('Error when transform cjsx ' + filename + ': ' + e.toString());
            }
        }

        if ((filename.match(coffeeFiles.include) && !filename.match(coffeeFiles.exclude)) || (filename.match(cjsxFiles.include) && !filename.match(cjsxFiles.exclude))) {
            try {
                tmp = require('coffee-script').compile(src, options.coffee);
                srcCache = tmp.v3SourceMap ? fixSourceMapContent(tmp.v3SourceMap, src) : 1;
                src = tmp.js + '\n//# sourceMappingURL=' + getDataURI(JSON.stringify(srcCache));
            } catch (e) {
                throw new Error('Error when transform coffee ' + filename + ': ' + e.toString());
            }
        }

        if (srcCache) {
            sourceCache[filename] = src;
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
    if (coffeeFiles.omitExt) {
        coffeeFiles.omitExt.forEach(function (V) {
            Module._extensions[V] = moduleLoader;
        });
    }
    if (cjsxFiles.omitExt) {
        cjsxFiles.omitExt.forEach(function (V) {
            Module._extensions[V] = moduleLoader;
        });
    }
};

var stackDumper = function (stack) {
    return stack.replace(/\((.+?):(\d+):(\d+)\)/g, function (M, F, L, C) {
        var sourcemap = sourceMapCache[F];
        var XY;

        if (!sourcemap) {
            return M;
        }

        L = L * 1;
        C = C * 1;

        XY = sourcemap.smc.originalPositionFor({
            line: L,
            column: C
        });

        if (!XY.line) {
            XY = sourcemap.smc.originalPositionFor({
                line: L,
                column: C,
                bias: SM.SourceMapConsumer.LEAST_UPPER_BOUND
            });
        }

        if (!XY.line) {
            return M + '\nTRANSPILED: ' + sourcemap.newLines[L - 1] + '\n' + (new Array(C * 1 + 13)).join('-') + '^';
        }

        return '(' + F + ':' + XY.line + ':' + XY.column + ')' + '\nORIGINALSRC: ' + sourcemap.oldLines[XY.line - 1] + '\n' + (new Array(XY.column + 13)).join('-') + '^\nTRANSPILED : ' + sourcemap.newLines[L - 1] + '\t// line ' + L + ',' + C + '\n' + (new Array(C + 13)).join('-') + '^';
    });
};

var getCustomizedMochaStackTraceFilter = function () {
    return stackDumper;
};

var GJC = {
    oldMochaStackTraceFilter: undefined,
    initModuleLoaderHack: function (options) {
        initModuleLoaderHack(options);
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

            GJC.disableStackTrace();
        };
    },
    disableStackTrace: function () {
        if (GJC.oldMochaStackTraceFilter) {
            require('mocha/lib/utils').stackTraceFilter = GJC.oldMochaStackTraceFilter;
        }
    },
    enableStackTrace: function () {
        if (!GJC.oldMochaStackTraceFilter) {
            GJC.oldMochaStackTraceFilter = require('mocha/lib/utils').stackTraceFilter;
        }
        require('mocha/lib/utils').stackTraceFilter = getCustomizedMochaStackTraceFilter;
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
            GJC.initModuleLoaderHack(options);
            GJC.enableStackTrace();
            return gulp.src(options.src)
            .pipe(require('gulp-mocha')(options.mocha))
            .on('end', GJC.collectIstanbulCoverage(options));
        };
    }
};

module.exports = GJC;

require('object.assign').shim();
