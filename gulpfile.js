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

gulp.task('webpack', function(cb) {
  rimraf('./dist', cb);
  gulp.src('./client/src/vendor.ts')
    .pipe(webpack({
      entry: {
        app: './client/src/main.ts',
        polyfills: './client/src/polyfills.ts',
        vendor: './client/src/vendor.ts'
      },
      output: {
        filename: '[name].js'
      },
			resolve: {
				extensions: ['.ts', '.js']
			},
      module: {
        rules: [
          {
            test: /\.ts$/,
            use: [{
              loader: 'ts-loader',
              options: {
                configFileName: 'tsconfig.json'
              }
            }]
          },
          {
            test: /\.html$/,
            loaders: ['to-string-loader', 'html-loader']
          },
          { test: /\.png$/, use: [ "url-loader?mimetype=image/png" ] },
					{
							test: /\.scss$/,
							loaders: ['to-string-loader', 'css-loader', 'sass-loader']
					}
        ]
      }
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['typescript', 'webpack']);

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
  gulp.watch('app/**/*.ts', ['typescript']);
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
