// Mocha test example
require('gulp').task('mocha_tests', require('./index').createTask({
    src: ['test/test1.js', 'test/test2.jsx'],
    istanbul: {
        exclude: /node_modules|test[0-9]/
    },
    coverage: {
        reporters: ['text', 'json', 'lcov'],
        directory: 'coverage'
    },
    mocha: {
        reporter: 'spec'
    }
}));

// Jasmine test example
var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var GJC = require('./index');

gulp.task('mocha_emitext_tests', GJC.createTask({
    src: ['test/test3.jsx'],
    istanbul: {
        exclude: /node_modules|test[0-9]/
    },
    babel: {
        include: /\.jsx$/,
        omitExt: ['.jsx']
    },
    coverage: {
        reporters: ['text', 'lcov'],
        directory: 'coverage2'
    }
}));

gulp.task('mocha_cover_all_tests', GJC.createTask({
    src: ['test/*', '!test/test3.jsx', '!test/test2.jsx'],
    coverage: {
        reporters: ['text', 'lcov'],
        directory: 'coverage3'
    }
}));

gulp.task('jasmine_tests', function () {
    GJC.initModuleLoader({});

    return gulp.src(['test/test4.js', 'test/test5.jsx'])
    .pipe(jasmine())
    .on('end', GJC.collectIstanbulCoverage({
        coverage: {
            reporters: ['text', 'lcov'],
            directory: 'coverage4'
        }
    }));
});

gulp.task('mocha_threshold_tests', GJC.createTask({
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
}));
