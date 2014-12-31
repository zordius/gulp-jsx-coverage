'use strict';

var gulp = require('gulp'),
    fs = require('fs'),
    React = require('react-tools'),
    istanbul = require('istanbul'),
    mocha = require('gulp-mocha'),
    parseVLQ = require('parse-base64vlq-mappings'),
    sourceStore = istanbul.Store.create('memory'),

getDataURI = function (sourceMap) {
    return 'data:application/json;base64,' + new Buffer(unescape(encodeURIComponent(sourceMap)), 'binary').toString('base64');
},

fixSourceMapContent = function (sourceMap, source) {
    var map = JSON.parse(sourceMap);

    map.sourcesContent = [source];
    return JSON.stringify(map);
},

betterIndent = function (string, loc) {
    var size = string.length,
        newloc = size - (size % 4) + 8;

    if (newloc < loc) {
        newloc = loc;
    }

    return string + (new Array(newloc - size + 1)).join(' ');
},

addSourceComments = function (source) {
    var sourceComment = source.match(/\n\/\/# sourceMappingURL=data:application\/json;base64,(.+)/),
        sourceMap,
        oldlines,
        lines = source.split(/\n/),
        mappings = [],
        loc,
        line,
        outputs = [];

    if (sourceComment) {
        sourceMap = JSON.parse(new Buffer(sourceComment[1], 'base64').toString('utf8'));
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

    Module._extensions['.js'] = function (module, filename) {
        var src = fs.readFileSync(filename, {encoding: 'utf8'}),
            tmp;

        if (filename.match(/\.jsx$/)) {
            try {
                src = React.transform(src, options.react);
            } catch (e) {
                throw new Error('Error when transform jsx ' + filename + ': ' + e.toString());
            }
        }

        if (filename.match(/\.coffee$/)) {
            try {
                tmp = require('coffee-script').compile(src, options.coffee);
                src = tmp.js + '\n//# sourceMappingURL=' + getDataURI(fixSourceMapContent(tmp.v3SourceMap, src));
            } catch (e) {
                throw new Error('Error when transform coffee ' + filename + ': ' + e.toString());
            }
        }

        sourceStore.set(filename, addSourceComments(src));

        if (!filename.match(options.istanbul.exclude)) {
            src = instrumenter.instrumentSync(src, filename);
        }

        module._compile(src, filename);
    };
};

module.exports.createTask = function (options) {
    return function () {
        var init = initIstanbulHookHack(options),
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