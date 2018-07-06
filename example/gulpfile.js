var adwords = require('../');
var gulp = require('gulp');

var tests = [
    {
        test: function(html, files) {
            return false;
        },
        message: 'YOU LOSE!',
        name: 'LOSING_TEST'
    }
];

gulp.task('default', function() {
    //will pass
    gulp.src('./banners/passed/**/*').pipe(
        adwords({
            filesize: 150,
            name: 'Passing Banner',
            environment: 'adwords'
        })
    );

    // environment won't match
    gulp.src('./banners/environment_mismatch/**/*').pipe(adwords());

    // multiple errors
    gulp.src('./banners/multiple/**/*').pipe(adwords());

    // custom test
    gulp.src('./banners/passed/**/*').pipe(
        adwords({ name: 'Custom Test Banner', customTests: tests })
    );
});
