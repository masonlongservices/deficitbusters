"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var gulpClean = require("gulp-clean");
var browserify = require("browserify");
var reactify = require("reactify");
var streamMerge = require("event-stream").merge;
var sourceStream = require("vinyl-source-stream");

var DIR_SOURCE = "./src/";

gulp.task("build", function(){


    gulp.src([DIR_SOURCE, "*.less"].join(""))
    .pipe(less())
    .pipe(gulp.dest(DIR_SOURCE));
});

// WATCH
gulp.task("watch", ["build"], function(){
    gulp.watch([
        [DIR_SOURCE, "**"].join(""),
        [DIR_SOURCE, "components/", "**"].join(""),
        "./package.json",
        "./gulpfile.js"
    ], ["build"]);
});

// DEFAULT
gulp.task("default", ["watch"]);
