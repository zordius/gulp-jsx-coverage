require('gulp').task('default', require('./index').createTask({
    src: ['test/test1.js', 'test/test2.jsx', 'test/test3.coffee'],
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