const gulp = require("gulp");
const ts = require("gulp-typescript");
const nodemon = require('gulp-nodemon');
const runSequence = require('run-sequence');
const tsProject = ts.createProject("tsconfig.json");

gulp.task("build", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("./dist"));
});

gulp.watch('src/**/*.ts', ['build']);

gulp.task('start', function () {
	nodemon({
		script: 'dist/index.js',

	})
});

gulp.task('default', function(done) {
	runSequence('build', 'start', function() {
		console.log('Run something else');
		done();
	});
});