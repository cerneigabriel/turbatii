'use strict';

// Load plugins
const autoprefixer = require('autoprefixer');
const browsersync = require('browser-sync').create();
const cp = require('child_process');
const cssnano = require('cssnano');
const del = require('del');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const { src, dest } = require('gulp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const webpack = require('webpack');
const webpackconfig = require('./webpack.config.js');
const webpackstream = require('webpack-stream');

// BrowserSync
function browserSync(done) {
	browsersync.init({
		server: {
			baseDir: './public/'
		},
		port: 3000
	});
	done();
}

// BrowserSync Reload
function browserSyncReload(done) {
	browsersync.reload();
	done();
}

// Clean src
function clean() {
	return del(['./public/src/']);
}

// Optimize Images
function images() {
	return gulp
		.src('./src/img/**/*')
		.pipe(newer('./public/src/img'))
		.pipe(
			imagemin([
				imagemin.gifsicle({ interlaced: true }),
				imagemin.jpegtran({ progressive: true }),
				imagemin.optipng({ optimizationLevel: 5 }),
				imagemin.svgo({
					plugins: [
						{
							removeViewBox: false,
							collapseGroups: true
						}
					]
				})
			])
		)
		.pipe(gulp.dest('./public/src/img'));
}

function fonts() {
	return gulp
		.src('./src/fonts/**/*.{eot,svg,ttf,woff,woff2}')
		.pipe(newer('./public/src/fonts'))
		.pipe(gulp.dest('./public/src/fonts'));
}

// CSS task
function css() {
	return gulp
		.src('./src/scss/app.scss')
		.pipe(plumber())
		.pipe(sass({ outputStyle: 'expanded' }))
		.pipe(gulp.dest('./public/src/css/'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(postcss([autoprefixer(), cssnano()]))
		.pipe(gulp.dest('./public/src/css/'))
		.pipe(browsersync.stream());
}

// Lint scripts
function scriptsLint() {
	return gulp.src(['./src/js/**/*', './gulpfile.js']);
	// .pipe(plumber())
	// .pipe(eslint())
	// .pipe(eslint.format())
	// .pipe(eslint.failAfterError())
}

// Transpile, concatenate and minify scripts
function scripts() {
	return (
		gulp
			.src(['./src/js/app.js'])
			.pipe(plumber())
			.pipe(
				babel({
					presets: [
						[
							'@babel/env',
							{
								modules: false
							}
						]
					]
				})
			)
			// .pipe(webpackstream(webpackconfig, webpack))
			// folder only, filename is specified in webpack config
			.pipe(gulp.dest('./public/src/js/'))
			.pipe(browsersync.stream())
	);
}

// Jekyll
// function jekyll() {
//   return cp.spawn("bundle", ["exec", "jekyll", "build"], { stdio: "inherit" });
// }

// Watch files
function watchFiles() {
	gulp.watch('./src/scss/**/*', css);
	gulp.watch('./src/js/**/*', gulp.series(scriptsLint, scripts));
	gulp.watch(
		['./public/**/*', './src/**/*'],
		gulp.series(
			// jekyll,
			browserSyncReload
		)
	);
	gulp.watch('./src/fonts/**/*', fonts);
	gulp.watch('./src/img/**/*', images);
}

// define complex tasks
// const js = gulp.series(scriptsLint, scripts);
const build = gulp.series(
	clean,
	gulp.parallel(
		css,
		images
		// jekyll
		// js
	)
);
const watch = gulp.parallel(watchFiles, browserSync);

// export tasks
exports.images = images;
exports.css = css;
// exports.js = js;
// exports.jekyll = jekyll;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.fonts = fonts;
exports.default = build;
