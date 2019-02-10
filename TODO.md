* Ограничить выдачу страниц тредов и комментов ипользуя <OnScrollTo/>, потому что ютубовый токен используется, да и проц может нагружать. Посмотреть, что при <OnScrollTo/> не перерендериваются верхние посты (мб сделать их <PureComponent/>s).

* `findPostLinks()` можно переписать без массивов (чтобы не создавала много массивов, а правила прямо "на месте").

* 4chan post:

```
https://www.google.com/recaptcha/api2/reload?k=6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc
https://www.google.com/recaptcha/api2/userverify?k=6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc

https://sys.4chan.org/b/post

FormData

Check `image_limit` from Board's info from `boards.json`.
Check `max_comment_chars` from Board's info from `boards.json`.
Check `cooldowns.replies` from Board's info from `boards.json`.
Check `thread.isClosed`.

withCredentials = true.

if (Main.board == 'q') {
  this.baseDelay = 60
  this.fileDelay = 300
  this.sageDelay = 600
}
else {
  this.baseDelay = 30
  this.fileDelay = 30
  this.sageDelay = 60
}

this.captchaDelay = 240


sel = UA.getSelection()
if (sel) {
  q += '>' + sel.trim().replace(/[\r\n]+/g, '\n>') + '\n'
}

form = postForm.parentNode.cloneNode(false);
form.setAttribute('name', 'qrPost');
form.innerHTML =
  '<input type="hidden" value="'
  + $.byName('MAX_FILE_SIZE')[0].value + '" name="MAX_FILE_SIZE">'
  + '<input type="hidden" value="regist" name="mode">'
  + '<input id="qrResto" type="hidden" value="' + tid + '" name="resto">';

https://github.com/4chan/4chan-JS/blob/8714d5fe9c138bdb0587c860a90a1289ffda65e3/extension.js

id="captchaFormPart"

row.innerHTML = '<img id="qrCaptcha" title="Reload" width="300" height="57" src="'
  + $.id('recaptcha_image').firstChild.src + '" alt="reCAPTCHA challenge image">'
  + '<input id="qrCapField" name="recaptcha_response_field" '
  + 'placeholder="reCAPTCHA Challenge (Required)" '
  + 'type="text" autocomplete="off" autocorrect="off" autocapitalize="off">'
  + '<input id="qrChallenge" name="recaptcha_challenge_field" type="hidden" value="'
  + $.id('recaptcha_challenge_field').value + '">';

Maybe check banned status on error:

QR.banXhr.open('GET', '//api.4chan.org/banned?' + Date.now())
if (status == 403)

// byteLength = encodeURIComponent(comment).split(/%..|./).length - 1;

MAX_FILE_SIZE: 2097152 // Board's `max_filesize` from `https://a.4cdn.org/boards.json`.
mode: regist // Whatever.
resto: 792190180 // Thread ID.
email: // (optional) Author email.
com: Like 2ch.hk/b/ ? // Comment text.
upfile: (binary) // (optional) An attachment (a picture or a webm video).
g-recaptcha-response: 03AF6jDqXUEXD6OJXDFm9i8hA-eQxsVWxSXiPDSTvUklz1oaVKZdl7-TR-SIXyElx1zypXqsJWkVI9WH3YU8VytGzV1IoV0Psxwwxo8Q9xw7j17-vpJ8s5WZ-oPzoS2CLOaQTbEe01ay0g8CdGsk9KqA8WsH40x3ZawoEZYWeuJlF53EHny_sWBCcVgps8QI-a1OUCI-2yuf_l-5NWXiY_AvdNdpjaZzWvEDTDmGeeiooOhbotYA-IJA6b7WeLalsNWa-UsYxOuOOdrizWHFjXR0Mk2ChpHca7VeyiuaBYZAwVXGc8YZVz5bUvGZ-8ruMRuE9Le208HjFG // Google ReCaptcha "response".

Access-Control-Request-Method: POST
Origin: http://boards.4chan.org
Referer: http://boards.4chan.org/
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36

Response:

<!DOCTYPE html><head><meta http-equiv="refresh" content="1;URL=http://boards.4chan.org/bant/thread/7466194#p7466464"><link rel="shortcut icon" href="//s.4cdn.org/image/favicon.ico"><title>Post successful!</title><link rel="stylesheet" title="switch" href="//s.4cdn.org/css/yotsubanew.685.css"></head><body style="margin-top: 20%; text-align: center;"><h1 style="font-size:36pt;">Post successful!</h1><!-- thread:7466194,no:7466464 --></body></html>

Check `<span id="errmsg" style="color: red;">Error: ...</span>`.

    if (this.status == 200) {
      if (resp = this.responseText.match(/"errmsg"[^>]*>(.*?)<\/span/)) {
        QR.reloadCaptcha();
        QR.showPostError(resp[1]);
        return;
      }
    }

Not exists:

<hr class="abovePostForm"><table style="text-align: center; width: 100%; height: 300px;"><tr valign="middle"><td align="center" style="font-size: x-large; font-weight: bold;"><span id="errmsg" style="color: red;">Error: Specified thread does not exist.</span><br><br>[<a href=http://boards.4chan.org/b/>Return</a>]</td></tr></table><br><br><hr size=1><div id="absbot" class="absBotText">

Spam:

<hr class="abovePostForm"><table style="text-align: center; width: 100%; height: 300px;"><tr valign="middle"><td align="center" style="font-size: x-large; font-weight: bold;"><span id="errmsg" style="color: red;">Error: Our system thinks your post is spam. Please reformat and try again.</span><br><br>[<a href=http://boards.4chan.org/r9k/>Return</a>]</td></tr></table><br><br><hr size=1><div id="absbot" class="absBotText">

access-control-allow-credentials: true
access-control-allow-headers: If-Modified-Since
access-control-allow-methods: GET, OPTIONS
access-control-allow-origin: http://boards.4chan.org

if (ids = this.responseText.match(/<!-- thread:([0-9]+),no:([0-9]+) -->/)) {
  tid = ids[1];
  pid = ids[2];

  if (Main.tid) {
    QR.lastReplyId = +pid;
    Parser.trackedReplies['>>' + pid] = 1;
    Parser.saveTrackedReplies(tid, Parser.trackedReplies);
  }
  else {
    tracked = Parser.getTrackedReplies(tid) || {};
    tracked['>>' + pid] = 1;
    Parser.saveTrackedReplies(tid, tracked);
  }
}
```

* Можно перенести header влево на десктопах, а на мобильных — вниз. На десктопе: раздел "ИЗБРАННОЕ", раздел "ВСЕ ДОСКИ", внизу или вверху — кнопки ночного режима и настроек (может с подписями, может без). Раздел "ИЗБРАННОЕ": рядом справа — плюс и троеточие. При нажатии на плюс: автокомплит со списком досок вида `/<b color="blue">доска</b> — Название доски...`. Троеточие — подменю с пунктом "Редактировать". При активации редактирования справа у досок в избранном появляется карандаш и крестик (переименование и убирание из избранного), а также можно гипотетически в перспективе будет доски перетаскивать, меняя их положение в списке (список избранных досок также можно редактировать в виде JSON'а в настройках). На мобильных: стандартное мобильное меню снизу. Пункты: десктопный раздел с досками (иконка — "список"), ночной режим, настройки.

* Можно сделать картинки, которые грузятся только когда до них почти доскроллишь.

* Иконку количества комментариев можно сделать пожирнее (или наоборот).

* Можно добавить выбор темы: дневная, ночная. Иконка вверху — полумесяц. Анимацию можно сделать как вконтакте. Добавить скриншоты дневного и ночного режимов на iOS в readme.

* Можно сделать "захардкоженную" сортировку досок по тематике для форчана.

* Close slideshow on pan vertical.

* Можно сделать кнопку scroll to top (в mobile: как у reverso, в desktop: слева горизонтальную, или как вконтакте — вся полоса под списком досок, показывающая надпись и иконку при наведении мыши).

* Можно сделать сохранение выбранной темы в настройках.

* При нажатии на ссылки вида "Сообщение" (а также при нажатии на дате сообщения) происходит добавление "якорей" в истории браузера: можно делать на этих ссылках `onClick` с `event.preventDefault()`, чтобы история не разбухала, и прокручивать до сообщения по нажатой ссылке яваскриптом.

------------------------------------

* Можно добавить иконку звёздочки ("Добавить тред в избранное"). При нажатии — анимация (как лайка в твиттере, например).

* В мобильном меню добавить кнопку "Избранные треды". Как-то подсвечивать её, когда появляются новые сообщения там. Туда же буду попадать треды, в которых пользователь оставил комментарий. При появлении ответов — будет так же подсвечиваться, и ещё будет появляться красный значок количества ответов.

* Можно ограничить ширину колонки с комментариями, и при нажатии на тред переключать на список комментариев как в iOS (Navigator animation). При этом кнопка "назад" (с названием доски) будет с такой же (но обратной) анимацией переключать на список тредов.

* Можно создать раздел "горячее" с "самыми горячими тредами" (активно только в рамках доски). Для этого может быть иконка в меню (как для настроек и ночного режима). На дваче тоже есть "Топ тредов" (по доскам). На форчане, видимо, [нет подобного адреса API](https://github.com/4chan/4chan-API/issues/64), но можно вычислять приближение "количества сообщений в минуту" вида: `thread.comments.length / ((Date.now() - thread.createdAt.getTime()) / 60 * 1000)`.

* Можно посмотреть, как цитируются ссылки на YouTube: в обычном сообщении они заменяются на название, или на `attachment`: можно посмотреть, в каком виде они появляются в `inline-quote`.

<!--
* `getPostText()` чтобы добавлял `\n\n` при сложении параграфов (например, `type="attachment"`). `attachment` можно заменять на "Picture" или "Video" (с локализацией). Если у `picture` или `video` есть `title`, то можно выводить его.
-->

* На десктопах может быть выводить картинку слева от текста (классический вид), если один `attachment`. А может и не выводить.

* Можно перематывать на пост при переходе по ссылке вида `/board/thread#comment-post`. Такую же перемотку можно сделать при нажатии на ссылках вида "Сообщение", потому что обычный "anchor" перематывает так, что перекрывается <Header/>-ом, а также router при этом подгружает страницу, что можно обойти используя `replaceLocation()`.

* Можно сделать `PropTypes` для thread, comment, board.

* Можно сделать кнопку в стиле "развернуть все картинки/видео в треде".

* Скрытые сообщения при цитировании называть как "Скрытое сообщение (причина)", и в Tooltip-е на причине (или рядом под "спойлером") — участок текста, который триггернул правило.

* Можно сокращать длинные сообщения каким-то образом. (мб по '\n', или по параграфу, или типа того). Ссылка "Read more" ("Показать полностью") будет разворачивать такие сообщения.

* Можно добавить переключатель языка в настройках.

* Можно сделать вывод "Топа тредов" для 2ch и "Популярных тредов" для 4chan (можно смотреть, как в мобильных приложениях они это выводят). Где-нибудь справа или сверху у списка тредов можно сделать переключатель вида "Новые | Популярные".

* Можно показывать последний пост под каждым тредом в списке тредов, и содержимое этого поста тоже сокращать мб как-то. При клике на такой пост - можно переводить на страницу треда на кликнутый пост.

* Можно сделать какую-нибудь кнопку "Развернуть картинки", которая может разворачивать все `<PostAttachments/>` в `fit="width"` (например, для fap-тредов, тредов типа "засмеялся — проиграл").

* Можно сделать какую-нибудь кнопку "Посмотреть все картинки", которая может запускать slideshow со всеми картинками треда (например, для fap-тредов, тредов типа "засмеялся — проиграл").

* У каждого поста выводить количество ответов на него.

* Посты похожи на треды — как их отличать? Можно ввести какой-то опознавательный знак треда доски, отличающего его от поста треда.

* Можно сделать просмотр ответов на пост по клику. На 2ch и 4chan такие "ответы" показываются по наведению мыши. Можно сделать что-нибудь типа клика по посту, и будет разворачиваться "вложенный" список комментариев, как в твиттере. При нажатии ещё раз — будет разворачиваться ещё раз. Можно допускать бесконечное количество уровней вложенности, например, сокращая отступ с определённого уровня вложенности. Можно показывать какую-то кликабельную полоску-индикатор, которая будет сворачивать поддерево (как в "Реддите").

* При автозамене кавычек на парные (`«»`) они могут ставиться неправильно, когда весь текст в кавычках разделён другими блоками. Например: `"Цитата <strong>блок</strong>" "Вторая цитата"` -> `"Цитата <strong>блок</strong>« »Вторая цитата"`. При подобной автозамене кавычек можно проставлять флаг, если попалась первая непарная кавычка, и в случае проставления такого флага дальше уже не автозаменять кавычки.

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

* Могла бы быть какая-то проверка прокси при открытии страницы с выводом сообщения в случае неработы прокси.

* Не показывать оригинал для gif.

* +N делать не во весь thumbnail, а в правом верхнем углу, круглешком. Максимум один ряд thumbnails.

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

* "More" button dots:

<svg aria-label="Show options" class="octicon octicon-kebab-horizontal" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM13 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path></svg>

* `postShape: { account: accountShape, //.isRequired }` — как-то вынести тоже в виде плагина мб.

* `postPostLinkShape`, `postSpoilerShape`, `postNewLineShape` — как-то вынести тоже в виде плагина мб.

* Move into some kind of a plugin: `else if (content.type === 'spoiler') { return <span className="spoiler" key={i}>{content.text}</span> }`.

* Move into some kind of a plugin: `else if (content.type === 'post-link') { return <PostLink key={i}>{content}</PostLink> }`.

* Move into some kind of a plugin: `else if (content.type === 'quote') { return <q key={i}>{content.text}</q> }`.

* (maybe) Comment tree expansion.