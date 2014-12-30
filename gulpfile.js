require('gulp').task('default', require('./index').createTask({
    src: ['/test/test1.js', '/test/test2.jsx'],
    istanbul: {
        coverageVariable: '__MY_TEST_COVERAGE__',
        exclude: /node_modules/
    },
    coverage: {
        reporters: ['text-summary', 'json', 'lcov'],
        directory: 'coverage'
    },
    mocha: {
        reporter: 'tap'
    }
}));