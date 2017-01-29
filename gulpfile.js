// Mocha test example
require('gulp').task('mocha_tests', require('./index').createTask({
    src: ['test/test1.js', 'test/test2.jsx', 'test/test3.coffee', 'test/test7.cjsx'],
    istanbul: {
        preserveComments: true,
        exclude: /node_modules|test[0-9]/
    },
    transpile: {
        babel: {
            include: /\.jsx?$/,
            exclude: /node_modules/,
            omitExt: ['.jsx']
        },
        coffee: {
            include: /\.coffee$/
        },
        cjsx: {
            include: /\.cjsx$/
        }
    },
    coverage: {
        reporters: ['text', 'json', 'lcov'],
        directory: 'coverage'
    },
    mocha: {
        reporter: 'spec'
    },
    coffee: {
        sourceMap: true
    }
}));

// Jasmine test example
var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var GJC = require('./index');
var GJCoptions = {
    istanbul: {
        exclude: /node_modules|test[0-9]/
    },
    transpile: {
        babel: {
            include: /\.jsx?$/,
            exclude: /node_modules/
        },
        coffee: {
            include: /\.coffee$/
        }
    },
    coverage: {
        reporters: ['text', 'json', 'lcov'],
        directory: 'coverage'
    },
    coffee: {
        sourceMap: true
    }
};

gulp.task('mocha_emitext_tests', GJC.createTask(Object.assign({}, GJCoptions, {
    src: ['test/test8.cjsx'],
    transpile: {
        cjsx: {
            include: /\.cjsx$/,
            omitExt: ['.cjsx']
        }
    },
})));

gulp.task('mocha_cover_all_tests', GJC.createTask(Object.assign({}, GJCoptions, {
    src: ['test/Component.jsx', 'test/target.js', 'test/test1.js'],
})));

gulp.task('jasmine_tests', function () {
    GJC.initModuleLoaderHack(GJCoptions);

    return gulp.src(['test/test4.js', 'test/test5.jsx', 'test/test6.coffee'])
    .pipe(jasmine())
    .on('end', GJC.collectIstanbulCoverage(GJCoptions));
});

gulp.task('mocha_threshold_tests', GJC.createTask(Object.assign({}, GJCoptions, {
    src: ['test/test1.js'],
    threshold: [
        {
            type: 'lines',
            min: 70
        },
        {
            type: 'functions',
            min: 90
        }
    ]
})));
