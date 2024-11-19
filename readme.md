# html
  |-*blocks*
  |    |- header.html
  |    |- footer.html
  |    |- nav.html
  |
  |-*blog*
  |    |- post1.html
  |    |- post2.html
  |
  |- contacts.html    
  |- index.html

# Include
1.  @@include('./../blocks/header.html') - подключаем в файле post1.html
2.  @@include('blocks/header.html') - подключаем в файле index.html
3. <a href="./../index.html">Main page</a> - ссылка со страницы post.html


# Заготовки Галп
/** 
 * 
 * 
 */
gulp.task('xxxx', function () {
    return gulp.src('./src/*.html')
        .pipe()
        .pipe(gulp.dest('./dist/'))
});
/** 
 * 
 * 
 */
gulp.task('xxxx', function () {
    return gulp.src('./src/')
        .pipe()
        .pipe()
});

/** 
 * 
 * 
 */
const xxx = require('xxx');

const { error } = require('console');
const { title } = require('process');
const changed = require('gulp-changed');

# Подключение svg sprite
в папке ./img/scg-sprite лежит файл sprite.svg, в него добавляем иконки по аналогии которые необходимо управлять
в файле _svg.scss css код для управление иконкой

<svg class="svg-icons">
    <use href="./../../img/svg-sprite/sprite.svg#phone"></use>
</svg>
