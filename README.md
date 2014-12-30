gulp-jsx-coverage
=================

Enable coverage on .JSX or .coffee files.

**This is not a gulp plugin, it just a task creator to help you deal with istanbul instrumenter and collect coverage report in gulp**

Usage
-----

```
gulp.task('your_task_name', require('gulp-jsx-coverage').createTask({
    options...
});
```
