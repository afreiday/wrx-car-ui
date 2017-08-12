var gulp = require('gulp');
var ts = require('gulp-typescript');
var nodemon = require('gulp-nodemon');
var webpack = require('webpack-stream');

gulp.task('typescript', function() {
  var project = ts.createProject('tsconfig.app.json');
  return gulp.src('app/**/*.ts')
    .pipe(project())
    .js
    .pipe(gulp.dest('build'));
});

gulp.task('webpack', function() {
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
            use: [{
              loader: 'html-loader'
            }]
          },
					{
							test: /\.scss$/,
							loaders: ['style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap']
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

gulp.task('dev', ['start'], function() {
  gulp.watch('app/**/*.ts', ['typescript']);
  gulp.watch('client/src/**/*.ts', ['webpack']);
});
