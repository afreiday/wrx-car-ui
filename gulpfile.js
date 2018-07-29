var gulp = require('gulp');
var ts = require('gulp-typescript');
var nodemon = require('gulp-nodemon');

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

gulp.task('dev', ['start'], function() {
  gulp.watch('app/**/*.ts', ['typescript']);
});
