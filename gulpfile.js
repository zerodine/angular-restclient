var gulp = require('gulp');
var gutil = require("gulp-util");
var jsdoc2md = require("gulp-jsdoc-to-markdown");
var rename = require("gulp-rename");
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');
var ngannotate = require('gulp-ng-annotate');
var stripDebug = require('gulp-strip-debug');
var karma = require('karma').Server;
var iife = require('gulp-iife');
var fs = require("fs");

gulp.task('js', ['test'], function () {
    gulp.src([
        'src/angular-restclient.js',
        'src/lib/merge.js',
        'src/pojo/endpointInterface.js',
        'src/pojo/endpointAbstract.js',
        'src/pojo/endpoint.js',
        'src/pojo/endpointMock.js',
        'src/pojo/endpointConfig.js',
        'src/factory/model.js',
        'src/factory/mock.js',
        'src/factory/validator.js',
        'src/provider/api.js'
    ])
        .pipe(concat('angular-restclient.js'))
        .pipe(ngannotate())
        .pipe(iife())
        .pipe(gulp.dest('./dist'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest('./dist'))
});

gulp.task("doc", function() {
    return gulp.src("src/**/*.js")
        .pipe(concat("README.md"))
        .pipe(jsdoc2md({ template: fs.readFileSync("./readme.hbs", "utf8") }))
        .on("error", function(err){
            gutil.log("jsdoc2md failed:", err.message);
        })
        .pipe(gulp.dest("."));
});

gulp.task('test', function(done) {
    new karma({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('build', function() {
    gulp.start('test', 'js', 'doc');
});

gulp.task('default', function() {
    gulp.start('build');
});