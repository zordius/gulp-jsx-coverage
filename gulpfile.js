require('gulp').task('default', require('./index').createTask({
    src: ['test/test1.js', 'test/test2.jsx'],
    istanbul: {
        coverageVariable: '__MY_TEST_COVERAGE__',
        exclude: /node_modules/      // you will also skip test files in most cases
    },
    coverage: {
        reporters: ['text', 'json', 'lcov'],
        directory: 'coverage'
    },
    mocha: {
        reporter: 'spec'
    }
}));