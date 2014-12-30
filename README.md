gulp-jsx-coverage
=================

Enable coverage on .JSX or .coffee files.

**This is not a gulp plugin, it just a task creator to help you deal with istanbul instrumenter and collect coverage report in gulp**

Usage
-----

```javascript
gulp.task('your_task_name', require('gulp-jsx-coverage').createTask({
    src: ['test/**/*.js', 'test/components/*.jsx'],  // will pass to gulp.src
    istanbul: {                                      // will pass to istanbul
        coverageVariable: '__MY_TEST_COVERAGE__',
        exclude: /node_modules|\/test\//             // pattern to skip instrument
    },
    coverage: {
        reporters: ['text-summary', 'json', 'lcov'],
        directory: 'coverage'                        // will pass to istanbul reporters
    },
    mocha: {                                         // will pass to mocha
        reporter: 'tap'
    }
}));
```
