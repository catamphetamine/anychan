* Можно вынести в локализацию: "Тред не найден", "Настройки сохранены".

* Можно добавить выбор темы: дневная, ночная.

* Можно добавить `notify()` при нажатии на тред, который уже "не найден", и при сохранении настроек.

* Можно добавить переключатель языка в настройках.

* Можно показывать последний пост под каждым тредом в списке тредов, и содержимое этого поста тоже сокращать мб как-то. При клике на такой пост - можно переводить на страницу треда на кликнутый пост.

* Можно сделать какую-нибудь кнопку "Развернуть картинки", которая может разворачивать все `<PostAttachments/>` в `fit="width"` (например, для fap-тредов, тредов типа "засмеялся — проиграл").

* Можно сделать какую-нибудь кнопку "Посмотреть все картинки", которая может запускать slideshow со всеми картинками треда (например, для fap-тредов, тредов типа "засмеялся — проиграл").

* Можно сделать `PropTypes` для thread, comment, board.

* Можно передавать в `setPostLinkUrls` в options объект `messages` с переводами.

* Списки скрываемых слов можно разделить по названиям. У скрытых сообщений можно выводить причину скрытия в скобках (название списка слов).

* Скрытые сообщения при цитировании называть как "Скрытое сообщение (причина)". Не вставлять цитату "in reply to" для скрытых сообщений.

* Если при цитировании сообщения `getPostText()` не вернул чего-то, то можно добавлять `attachment` в `inline-quote`, который в `webapp-frontend` может выводиться как `{ attachment ? <PostAttachment inline/> : content }`.

* Можно оформить `utility` в виде пакета `chan-parser`, экспортирующего класс `DvachParser` с пока пустыми `options`. `new Parser().parseComments()`, `.parseThreads()`, `.parseBoards()`.

* Можно сделать Redux action для получения списка "топа тредов".

* Где-нибудь справа или сверху у списка тредов можно сделать переключатель вида "Новые | Популярные".

* Можно показывать темы в "уменьшенном" виде: брать `getPostText(post)`, триммить получившуюся строку через `trimText()`, при этом увеличив длину, и добавив приоритетный тримминг по переводу на новую строку (`"\n"`), а не по концу предложения, и выводить рядом кнопку-ссылку "Показать полностью" (как вконтакте). При этом будет показываться только "основная" картинка треда: слева, вписанная в квадрат (`<Picture fit="cover"/>`).

* При автозамене кавычек на парные (`«»`) они могут ставиться неправильно, когда весь текст в кавычках разделён другими блоками. Например: `"Цитата <strong>блок</strong>" "Вторая цитата"` -> `"Цитата <strong>блок</strong>« »Вторая цитата"`. При подобной автозамене кавычек можно проставлять флаг, если попалась первая непарная кавычка, и в случае проставления такого флага дальше уже не автозаменять кавычки.

* Можно перематывать на пост при переходе по ссылке вида `/board/thread#post`. Такую же перемотку можно сделать при нажатии на ссылках вида "Сообщение", потому что обычный "anchor" перематывает так, что перекрывается <Header/>-ом, а также router при этом подгружает страницу, что можно обойти используя `replaceLocation()`.

* Можно сделать какой-нибудь архиватор треда. Картинки и видео можно скачивать в виде `Blob`'ов через `fetch()`. Далее эти `Blob`'ы можно упаковывать вместе с `index.html`, в котором может быть записан JSON постов треда, и через javascript этот JSON может отображаться в разметку `<body/>`. Далее, `index.html`, копия JSON'а и `Blob`'ы, видимо, могут быть записаны в ZIP-архив (тоже `Blob`), который уже потом может быть скачан из браузера в виде файла.

```js
const response = await fetch("url")
response.blob()
```

```js
var zip = new JSZip();

zip.file("Hello.txt", "Hello World\n");

var img = zip.folder("images");
img.file("smile.gif", imgData, {base64: true});

zip.generateAsync({type:"blob"}).then(function(content) {
    // see FileSaver.js
    saveAs(content, "example.zip");
});

/*
Results in a zip containing
Hello.txt
images/
    smile.gif
*/
```

* Ссылки на `youtu.be` и `youtube.com` можно заменять на видео внутри поста, как если бы это был бы прикреплённый файл (по клику такое видео открывается в слайдшоу).

* Могла бы быть какая-то проверка прокси при открытии страницы с выводом сообщения в случае неработы прокси.

* +N делать не во весь thumbnail, а в правом верхнем углу, круглешком. Максимум один ряд thumbnails.

* Не показывать оригинал для gif.

* мб выводить thread.posts с 1 по 3 (а мб и не выводить).

* Сокращать длинные посты и делать "Read more".

* Сделать endless scrolling подгрузку (будет перезапрашивать список тредов всех с первой страницы, фильтровать по уже показанным, и выдавать не показанные).

* На странице "Настройки" (сохраняющиеся в local storage) - proxy url и ignore words regexp.

* `localStorage`

```
try {
	// Local storage limit is about 5-10 megabytes.
  localStorage.setItem("name", "Hello World!")
} catch (error) {
	// No consistent error code for "quota exceeded" error.
	// http://chrisberkhout.com/blog/localstorage-errors/
  // if (error === DOMException.QUOTA_EXCEEDED_ERR) {
  //   alert('Quota exceeded')
  // }
  alert('Quota exceeded')
}
```

* Generate preview from post content. `while (node of tree) { if (node.content is 'string') { length += node.content; } next(); }`. `if (length > maxContentLength) { return partialTree }`. `currentNode.content = slice(0, lengthLeft + (sentenceEnd || paragraphEnd))`. preview max lines < full text max lines threshold. line score ~ 80. score contents. `lineOfTextScore = Math.ceil(length / lineScore)`. lineOfTextScore = Math.max(1, lineLength / lineScore).

* More button dots:

<svg aria-label="Show options" class="octicon octicon-kebab-horizontal" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM13 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path></svg>

* Ссылки вида `https://www.youtube.com/watch?v=c_tSDJD1Jf8` преобразовывать в youtube video attachment.

* Если картинка (не thumbnail) очень большая, то не грузить её. Мб всегда показывать только thumbnail, если не нажато "развернуть все картинки".

* `postShape: { account: accountShape, //.isRequired }` — как-то вынести тоже в виде плагина мб.

* `postPostLinkShape`, `postSpoilerShape`, `postNewLineShape` — как-то вынести тоже в виде плагина мб.

* Можно сделать кнопку "развернуть все картинки" для тредов типа "засмеялся".

* Move into some kind of a plugin: `else if (content.type === 'spoiler') { return <span className="spoiler" key={i}>{content.text}</span> }`.

* Move into some kind of a plugin: `else if (content.type === 'post-link') { return <PostLink key={i}>{content}</PostLink> }`.

* Move into some kind of a plugin: `else if (content.type === 'quote') { return <q key={i}>{content.text}</q> }`.

* (maybe) Comment tree expansion.