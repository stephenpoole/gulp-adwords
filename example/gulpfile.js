var gulp = require('gulp'),
	adwords = require('../index')

gulp.task('default', function() {
	//will pass
	gulp.src('./banners/passed/**/*')
		.pipe(adwords({verbose:false, filesize:150, name:'Passing Banner', environment:'adwords'}))

	//environment won't match
	gulp.src('./banners/environment_mismatch/**/*')
		.pipe(adwords({verbose:false}))
})