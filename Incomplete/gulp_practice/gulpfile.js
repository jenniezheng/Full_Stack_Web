var gulp = require('gulp');

var concat = require('gulp-concat');
 // Concatenate JS Files
gulp.task('scripts', function() {
    return gulp.src('src/js/*.js')
      .pipe(concat('main.js'))
      .pipe(gulp.dest('build/js'));
});
 // Default Task
gulp.task('default', ['scripts']);