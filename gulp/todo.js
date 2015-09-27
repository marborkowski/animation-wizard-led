'use strict';

var gulp = require('gulp');
var todo = require('gulp-todo');

// generate a todo.md from your javascript files
gulp.task('todo', function() {
    gulp.src('src/app/**/*.js')
        .pipe(todo())
        .pipe(gulp.dest('./'));
    // -> Will output a TODO.md with your todos
});