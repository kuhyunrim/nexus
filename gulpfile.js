const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

const paths = {
  scss: './app/assets/scss/**/*.scss',
  css: './app/assets/css',
  html: './app/**/*.html',
  js: './app/assets/js/**/*.js'
};

function scssTask() {
  return gulp
    .src(paths.scss)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.css))
    .pipe(browserSync.stream());
}

function serve() {
  browserSync.init({
    server: {
      baseDir: './app'
    },
    port: 3000,
    open: true,
    startPath: 'index.html'
  });

  gulp.watch(paths.scss, scssTask);
  gulp.watch([paths.css, paths.html, paths.js]).on('change', browserSync.reload);
}

// dist 폴더로 파일 복사
gulp.task('copy:html', function() {
  return gulp.src(paths.html)
    .pipe(gulp.dest('dist/html'));
});

gulp.task('copy:css', function() {
  return gulp.src(paths.css + '/**/*.css')
    .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('copy:js', function() {
  return gulp.src('app/assets/js/**/*.js')
    .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('copy:images', function() {
  return gulp.src('app/assets/images/**/*')
    .pipe(gulp.dest('dist/assets/images'));
});

gulp.task('copy:font', function() {
  return gulp.src('app/assets/font/**/*')
    .pipe(gulp.dest('dist/assets/font'));
});

gulp.task('build', gulp.series(
  scssTask,
  gulp.parallel('copy:html', 'copy:css', 'copy:js', 'copy:images', 'copy:font')
));

gulp.task('default', gulp.series(scssTask, serve));
