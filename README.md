gulp-jsx-coverage
=================

Enable istanbul coverage on ES2015/babel files when you do mocha/jasmine tests.

[![npm version](https://img.shields.io/npm/v/gulp-jsx-coverage.svg)](https://www.npmjs.org/package/gulp-jsx-coverage) [![npm download](https://img.shields.io/npm/dm/gulp-jsx-coverage.svg)](https://www.npmjs.org/package/gulp-jsx-coverage) [![Dependency Status](https://david-dm.org/zordius/gulp-jsx-coverage.svg)](https://david-dm.org/zordius/gulp-jsx-coverage) [![Build Status](https://travis-ci.org/zordius/gulp-jsx-coverage.svg?branch=master)](https://travis-ci.org/zordius/gulp-jsx-coverage) [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE.txt)

Features
--------

* Help you create a gulp task to handle mocha testing + istanbul coverage
* Transpile .jsx and ES2015 .js files on the fly
* Use <a href="https://github.com/babel/babel">babel (6to5)</a> to transpile .js and .jsx files so you can use <a href="http://babeljs.io/docs/learn-es2015/">ES2015 features</a> inside your .js and .jsx files!
* Customize everything by options
* sourceMaps on stack traces when mocha test failed (powered by <a href="https://github.com/evanw/node-source-map-support">source-map-support</a>)
* coverage threshold

* **istanbul+mocha:hint original codes (jsx/es2015) in coverage reports**
<img src="demo1.png" />
* **istanbul+mocha:hint original coffee-script in coverage reports**
<img src="demo2.png" />
* **mocha:show original code/line when test failed**
<img src="demo3.png" />
* **isparta+mocha:show original codes in coverage reports**
<img src="demo4.png" />

Install
-------

```
npm install gulp-jsx-coverage mocha --save-dev
```

Best Practices
--------------

* The golden rule: **Use .jsx as ext name** when jsx syntax inside it. Require it by `require('file.jsx')`.
* When you develop a module, do not use any module loader hooks. (Refer to <a href="https://babeljs.io/docs/usage/require/">Babel require hook document</a>)
* Excludes transpiler directories as possible as you can to improve performance.
* When you develop an application, you may use module loader hooks. But, don't enable the hook when you do testing.

Usage: General Mocha Test Creator
---------------------------------

```javascript
gulp.task('your_task_name', require('gulp-jsx-coverage').createTask({
    src: ['test/**/*.js', 'test/components/*.jsx'],  // will pass to gulp.src as mocha tests
    istanbul: {                                      // will pass to istanbul
        exclude: /node_modules|test[0-9]/            // do not instrument these files
    },

    threshold: [                                     // fail the task when coverage lower than one of this array
        {
            type: 'lines',                           // one of 'lines', 'statements', 'functions', 'banches'
            min: 90
        }
    ],

    babel: {                                         // this is default setting
        include: /\.jsx?$/,
        exclude: /node_modules/,
        omitExt: false                               // if you wanna omit file ext when require(), put an array
    },                                               // of file exts here. Ex: ['.jsx', '.es6'] (NOT RECOMMENDED)

    coverage: {
        reporters: ['text-summary', 'json', 'lcov'], // list of istanbul reporters
        directory: 'coverage'                        // will pass to istanbul reporters
    },

    mocha: {                                         // will pass to mocha
        reporter: 'spec'
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
    GJC.initModuleLoader(GJCoptions); // Refer to previous gulp-jsx-coverage options

    return gulp.src('test/*.js')
    .pipe(jasmine(jasmineOptions))
    .on('end', GJC.collectIstanbulCoverage(GJCoptions));
});
```

Live Example: mocha
-------------------

```sh
git clone https://github.com/zordius/gulp-jsx-coverage.git
cd gulp-jsx-coverage
npm install
npm run mocha
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
* Check <a href=".babelrc">.babelrc</a> for the sample babel config.
* Check <a href="http://zordius.github.io/gulp-jsx-coverage/lcov-report/">coverage report</a> directory for the sample output.

Upgrade Notice
--------------

**0.4.0**
* Core changed:
  * do not support isparta now
  * do not support coffee-script/cjsx now
  * do not support options.babel now (please use .babelrc)
  * do not support options.istanbul.coverageVariable now
  * move to <a href="https://github.com/istanbuljs">istanbul.js</a> and <a href="https://github.com/istanbuljs/babel-plugin-istanbul">babel-plugin-istanbul</a> now

**0.3.2**

* API changed:
  * you should rename all colloectIstanbulCoverage into collectIstanbulCoverage

**0.3.0**

* Babel upgraded:
  * You should add proper options.babel.plugins or options.babel.presets to transpile your script properly. Please refer to http://babeljs.io/docs/plugins/

* API changed:
  * you should rename all initIstanbulHookHack into initModuleLoaderHack

**0.2.0**

* the sourceMap stack trace feature requires:
  * mocha >= 2.2.2
  * the options.babel.sourceMap should be changed from 'inline' to 'both'
