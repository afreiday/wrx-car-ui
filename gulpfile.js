var gulp = require('gulp');
var ts = require('gulp-typescript');
var nodemon = require('gulp-nodemon');
var sass = require('gulp-sass');

gulp.task('sass', function() {
  gulp.src('client/style/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('client/build'));
});

gulp.task('typescript', function() {
  var project = ts.createProject('tsconfig.json');

  return gulp.src('app/**/*.ts')
    .pipe(project())
    .js
    .pipe(gulp.dest('build'));
});

gulp.task('build', ['sass', 'typescript']);

gulp.task('run', function() {
  nodemon({
    script: 'build/index.js'
  });
});

gulp.task('start', ['build', 'run']);

gulp.task('watch', function() {
  gulp.watch('client/style/**/*.scss', ['sass']);
  gulp.watch('app/**/*.ts', ['typescript']);
});

gulp.task('dev', ['start', 'watch']);
