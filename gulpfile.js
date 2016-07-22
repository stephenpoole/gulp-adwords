var gulp = require('gulp'),
	rename = require('gulp-rename'),
	validator = require('./')

gulp.task('default', function() {
	gulp.src('./build/compiled/test.compiled/**/*')
		.pipe(validator({verbose:false}))
})