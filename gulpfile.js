var gulp = require('gulp'),
	rename = require('gulp-rename'),
	adwords = require('./')

gulp.task('default', function() {
	gulp.src('./build/compiled/test.compiled/**/*')
		.pipe(adwords({verbose:true, filesize:150, name:'Test1', environment:'adwords'}))
})