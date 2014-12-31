gulp-jsx-coverage
=================

Enable coverage on .JSX or .coffee files.

[![npm version](https://img.shields.io/npm/v/gulp-jsx-coverage.svg)](https://www.npmjs.org/package/gulp-jsx-coverage) [![Dependency Status](https://david-dm.org/zordius/gulp-jsx-coverage.svg)](https://david-dm.org/zordius/gulp-jsx-coverage) [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE.txt)

**This is not a gulp plugin, it just a task creator to help you deal with istanbul instrumenter and collect coverage report in gulp**

Features
--------

* Help you create a gulp task to handle mocha testing + istanbul coverage
* Compile .jsx and .coffee files on the fly
* Customized everything by options

Install
-------

```
npm install gulp-jsx-coverage
```

Usage
-----

* The golden rule: **Use .jsx as ext name**

```javascript
gulp.task('your_task_name', require('gulp-jsx-coverage').createTask({
    src: ['test/**/*.js', 'test/components/*.jsx'],  // will pass to gulp.src
    istanbul: {                                      // will pass to istanbul
        coverageVariable: '__MY_TEST_COVERAGE__',
        exclude: /node_modules|\/test\//             // pattern to skip instrument
    },
    coverage: {
        reporters: ['text-summary', 'json', 'lcov'], // list of istanbul reporters
        directory: 'coverage'                        // will pass to istanbul reporters
    },
    mocha: {                                         // will pass to mocha
        reporter: 'spec'
    },
    react: {                                         // will pass to react-tools
        sourceMap: true
    },
    coffee: {                                        // will pass to coffee.compile
        sourceMap: true
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

Output:

```
> gulp-jsx-coverage@0.0.1 test /Users/zordius/gulp-jsx-coverage
> gulp

[17:21:00] Using gulpfile ~/gulp-jsx-coverage/gulpfile.js
[17:21:00] Starting 'default'...


  test coverage
    ✓ should covered 

  test coverage
    ✓ should covered 


  2 passing (32ms)

-------------------|-----------|-----------|-----------|-----------|
File               |   % Stmts |% Branches |   % Funcs |   % Lines |
-------------------|-----------|-----------|-----------|-----------|
   test/           |     90.91 |        50 |     91.67 |     90.91 |
      target.js    |     66.67 |       100 |        50 |     66.67 |
      test1.js     |       100 |       100 |       100 |       100 |
      test2.jsx    |     93.33 |        50 |       100 |     93.33 |
      test3.coffee |     88.89 |        50 |       100 |     88.89 |
-------------------|-----------|-----------|-----------|-----------|
All files          |     90.91 |        50 |     91.67 |     90.91 |
-------------------|-----------|-----------|-----------|-----------|
```

* Check <a href="coverage">coverage</a> directory for the sample output.
