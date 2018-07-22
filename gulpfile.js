var gulp = require('gulp');
var ts = require('gulp-typescript');
var nodemon = require('gulp-nodemon');
var webpack = require('webpack-stream');
var rimraf = require('rimraf');

gulp.task('typescript', function() {
  var project = ts.createProject('tsconfig.app.json');
  return gulp.src('app/**/*.ts')
    .pipe(project())
    .js
    .pipe(gulp.dest('build'));
});

gulp.task('build', ['typescript']);

gulp.task('start', ['build'], function() {
  nodemon({
    script: 'build/index.js',
    watch: 'build'
  });
});

gulp.task('watch', function() {
  gulp.watch(
    [
      'client/src/**/*.ts',
      'client/src/**/*.html',
      'client/src/**/*.scss'
    ], ['webpack']
  );
});

gulp.task('dev', ['start'], function() {
  gulp.watch('app/**/*.ts', ['typescript']);
  gulp.watch(
    [
      'client/src/**/*.ts',
      'client/src/**/*.html',
      'client/src/**/*.scss'
    ], ['webpack']
  );
});
