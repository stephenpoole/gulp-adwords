# gulp-adwords
Validates banner ads for upload to the AdWords network. Based on the [Adwords HTML5 Validator](https://h5validator.appspot.com/adwords).

#Getting started  
```
npm install gulp-adwords
```

#Example  
```
var gulp = require('gulp'),
	adwords = require('gulp-adwords')

gulp.task('default', function() {
	gulp.src('./banner/**/*')
		.pipe(adwords({verbose:true, filesize:150, name:'Banner', environment:'adwords'}))
})
```

#Options  
verbose - Toggles verbose logging. Defaults to `false`.  
filesize - Sets the max filesize for FILESIZE_CHECK. Defaults to `150`.  
name - Sets the name displayed in the log. If none is set, uses the title of the html page. Defaults to undefined.  
environment - Sets the environment for GWD_ENVIRONMENT_CHECK if using Google Web Designer. Valid environments are `adwords`, `doubleclick`, `admob` and `default`. Defaults to `adwords`.
