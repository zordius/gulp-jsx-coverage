gulp-jsx-coverage
=================

Enable istanbul coverage on ES6/babel or coffee-script files when you do mocha/jasmine tests, also deal with sourceMap for coverage report and stack trace.

[![npm version](https://img.shields.io/npm/v/gulp-jsx-coverage.svg)](https://www.npmjs.org/package/gulp-jsx-coverage) [![npm download](https://img.shields.io/npm/dm/gulp-jsx-coverage.svg)](https://www.npmjs.org/package/gulp-jsx-coverage) [![Dependency Status](https://david-dm.org/zordius/gulp-jsx-coverage.svg)](https://david-dm.org/zordius/gulp-jsx-coverage) [![Build Status](https://travis-ci.org/zordius/gulp-jsx-coverage.svg?branch=master)](https://travis-ci.org/zordius/gulp-jsx-coverage) [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE.txt)

Features
--------

* Help you create a gulp task to handle mocha testing + istanbul coverage
* Transpile .jsx, .coffee, and ES6 .js files on the fly
* Use <a href="https://github.com/babel/babel">babel (6to5)</a> to transpile .js and .jsx files so you can use <a href="https://babeljs.io/docs/learn-es6/">ES6 features</a> inside your .js and .jsx files!
* Customize everything by options
* Extract sourceMaps to hint original codes in istanbul reports
* sourceMaps on stack traces when mocha test failed
* coverage threshold

<img src="demo1.png" title="hint original codes in istanbul reports (jsx/es6)" />
<img src="demo2.png" title="hint original codes in istanbul reports (coffee)" />
<img src="demo3.png" title="sourceMaps on stack traces when mocha test failed" />

Install
-------

```
npm install gulp-jsx-coverage mocha --save-dev
```

* You will need to install <a href="https://www.npmjs.com/package/coffee-script">coffee-script</a> when you require('foobar.coffee') or write tests as foobar.coffee
* The golden rule: **Use .jsx as ext name** , require('file.jsx')
* The golden rule: **Use .coffee as ext name** , require('file.coffee')
* Regular JavaScript files with .js extension may use ES6 features, including mocha tests
* No need to use transform tools to register .jsx or .coffee for require() at library or util or module files, do this only at application or server.js.

Usage: General Mocha Test Creator
---------------------------------

```javascript
gulp.task('your_task_name', require('gulp-jsx-coverage').createTask({
    src: ['test/**/*.js', 'test/components/*.jsx'],  // will pass to gulp.src as mocha tests
    istanbul: {                                      // will pass to istanbul
        coverageVariable: '__MY_TEST_COVERAGE__',
        exclude: /node_modules|test[0-9]/            // do not instrument these files
    },

    threshold: 80,                                   // fail the task when coverage lower than this
                                                     // default is no threshold
    thresholdType: 'functions',                      // one of 'lines', 'statements', 'functions', 'banches'
                                                     // default is 'lines'

    transpile: {                                     // this is default whitelist/blacklist for transpilers
        babel: {
            include: /\.jsx?$/,
            exclude: /node_modules/,
            omitExt: false
        },
        coffee: {
            include: /\.coffee$/,
            omitExt: false
        }
    },
    coverage: {
        reporters: ['text-summary', 'json', 'lcov'], // list of istanbul reporters
        directory: 'coverage'                        // will pass to istanbul reporters
    },
    mocha: {                                         // will pass to mocha
        reporter: 'spec'
    },
    babel: {                                         // will pass to babel
        sourceMap: 'both'                            // get hints in covarage reports or error stack
    },
    coffee: {                                        // will pass to coffee.compile
        sourceMap: true                              // true to get hints in HTML coverage reports
    },

    //optional
    cleanup: function () {
        // do extra tasks after test done
        // EX: clean global.window when test with jsdom
    }
}));
```

Usage: Other Testing Frameworks
-------------------------------

```javascript
var GJC = require('gulp-jsx-coverage');
var jasmine = require('gulp-jasmine');

gulp.task('my_jasmine_tests', function () {
    GJC.initIstanbulHook(GJCoptions); // Refer to previous gulp-jsx-coverage options

    return gulp.src('test/*.js')
    .pipe(jasmine(jasmineOptions))
    .on('end', GJC.colloectIstanbulCoverage(GJCoptions));
});
```

Live Example: mocha
-------------------

```sh
git clone https://github.com/zordius/gulp-jsx-coverage.git
cd gulp-jsx-coverage
npm install
npm run mocha_test
```

**Output**:

```
[13:00:52] Using gulpfile ~/gulp-jsx-coverage/gulpfile.js
[13:00:52] Starting 'default'...


  target (tested by test1.js)
    ✓ should multiply correctly
    - should not show coverage info for test1.js
    ✓ should handle es6 template string correctly

  target (tested by test2.jsx)
    ✓ should multiply correctly
    - should not show coverage info for test2.jsx

  target (tested by test3.coffee)
    ✓ should multiply correctly
    - should not show coverage info for test3.coffee


  4 passing (42ms)
  3 pending

----------------|-----------|-----------|-----------|-----------|
File            |   % Stmts |% Branches |   % Funcs |   % Lines |
----------------|-----------|-----------|-----------|-----------|
   test/        |        80 |       100 |     66.67 |        80 |
      target.js |        80 |       100 |     66.67 |        80 |
----------------|-----------|-----------|-----------|-----------|
All files       |        80 |       100 |     66.67 |        80 |
----------------|-----------|-----------|-----------|-----------|

[13:00:53] Finished 'default' after 642 ms
```

* Check <a href="gulpfile.js">gulpfile.js</a> for the sample input.
* Check <a href="http://zordius.github.io/gulp-jsx-coverage/lcov-report/">coverage report</a> directory for the sample output.

Upgrade Notice
--------------

**0.2.0**

* the sourceMap stack trace feature requires:
  * mocha >= 2.2.2
  * the options.babel.sourceMap should be changed from 'inline' to 'both'
