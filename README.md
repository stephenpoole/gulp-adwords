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

#Custom Tests  
  
You may include custom tests. The test function will be given the html as a string as well as the files found in an array.
  
```
var gulp = require('gulp'),
	adwords = require('gulp-adwords')

var tests = [
	{
		test: function(html, files) {
			return false  //will fail
		},
		message: 'Message to display if the test fails'
	}
]

gulp.task('default', function() {
	gulp.src('./banner/**/*')
		.pipe(adwords({customTests: tests}))
})
```

#Options  
verbose - Toggles verbose logging. Defaults to `false`.  
filesize - Sets the max filesize for `FILESIZE_CHECK`. Defaults to `150`.  
name - Sets the name displayed in the log. If none is set, uses the title of the html page. Defaults to undefined.  
environment - Sets the environment for `GWD_ENVIRONMENT_CHECK` if using Google Web Designer. Valid environments are `adwords`, `doubleclick`, `admob` and `default`. Defaults to `adwords`.  
customTests - Add custom tests  
complete - Function to call on complete. Gets passed an array of errors, if any.

#Licence  
Copyright (c) 2015 Red Lion Canada

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
