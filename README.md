gulp-jsx-coverage
=================

Enable istanbul coverage on .JSX or .coffee files when you do mocha tests.

[![npm version](https://img.shields.io/npm/v/gulp-jsx-coverage.svg)](https://www.npmjs.org/package/gulp-jsx-coverage) [![Dependency Status](https://david-dm.org/zordius/gulp-jsx-coverage.svg)](https://david-dm.org/zordius/gulp-jsx-coverage) [![Build Status](https://travis-ci.org/zordius/gulp-jsx-coverage.svg?branch=master)](https://travis-ci.org/zordius/gulp-jsx-coverage) [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE.txt)

**This is not a gulp plugin, it just a task creator to help you deal with istanbul instrumenter and collect coverage report in gulp**

Features
--------

* Help you create a gulp task to handle mocha testing + istanbul coverage
* Transpile .jsx, .coffee, and .js (using ES6) files on the fly
* Use <a href="https://github.com/babel/babel">babel (6to5)</a> to transpile js and jsx files so you can use <a href="https://babeljs.io/docs/learn-es6/">ES6 features</a> inside your .js and .jsx files!
* Customized everything by options
* Extract sourceMaps to hint original codes in istanbul reports

<img src="demo1.png" />
<img src="demo2.png" />

Install
-------

```
npm install gulp-jsx-coverage mocha --save-dev
```

* You will need to install <a href="https://www.npmjs.com/package/coffee-script">coffee-script</a> when you require('foobar.coffee') or write tests as foobar.coffee

Usage
-----
* The golden rule: **Use .jsx as ext name** , require('file.jsx')
* The golden rule: **Use .coffee as ext name** , require('file.coffee')
* Regular JavaScript files with .js extension may use ES6 features, including mocha tests
* No need to use transform tools to register .jsx or .coffee for require() at library or util or module files, do this only at application or server.js.

```javascript
gulp.task('your_task_name', require('gulp-jsx-coverage').createTask({
    src: ['test/**/*.js', 'test/components/*.jsx'],  // will pass to gulp.src as mocha tests
    istanbul: {                                      // will pass to istanbul
        coverageVariable: '__MY_TEST_COVERAGE__',
        exclude: /node_modules|test[0-9]/            // do not instrument these files
    },
    transpile: {                                     // this is default whitelist/blacklist for transpilers
        babel: {
            include: /\.jsx?$/,
            exclude: /node_modules/
        },
        coffee: {
            include: /\.coffee$/
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
        sourceMap: 'inline'                          // get hints in HTML covarage reports
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

Live Example
------------

```sh
git clone https://github.com/zordius/gulp-jsx-coverage.git
cd gulp-jsx-coverage
npm install
npm test
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
