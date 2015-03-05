require('gulp').task('default', require('./index').createTask({
    src: ['test/test1.js', 'test/test2.jsx', 'test/test3.coffee'],
    istanbul: {
        coverageVariable: '__MY_TEST_COVERAGE__',
        noInstrument: /test[0-9]/,                   // skip files from being instrumented for code coverage (will still transpile)
        noTranspileOrInstrument: /node_modules/      // don't transpile or instrument matched files
    },
    coverage: {
        reporters: ['text', 'json', 'lcov'],
        directory: 'coverage'
    },
    mocha: {
        reporter: 'spec'
    },
    babel: {
        sourceMap: 'inline'
    },
    coffee: {
        sourceMap: true
    }
}));