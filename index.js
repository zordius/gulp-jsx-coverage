'use strict';

var gulp = require('gulp'),
    fs = require('fs'),
    babel = require('babel'),
    istanbul = require('istanbul'),
    parseVLQ = require('parse-base64vlq-mappings'),
    sourceStore = istanbul.Store.create('memory'),
    sourceMapCache = {},

getDataURI = function (sourceMap) {
    return 'data:application/json;base64,' + new Buffer(unescape(encodeURIComponent(sourceMap)), 'binary').toString('base64');
},

fixSourceMapContent = function (sourceMap, source) {
    var map = JSON.parse(sourceMap);

    map.sourcesContent = [source];
    return map;
},

betterIndent = function (string, loc) {
    var size = string.length,
        newloc = size - (size % 4) + 8;

    if (newloc < loc) {
        newloc = loc;
    }

    return string + (new Array(newloc - size + 1)).join(' ');
},

addSourceComments = function (source, sourceMap) {
    var oldlines,
        lines = source.split(/\n/),
        mappings = [],
        loc,
        line,
        outputs = [];

    if (sourceMap && sourceMap.sourcesContent) {
        sourceMap.newLines = lines.slice(0);
        oldlines = sourceMap.sourcesContent[0].split(/\n/);
        parseVLQ(sourceMap.mappings).forEach(function (P) {
            mappings[P.generated.line] = P.original.line;
        });
        mappings.forEach(function (V, I) {
            if (!V || !I || outputs[V]) {
                loc -= 8;
                return;
            }

            // Mapping once
            outputs[V] = 1;

            // Do not comment when transform nothing
            if (oldlines[V-1] === lines[I-1]) {
                return;
            }

            line = betterIndent(lines[I-1], loc);
            loc = line.length;

            // Add comment to hint original code
            lines[I-1] = line + '// ' + ((V!==I) ? ('Line ' + V + ': ') : '') + oldlines[V-1];
        });
        sourceMap.linemappings = mappings;
        sourceMap.oldLines = oldlines;
        sourceMapCache[sourceMap.file] = sourceMap;
        source = lines.join('\n').replace(/\/\/# sourceMappingURL=.+/, '// SourceMap was distributed to comments by gulp-jsx-coverage');
    }

    return source;
},

// Never use node-jsx or other transform in your testing code!
initIstanbulHookHack = function (options) {
    var Module = require('module'),
        instrumenter = new istanbul.Instrumenter(options.istanbul);

    global[options.istanbul.coverageVariable] = {};
    sourceStore.dispose();
    sourceMapCache = {};

    Module._extensions['.js'] = function (module, filename) {
        var srcCache = sourceStore.map[filename],
            src = srcCache || fs.readFileSync(filename, {encoding: 'utf8'}),
            babelFiles = Object.assign({
                include: /\.jsx?$/,
                exclude: /node_modules/
            }, options.transpile ? options.transpile.babel : undefined),
            coffeeFiles = Object.assign({
                include: /\.coffee$/,
                exclude: /^$/
            }, options.transpile ? options.transpile.coffee : undefined),
            tmp;

        if (srcCache) {
            return;
        }

        if (filename.match(babelFiles.include) && !filename.match(babelFiles.exclude)) {
            try {
                tmp = babel.transform(src, Object.assign({
                    filename: filename
                }, options.babel));
                srcCache = tmp.map || 1;
                src = tmp.code;
            } catch (e) {
                throw new Error('Error when transform es6/jsx ' + filename + ': ' + e.toString());
            }
        }

        if (filename.match(coffeeFiles.include) && !filename.match(coffeeFiles.exclude)) {
            try {
                tmp = require('coffee-script').compile(src, options.coffee);
                srcCache = tmp.v3SourceMap ? fixSourceMapContent(tmp.v3SourceMap, src) : 1;
                src = tmp.js + '\n//# sourceMappingURL=' + getDataURI(JSON.stringify(srcCache));
            } catch (e) {
                throw new Error('Error when transform coffee ' + filename + ': ' + e.toString());
            }
        }

        if (srcCache) {
            sourceStore.set(filename, addSourceComments(src, srcCache));
        }

        // Don't instrument files that aren't meant to be
        if (!filename.match(options.istanbul.exclude)) {
            try {
                src = instrumenter.instrumentSync(src, filename);
            } catch (e) {
                throw new Error('Error when instrument ' + filename + ': ' + e.toString());
            }
        }

        module._compile(src, filename);
    };
},

stackDumper = function (stack) {
    return stack.replace(/\((.+?):(\d+):(\d+)\)/g, function (M, F, L, C) {
        var sourcemap = sourceMapCache[F];
        var l = 0;

        if (!sourcemap) {
            return M;
        }

        l = sourcemap.linemappings[L - 1];

        if (l === undefined) {
            return M + '\nTRANSPILED: ' + sourcemap.newLines[L - 1];
        }

        return '(' + F + ':' + (l + 1) + ':-1)' + '\nORIGINALSRC: ' + sourcemap.oldLines[l] + '\nTRANSPILED : ' + sourcemap.newLines[L - 1] + '\t// line ' + L + ',' + C + '\n' + (new Array(C * 1 + 13)).join('-') + '^';
    });
},

getCustomizedMochaStackTraceFilter = function () {
    return stackDumper;
},

GJC = {
    oldMochaStackTraceFilter: undefined,
    initIstanbulHook: function (options) {
        initIstanbulHookHack(options);
    },
    colloectIstanbulCoverage: function (options) {
        return function () {
            var Collector = istanbul.Collector,
                collector = new Collector();

            collector.add(global[options.istanbul.coverageVariable]);

            options.coverage.reporters.forEach(function (R) {
                istanbul.Report.create(R, {
                    sourceStore: sourceStore,
                    dir: options.coverage.directory
                }).writeReport(collector, true);
            });

            if ('function' === (typeof options.cleanup)) {
                options.cleanup(this);
            }

            GJC.disableStackTrace();
        }
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
    createTask: function (options) {
        return function () {
            GJC.initIstanbulHook(options);
            GJC.enableStackTrace();

            return gulp.src(options.src)
            .pipe(require('gulp-mocha')(options.mocha))
            .on('end', GJC.colloectIstanbulCoverage(options));
        };
    }
};

module.exports = GJC;

require('object.assign').shim();
