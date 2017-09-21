var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

gulp.task('build', function () {
    return browserify('./resources/scripts/main.jsx')
    	.transform(babelify, {presets: ["es2015", "react"]})
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('./public/assets/js/'));
});

gulp.task('watch', ['build'], function () {
    return gulp.watch('./resources/scripts/*.jsx', ['build']);
});

gulp.task('default', ['watch']);