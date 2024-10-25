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


1.  @@include('./../blocks/header.html') - подключаем в файле post1.html
2.  @@include('blocks/header.html') - подключаем в файле index.html
3. <a href="./../index.html">Main page</a> - ссылка со страницы post.html