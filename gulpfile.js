// Mocha test example
require('gulp').task('mocha_tests', ['mocha_emitext_tests', 'mocha_cover_all_tests'], require('./index').createTask({
    src: ['test/test1.js', 'test/test2.jsx', 'test/test3.coffee', 'test/test7.cjsx'],
    istanbul: {
        preserveComments: true,
        coverageVariable: '__MY_TEST_COVERAGE__',
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
        coverageVariable: '__MY_TEST_COVERAGE__',
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

gulp.task('mocha_isparta_tests', GJC.createTask(Object.assign({
    isparta: 1,
    src: ['test/test1.js', 'test/test2.jsx']
}, GJCoptions)));

gulp.task('jasmine_isparta_tests', function () {
    var GJCIspartaOptions = Object.assign({isparta: 1}, GJCoptions);
    GJCIspartaOptions.coverage.directory = 'coverage/2';
    GJC.initModuleLoaderHack(GJCIspartaOptions);

    return gulp.src(['test/test4.js', 'test/test5.jsx'])
    .pipe(jasmine())
    .on('end', GJC.collectIstanbulCoverage(GJCIspartaOptions));
});
