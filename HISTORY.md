HISTORY
=======

2017-01-29 0.4.0 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.4.0
   * **BREAK CHANGE** do not support coffee-script
   * **BREAK CHANGE** do not support cjsx
   * **BREAK CHANGE** do not support isparta nor options.isparta
   * **BREAK CHANGE** do not support options.istanbul.coverageVariable
   * **BREAK CHANGE** rename options.transpile.babel to options.babel
   * **BREAK CHANGE** rename .initModuleLoaderHack() to initModuleLoader()
   * move to <a href="https://github.com/istanbuljs">istanbul.js</a> and <a href="https://github.com/istanbuljs/babel-plugin-istanbul">babel-plugin-istanbul</a>, coverage report with original codes!
   * move to <a href="https://github.com/evanw/node-source-map-support">source-map-support</a>, better stack traces with original codes and lines!

2016-02-01 0.3.8 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.3.8
   * support multiple coverage threshold types

2016-01-12 0.3.7 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.3.7
   * fix .cjsx omitExt option bug

2016-01-04 0.3.6 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.3.6
   * support .cjsx files

2015-12-04 0.3.5 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.3.5
   * change example to recommend people move babel config into .babelrc
   * use source-map for better line/column hint in coverage report
   * better line/column display for mocha error stack traces

2015-12-03 0.3.4 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.3.4
   * fix v0.3.3 isparta coverage report issue

2015-12-02 0.3.3 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.3.3
   * fix wrong line number when printing mocha stacktrace

2015-12-01 0.3.2 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.3.2
   * update dependency
   * fix bad coverage report issue when using istanbul 0.3.8+
   * rename API: .colloectIstanbulCoverage() into .collectIstanbulCoverage()

2015-11-07 0.3.1 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.3.1
   * update dependency

2015-10-20 0.3.0 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.3.0
   * **BREAK CHANGE** rename initIstanbulHookHack to initModuleLoaderHack
   * new option: options.isparta to support isparta

2015-09-02 0.2.5 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.2.5
   * update dependency

2015-08-17 0.2.4 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.2.4
   * prevent error when empty files are included

2015-08-06 0.2.3 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.2.3
   * new option: options.transpile.babel.omitExt
   * new option: options.transpile.coffee.omitExt

2015-07-25 0.2.2 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.2.2
   * unlock strict dependency

2015-07-23 0.2.1 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.2.1
   * support coverage threshold
   * new option: options.threshold
   * new option: options.thresholdType
   * new .failWithThreshold() API

2015-07-23 0.2.0 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.2.0
   * sourceMaps on stack traces when mocha test failed
   * prevent error when mocha is not installed
   * prevent error when babel sourceMap is not enabled
   * prevent error when coffee sourceMap is not enabled
   * new .enableStackTrace() and .disableStackTrace() API

2015-05-18 0.1.3 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.1.3
   * new .initIstanbulHook() and .colloectIstanbulCoverage() API
   * support any test frameworks
   * add jasmine tests example

2015-05-12 0.1.2 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.1.2
   * update dependency (babel)

2015-05-07 0.1.1 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.1.1
   * update dependency (babel, gulp, istanbul)
   * update devDependency (mocha, coffee-script, jsdom)

2015-03-06 0.1.0 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.1.0
   * Transpile .jsx or .js with https://github.com/babel/babel (6to5)
   * Support transpiler include/exclude options

2015-01-06 0.0.5 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.0.5
   * Support cleanup callback

2014-12-31 0.0.4 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.0.4
   * Better comment intend logic

2014-12-31 0.0.3 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.0.3
   * Supports sourceMap distribution to comments in istanbul reports

2014-12-31 0.0.2 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.0.2
   * Supports .coffee testing

2014-12-30 0.0.1 https://github.com/zordius/gulp-jsx-coverage/releases/tag/v0.0.1
   * Initial Release
