gulp-jsx-coverage
=================

Enable coverage on .JSX or .coffee files.

**This is not a gulp plugin, it just a task creator to help you deal with istanbul instrumenter and collect coverage report in gulp**

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
        reporters: ['text-summary', 'json', 'lcov'],
        directory: 'coverage'                        // will pass to istanbul reporters
    },
    mocha: {                                         // will pass to mocha
        reporter: 'tap'
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

----------------|-----------|-----------|-----------|-----------|
File            |   % Stmts |% Branches |   % Funcs |   % Lines |
----------------|-----------|-----------|-----------|-----------|
   test/        |     95.45 |       100 |     88.89 |     95.45 |
      target.js |     66.67 |       100 |        50 |     66.67 |
      test1.js  |       100 |       100 |       100 |       100 |
      test2.jsx |       100 |       100 |       100 |       100 |
----------------|-----------|-----------|-----------|-----------|
All files       |     95.45 |       100 |     88.89 |     95.45 |
----------------|-----------|-----------|-----------|-----------|
```
