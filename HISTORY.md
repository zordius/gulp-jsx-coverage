HISTORY
=======

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
