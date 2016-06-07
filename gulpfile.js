var gulp = require('gulp'),
	rename = require('gulp-rename'),
	validator = require('./')

gulp.task('default', function() {
	gulp.src(['./build/test.html','./build/test1.html'])
		.pipe(validator('lol'))
		.pipe(rename({suffix:'.compiled'}))
		.pipe(gulp.dest('./build/compiled'))
})