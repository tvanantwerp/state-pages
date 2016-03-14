'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    webserver = require('gulp-webserver');

gulp.task('default', ['moveIndex', 'moveImages', 'moveJavascript', 'webserver', 'watch']);

gulp.task('moveIndex', function () {
  gulp.src('./src/index.html')
  .pipe(gulp.dest('./dist/index.html'));
});

gulp.task('moveImages', function () {
  gulp.src('./src/images/**/*')
  .pipe(gulp.dest('./dist/images/'));
});

gulp.task('moveJavascript', function () {
  gulp.src('./src/js/**/*')
  .pipe(gulp.dest('./dist/js/'));
});

gulp.task('webserver', function () {
  gulp.src('./dist')
  .pipe(webserver({
    fallback: 'index.html',
    livereload: true,
    open: true,
  }));
});

gulp.task('watch', function () {
  gulp.watch('./src/index.html', ['moveIndex']);
  gulp.watch('./src/images/**/*', ['moveImages']);
  gulp.watch('./src/js/**/*', ['moveJavascript']);
});
