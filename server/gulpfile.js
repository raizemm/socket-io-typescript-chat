const gulp = require("gulp");
const ts = require("gulp-typescript");
const nodemon = require('gulp-nodemon');
const del = require('del');
const runSequence = require('run-sequence');
const tsProject = ts.createProject("tsconfig.json");

gulp.task('build', ['clean'], function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("./dist"));
});

gulp.task('clean', function() {
	return del(['dist/**', '!dist'], {
		force: true,
	})
});

gulp.watch('src/**/*.ts', ['build']);

gulp.task('start', function () {
	nodemon({
		script: 'dist/index.js',
	})
});

gulp.task('default', function(done) {
	runSequence('build', 'start', () => {
		// console.log('Run something else');
		done();
	});
});