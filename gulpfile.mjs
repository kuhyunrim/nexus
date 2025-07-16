'use strict';

import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
import sourcemap from 'gulp-sourcemaps';
import connectSSI from 'connect-ssi';
import ssi from 'gulp-ssi';
import concat from 'gulp-concat';
import sync from 'browser-sync';

const sass = gulpSass(dartSass);
const { series, parallel, src, dest } = gulp;

const browserSync = sync.create();
const { reload } = browserSync;

const app = 'app/';
const dist = 'dist/';
const resource = `assets/`;

const scssOptions = {
  outputStyle: 'expanded',
  indentWidth: 2,
  sourceComments: false,
};

const path = {
  dist: `${dist}`,
  dashboard: {
    src: `${app}${resource}dashboard/**/*.*`,
    dist: `${dist}${resource}dashboard`,
  },
  html: {
    src: `${app}**/*.html`,
  },
  css: {
    src: `${app}${resource}css/**/*.css`,
    dist: `${dist}${resource}css`,
  },
  library: {
    src: `${app}${resource}lib/*.js`,
    temp: `${app}${resource}js/lib`,
    dist: `${dist}${resource}js/lib`,
  },
  js: {
    src: `${app}${resource}js/**/*.*`,
    dist: `${dist}${resource}js`,
  },
  images: {
    src: `${app}${resource}img/**/*.*`,
    spr: `${app}${resource}img/sprite/*.*`,
    dist: `${dist}${resource}img`,
  },
  font: {
    src: `${app}${resource}font/**/*.+(otf|woff|woff2)`,
    dist: `${dist}${resource}font`,
  },
  scss: {
    src: `${app}${resource}scss/**/*.scss`,
    dist: `${app}${resource}css/`,
  },
  inc: {
    src: `${app}/inc/*.inc`,
  },
};

export const dashboard = () => {
  return gulp.src(path.dashboard.src).pipe(gulp.dest(path.dashboard.dist));
};

export const html = () => {
  return gulp
    .src(path.html.src)
    .pipe(
      ssi({
        root: app,
      })
    )
    .pipe(gulp.dest(path.dist));
};

export const js = () => {
  return gulp.src(path.js.src).pipe(gulp.dest(path.js.dist));
};

export const css = () => {
  // function css() {
  return gulp.src(path.css.src).pipe(gulp.dest(path.css.dist));
};

export const img = async () => {
  return await gulp
    .src(path.images.src)
    .pipe(gulp.dest(path.images.dist));
};


export const font = () => {
  return gulp.src(path.font.src).pipe(gulp.dest(path.font.dist));
};

export const concatJs = () => {
  return (
    gulp
      .src(path.library.src)
      .pipe(concat('lib.js'))
      .pipe(gulp.dest(path.library.temp))
  );
};

export const scss = () => {
  return gulp
    .src(path.scss.src)
    .pipe(sourcemap.init())
    .pipe(sass(scssOptions).on('error', sass.logError))
    .pipe(sourcemap.write())
    .pipe(gulp.dest(path.scss.dist));
};
export const scssBuild = () => {
  return gulp.src(path.scss.src).pipe(sass(scssOptions).on('error', sass.logError)).pipe(gulp.dest(path.scss.dist));
};

export const server = () => {
  browserSync.init({
    open: 'external',
    server: {
      baseDir: app,
      middleware: [
        connectSSI({
          baseDir: `app/`,
          ext: '.html',
        }),
      ],
    },
    startPath: 'html/dashboard.html',
    online: true,
    notify: false,
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false,
    },
  });

  gulp.watch(path.scss.src, scss);
  gulp.watch(path.css.src).on('all', reload);
  gulp.watch(path.js.src).on('all', reload);
  gulp.watch(path.library.src).on('all', concatJs);
  gulp.watch(path.html.src).on('all', reload);
  gulp.watch(path.images.src).on('all', reload);
};

// exports.clean = clean;
// export server = server;
export const dev = series(scss, concatJs, server);
export const build = series(html, scssBuild, css, js, img, font, dashboard);

export default dev;
