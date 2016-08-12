var gulp = require('gulp'),
	adwords = require('../index')

var tests = [
	{
		test: function(html, files) {
			return false
		},
		message: 'YOU LOSE!'
	}
]

gulp.task('default', function() {
	//will pass
	gulp.src('./banners/passed/**/*')
		.pipe(adwords({filesize:150, name:'Passing Banner', environment:'adwords'}))

	//environment won't match
	gulp.src('./banners/environment_mismatch/**/*')
		.pipe(adwords())
})