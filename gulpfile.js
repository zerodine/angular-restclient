var gulp = require('gulp');
var jsdoc = require("gulp-jsdoc");
var gutil = require("gulp-util");
var jsdoc2md = require("gulp-jsdoc-to-markdown");
var rename = require("gulp-rename");
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');
var ngannotate = require('gulp-ng-annotate');
var stripDebug = require('gulp-strip-debug');
var karma = require('karma').Server;
var iife = require('gulp-iife');

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

gulp.task('doc-html', function () {
    gulp.src("./src/**/*.js")
        .pipe(jsdoc('./doc/html'))
});

gulp.task("doc-md", function(){
    return gulp.src("src/**/*.js")
        .pipe(jsdoc2md())
        .on("error", function(err){
            gutil.log(gutil.colors.red("jsdoc2md failed"), err.message)
        })
        .pipe(rename(function(path){
            path.extname = ".md";
        }))
        .pipe(gulp.dest("./doc/md"));
});

gulp.task('doc', ['test'], function() {
    gulp.start('doc-html', 'doc-md');
});

gulp.task('test', function(done) {
    new karma({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('build', function() {
    gulp.start('test', 'js', 'doc')
});