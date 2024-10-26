/* ============== VARS ============== */

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

/** Исходные карты для scss
 * 
 * 
 */
const sourceMaps = require('gulp-sourcemaps');

/** Объединяем медиа запросы
 * заблокировано, так как при использовании ломает исходные карты
 * 
 */
const groupMedia = require('gulp-group-css-media-queries');

/** отображение ошибок
 * 
 * 
 */
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');

/** webpack
 * 
 * 
 */
const webpack = require('webpack-stream');

/** bable
 * добавляем в таск JS
 * 
 */
const babel = require('gulp-babel');

/** imagemin
 * для сжатия картинок
 * 
 */
const imageMin = require('gulp-imagemin');

/** 
 * использование в картинках, HTML, JS, CSS
 * 
 */
const changed = require('gulp-changed');

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


/* ============== FUNCTIONS ============== */

/** функция для plumber
 * @title - передаем в переменную параметр для наблюдения, html, scss каждый в своих тасках
 * 
 */
const plumberNotify = (title) => {
    return {
        errorHandler: notify.onError({
            title: title,
            message: 'Error <%= error.message %>',
            sound: false
        })
    }
}


/* ============== TASKS ============== */

/** HTML
 * include for HTML
 * объеденяем все файлы для html, позволяет разделять блоки в разные файлы
 * plumber(plumberNotify('html')) - отслеживание ошибок при работе с файлами, передаем функцию plumberNotify('html') - со значением html
 * ['path', '!path'] - при необходимости забирать html из разных папок можно с помощью массива передавать в src, ! знак исключает добавление в сборку
 */
gulp.task('html', function () {
    return gulp.src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
        .pipe(changed('./dist/'))
        .pipe(plumber(plumberNotify('html')))
        .pipe(fileInclude({ fileIncludeConfig }))
        .pipe(gulp.dest('./dist/'))
});

/** SASS
 * обработка scss файлов
 * все файлы в папке scss вне зависимости от вложенности
 * sourceMaps.init() - инициализируем карты scss
 * sourceMaps.write() - записываем данные значений scss
 * groupMedia() - обрабатываем запросы на объединения media запросов /пока отключено, ломаются sourceMaps/
 * plumber(plumberSassConfig) - для отслеживания ошибок, и их отображения
 */
gulp.task('sass', function () {
    return gulp.src('./src/scss/*.scss')
        .pipe(changed('./dist/css'))
        .pipe(plumber(plumberNotify('SCSS')))
        .pipe(sourceMaps.init())
        .pipe(sass())
        // .pipe(groupMedia())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./dist/css'))
});

/** images
 * Копирование изображений
 * @src - любая папка внутри img и любой файл
*/
gulp.task('images', function () {
    return gulp.src('./src/img/**/*')
        .pipe(changed('./dist/img/'))
        .pipe(imageMin({ verbose: true }))
        .pipe(gulp.dest('./dist/img/'))
});

/** fonts
 * Копирование шрифтов
 * @src - любая папка внутри img и любой файл
 */
gulp.task('fonts', function () {
    return gulp.src('./src/fonts/**/*')
        .pipe(changed('./dist/fonts/'))
        .pipe(gulp.dest('./dist/fonts/'))
});

/** files
 * Копирование файлов для загрузки и скачивания на сайте
 * @src - любая папка внутри img и любой файл
 */
gulp.task('files', function () {
    return gulp.src('./src/files/**/*')
        .pipe(changed('./dist/files/'))
        .pipe(gulp.dest('./dist/files/'))
});

/** JS
 * src('./src/js/*.js') - забираем все файлы в папке js и объеденяем в один файл
 * файл js будет для каждой страницы, после чего он объединяется в один файл js
 * документация по нему в файле webpack.config.js
 * plumberNotify('JS') - добавляем для отслеживания ошибок
 * babel() - конфиг добавляем в файле packege.json
 */
gulp.task('js', function () {
    return gulp.src('./src/js/*.js')
        .pipe(changed('./dist/js/'))
        .pipe(plumber(plumberNotify('JS')))
        .pipe(babel())
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('./dist/js'))
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
    if (fs.existsSync('./dist/')) {
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
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts'));
    gulp.watch('./src/files/**/*', gulp.parallel('files'));
    gulp.watch('./src/js/**/*.js', gulp.parallel('js'));
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
    gulp.parallel('html', 'sass', 'images', 'fonts', 'files', 'js'),
    gulp.parallel('server', 'watch')
));
