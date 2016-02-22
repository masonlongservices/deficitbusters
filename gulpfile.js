"use strict";

var gulp = require("gulp");
var gulpClean = require("gulp-clean");
var browserify = require("browserify");
var reactify = require("reactify");
var streamMerge = require("event-stream").merge;
var sourceStream = require("vinyl-source-stream");

var DIR_SOURCE = "./src/";
var DIR_BUILD = "./build/";

gulp.task("clean", function(){
    return streamMerge([
        gulp.src(DIR_BUILD, {read: false}),
    ])
    .pipe(gulpClean());
});

gulp.task("build", ["clean"], function(){

    return streamMerge([
        
        browserify({
            entries: [DIR_SOURCE, "reactApp.js"].join(""),
            transform: [reactify],
        })
        .bundle()
        .pipe(sourceStream("bundle.js")),

        gulp.src([
            [DIR_SOURCE, "**"].join(""),
        ])

    ])
    .pipe(gulp.dest(DIR_BUILD));
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
