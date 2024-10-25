/* ============== MAIN ============== */
const gulp = require('gulp');
const fileInclude = require('gulp-file-include'); // для использования include в html файлах
/** подключаем sass
 * 
 */
const sass = require('gulp-sass')(require('sass'));
/** сервер обновления страницы
 * 
 * 
 */
const server = require('gulp-server-livereload');
/** удаление папки dist - gulp-clean
 * @fs - для работы с файловой системой
 * 
 */
const clean = require('gulp-clean');
const fs = require('fs');


/* ============== VARS ============== */

/** конфиг для includeFiles
 * 
 * 
 */
const fileIncludeConfig = {
    prefix: '@@',
    basepath: '@file'
}
/** конфиг для startServer
 * 
 * 
 */
const startServerConfig = {
    livereload: true,
    open: true
}




/* ============== TASKS ============== */

/** HTML
 * include for HTML
 * объеденяем все файлы для html, позволяет разделять блоки в разные файлы
 */
gulp.task('html', function () {
    return gulp.src('./src/*.html')
        .pipe(fileInclude({ fileIncludeConfig }))
        .pipe(gulp.dest('./dist/'))
});

/** SASS
 * обработка scss файлов
 * все файлы в папке scss вне зависимости от вложенности
 */
gulp.task('sass', function () {
    return gulp.src('./src/scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./dist/css'))
});

/** images
 * Копирование изображений
 * @src - любая папка внутри img и любой файл
 */
gulp.task('images', function () {
    return gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./dist/img/'))
});

/** server
 * @src - забираем файлы для просмотра из папки dist
 * 
 */
gulp.task('server', function () {
    return gulp.src('./dist/')
        .pipe(server(startServerConfig))
});

/** clean
 * удаление папки dist при запуске таска
 * @done - условие дает возможность проверки если папки dist нет, то не будет ошибки папки
 * @clean({read: false}) - дает возможность удалить принудительно файлы
 */
gulp.task('clean', function (done) {
    if (fs.existsSync('./dist/'), {read: false}) {
        return gulp.src('./dist/')
            .pipe(clean())
    }
    done();
}); 

/** watch
 * *.scss, *.html - слежение за изменениями во всех файлах, любой уровень вложенности
 * ./src/img/ - смотрим за любыми файлами в папке img
 */
gulp.task('watch', function () {
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass'));
    gulp.watch('./src/**/*.html', gulp.parallel('html'));
    gulp.watch('./src/img/**/*', gulp.parallel('images'));
});

/* ============== USE TASK ============== */

/** Исполняемый файл gulp default
 * 
 * 'clean' - запуск таска очистки файлов строго только его
 * 'html', 'sass', 'images' - запуск всех остальных тасков для работы с файлами
 * 'server', 'watch' - и только в конце в любом порядке обновление страницы и слежение за файлами
 */
gulp.task('default', gulp.series(
    'clean', 
    gulp.parallel('html', 'sass', 'images'),
    gulp.parallel('server', 'watch')
));