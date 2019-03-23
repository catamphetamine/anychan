react-website: add @serverSideRender(({ children: string }) => string) (и убрать `renderContent: false`, включая readme и -example)






auto-embed audio links and video links (like youtube links).

If a thread is in bump limit show a waterline after the last bumping message (including the last one maybe) with a sailing ship icon and some text ("This thread has reached bump limit and will eventually disappear").





Добавить в списке досок подсказку сверху (cookie, кнопка "OK"), что "Add boards to the top of this list by clicking the ☆ icon on them".

Ссылка на доску на странице треда — чтобы не загружала каталог заново, а использовала текущий.

На странице доски: "☆ Add to favorites", "Refresh (icon)", "All threads", "New threads". На широких экранах — иконки дополняются текстом. На мобильных — первые два только иконками. Может быть расположение кнопок — справа.

На странице треда: "☆ Track this thread".

Добавить кнопку "Go to Top" (видимо, слева, так как справа будет статус загруженности сообщений).

При скрытии сообщения — перегенерировать setInReplyToQuotes для последующих сообщений.






Add voting (maybe stored in `localStorage`, colored and disabled both if already voted)

Возможно не разворачивает YouTube video на iPhone.

Не листает slideshow на iPhone — видимо, speed = 0.

Dismiss content preview if the rest content is small (< 20%, for example).

react-website: disable links while navigating; dispatch(goto) and dispatch(redirect) should return promises which wait until there's no active navigation (poll 100ms).

React time ago обновлять в request animation frame и по одному.

Show preload initially почему чёрным у basic page в webpack-example.

Заменить глобальную крутилку на маленькие крутилки в onBoardClick и onThreadClick.

Post attachments sort чтобы нормировал thumbnail height на max height (на всякий случай, на возможное будущее что-то).

Во время загрузки картинки в слайдшоу можно выводить миниатюру заблюренную, и поверх неё уже "крутилку" на подложке.

перенести иконки меню в sidebar (но не показывать их в мобильных)

replace the global spinner with smaller spinners (on thread card, on boards panel). The spinner will still show on history navigation and initially.

Not insert read more inside links.

цитируемое сообщение может быть пустым, если состоит только из цитат: в таком случае можно перезапускать `getPostText()`, но уже без skip inline quotes.

Если `link.postWasDeleted`, то цитату выводить без ссылки, и `title="Deleted message"`.


Локали собирать в один json — брать локаль и поверх неё делать 'default_locale_messages' (таким образом, отсутствующие сообщения будут присутствовать на английском).


раскрывать твиты (service="twitter")

при цитировании в getPostText ссылки можно заменять на `"[link to www.google.com]"`, если есть `messages`.

можно переделать `import configuration from` через `externals.configuration`

Add 2ch.hk/po likes (upvotes, downvotes)

When parsing youtube videos first try YouTube API, then "oembed" (if errored or if no YouTube API key supplied; detect YouTube 403 status for API key quota reached). Add `fetchInfo: false` flag for offline tests.

Parse Vimeo links analogous to YouTube links and embed them in comments.

Maybe add SoundCloud to `parseServiceLink` and embed soundcloud player in comments.

Сделать sidebar scroll через библиотеку (для фаерфокс):
https://grsmto.github.io/simplebar/
https://github.com/Grsmto/simplebar/blob/master/examples/react/src/App.js

Make relative `attachmentUrl` and `attachmentThumbnailUrl` and `fileAttachmentUrl` for `kohlchan.net`

expand replies into posts in redux/chan








При догрузке сообщений обновлять "ответы" у предыдущих постов.

Перегенерировать preview (и цитаты поста, и preview сообщений с ними) при загрузке видео и твитов.

Пункт "Скрыть": добавляет id поста в `localStorage.settings.hiddenPosts`, и ставит посту в state .hidden = true, и перерендеривает сам пост. `settings.hiddenPosts` — "first in, first out" список, например, на 1000 постов. Проверить скрытие на постах и темах (+ обновление страницы).

Цвета делать через hsla и convert hex to hsla js.

сделать настройку переключатель темы, и "Custom CSS" с expandable pre "Show example".

.theme--custom {
	--: ...;
}

activate night mode button, refactor font themes from json to body class

Возможно, вынести игнор в пост-процессинг (а мб и не выносить).

Dark theme:

    background: #1C1C1C;
    color: #AAA;


При переходе по ссылке сообщения: загружать область этого сообщения и перематывать на него сразу. При клике на ссылке вида "цитата сообщения" — сначала проверять, показано ли оно, и если не показано, то показывать его, и потом перематывать на него (предыдущие сообщения пока не скрывать).

При переходе по ссылке сообщения: показывать -5 и +5 до/от него. При скроллинге: "ещё ..." либо внизу, либо вверху. При нажатии на "ещё ..." не скрывать сообщения при скроллинге. На всякий случай делать кнопки (или ссылки) "Показать предыдущие" и "Показать следующие", если скроллинг не успеет подгрузить.

Мб добавить в слайдшоу кнопку поиска по iqdb: https://iqdb.org/?url=http://i.4cdn.org/a/1552023338925s.jpg






Можно сделать пункт меню "Игнорировать этого автора" (по authorId), и тогда будет особый фильтр на скрытие сообщений по authorId (и будет писать "Скрытое сообщение (автор {authorId})").

сделать постраничность и парсить только те комментарии, которые показаны на текущий момент (парсинг может занимать много времени). "показать ответы" на пост будет показывать по нажатию крутилку, пока все "ответы" не подгрузятся (видимо, строить очередь как "сообщения на первой странице" + "ответы на них" + "сообщения на второй странице"; те сообщения, которые уже загружены, пропускать).


When opening comments page: show "... more" button on the bottom right side. As the user scrolls down the counter updates (when a comment's top border becomes visible on screen). When the user scrolls down to the last comment the "... more" button hides moving below the bottom of the screen (animated). The button should be clickable (loads all comments on click and hides moving below the bottom of the screen).




Replies count - a clickable button. On click — expand replies tree (shifted). If expanded single reply, and that reply has a single reply, then proceed expanding, until there're either more than a single reply or no replies.




сделать подгрузку сообщений, и внизу плашку справа "ещё ..." ("... more") (+ посмотреть дизайн на мобильном).



Один человек спрашивал, можно ли перелистывать видео автоматически, если оно закончилось. https://stackoverflow.com/questions/2741493/detect-when-an-html5-video-finishes




Поскольку ссылки на YouTube (и, видимо, твиттер) парсятся после выполнения `setInReplyToQuotes()`, то цитаты могут иметь вид "> youtube.com/watch?v=...", а не "> Video".
Можно было бы запускать `setInReplyToQuotes()` после предварительного парсинга ссылок, где будут засекаться ссылки на YouTube видео, и будут помечаться как "Video".
Но при этом цитата могла бы быть "> Video Title" вместо "> Video", а при таком раскладе она не будет такой.
Так что, видимо, после полного парсинга поста смотреть, какие есть "ответы" на него (`post.replies`), и для этих ответов заново перегенерировать `setInReplyToQuotes()`, чтобы было "> Video Title".
Это будет касаться как уже показанных постов, так и тех, которые "в очереди" на показ.






Вынести correctGrammar, ignore и прочие в пост процессинг

Настройки фильтров (интерфейс и redux) переделать так, что кастомные фильтры расширяют список игнора по умолчанию, и сделать switch для отключения списка игнора по умолчанию.

// мб поднять прокси для 2ch.hk на каком-нибудь vscale/selectel.



2ch: limit 40mb post attachments, limix max attachments count.


автопарсить сайты и емейлы в тексте.


* Показывать сообщения по мере скроллинга. Парсить сообщения по мере показа (parseCommentText), или как-то после показа, по одному, через requestAnimationFrame, а если доскроллил — то там принудительно очередную порцию, и потом снова по одному.


* Показывать URL на страницах ошибок.

* Вместо большого Preload можно показывать маленькие: по клику на доске, по клику на треде. Большой оставить можно для изначальной загрузки.

* Подгружать YouTube video после вывода контента. Сделать parse... синхронными.

* Проверить, что посты не перерендериваются при изменении массива в Redux.

* Отмечать закрытые и sticky треды.

* Сделать `title` (через `getMessages()`) на значках ApplicationMenu. Убрать сообщение "Тред" из локализации.

* В `parseBoard()` добавить `bumpLimit`, `imageLimit` (только `4chan`), `showFlags` (`enable_flags` у `2ch`, `country_flags` у `4chan`), `showUserIds` (`user_ids` у `4chan`).

* Выделять сообщения администраторов и модераторов (`getMessages()`: `role.admin`, `role.moderator`).

* Помечать "закрытые" треды — как в списке тредов доски, так и на странице треда.

* Помечать "тонущие" треды (`bumplimit: 1` у `4chan`, `!endless` и `board.bump_limit` у `2ch`) — как в списке тредов доски, так и на странице треда.

* Переделать список досок с таблицы на `.boards-list` с заданной шириной URL-а доски, и с `text-overflow: ellipsis` для описания доски.

* Выделять текущую доску в Sidebar цветом :active.

* Google Analytics ID сделать параметром в шаблоне для production, а для development — не добавлять скрипт GA.

* Slideshow: stop changing X scroll position if Y scroll threshold is reached.

* Темизацию можно переделать с проставления переменных тега `body` на добавление в конец `body` элемента `<style id="theme-vars">body { ... }</style>`.

* Можно добавить ID и флаги (флаги можно брать по URL как в `react-phone-number-input`).

* Close slideshow on pan vertical.

* Можно стилизовать и перевести страницы ошибок.

* Add link to github issues in footer.

* Синий цвет не особо подходит в качестве base-color (ссылки, например). Изменить его на что-то более тёплое, и добавить комплементарный цвет.

* У каждой настройки можно делать `<Switch/>` "По умолчанию" ("Default") для сброса настроек.

* Возможны случаи, когда конкретной строки перевода нет в `messages` для языка. В таких случаях брать из `en`. Вместо `getMessages(locale).path` писать `getMessages(locale).get('path')`, и там уже разделять по точке (`translate.js`).

* Ограничить выдачу страниц тредов и комментов ипользуя <OnScrollTo/>, потому что ютубовый токен используется, да и проц может нагружать. Посмотреть, что при <OnScrollTo/> не перерендериваются верхние посты (мб сделать их <PureComponent/>s).

* Вследствие использования <OnScrollTo/> скроллбар уже не отражает реальных объёмов страницы, поэтому добавить мб где-то сверху полоску "сколько ещё осталось текста".

* 4chan post:

```
https://www.google.com/recaptcha/api2/reload?k=6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc
https://www.google.com/recaptcha/api2/userverify?k=6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc

https://sys.4chan.org/b/post

FormData

Check `image_limit` from Board's info from `boards.json`.
Check `max_comment_chars` from Board's info from `boards.json`.
Check `cooldowns.replies` from Board's info from `boards.json`.

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

* Можно починить каким-то образом доступ в "скрытые разделы" 2ch.hk после оставления поста.

* Можно перенести header влево на десктопах, а на мобильных — вниз. На десктопе: раздел "ИЗБРАННОЕ", раздел "ВСЕ ДОСКИ", внизу или вверху — кнопки ночного режима и настроек (может с подписями, может без). Раздел "ИЗБРАННОЕ": рядом справа — плюс и троеточие. При нажатии на плюс: автокомплит со списком досок вида `/<b color="blue">доска</b> — Название доски...`. Троеточие — подменю с пунктом "Редактировать". При активации редактирования справа у досок в избранном появляется карандаш и крестик (переименование и убирание из избранного), а также можно гипотетически в перспективе будет доски перетаскивать, меняя их положение в списке (список избранных досок также можно редактировать в виде JSON'а в настройках). На мобильных: стандартное мобильное меню снизу. Пункты: десктопный раздел с досками (иконка — "список"), ночной режим, настройки.

* Можно сделать картинки, которые грузятся только когда до них почти доскроллишь.

* Иконку количества комментариев можно сделать пожирнее (или наоборот).

* Можно добавить выбор темы: дневная, ночная. Иконка вверху — полумесяц. Анимацию можно сделать как вконтакте. Добавить скриншоты дневного и ночного режимов на iOS в readme.

* Можно сделать "захардкоженную" сортировку досок по тематике для форчана.

* Можно сделать кнопку scroll to top (в mobile: как у reverso, в desktop: слева горизонтальную, или как вконтакте — вся полоса под списком досок, показывающая надпись и иконку при наведении мыши).

* Можно сделать сохранение выбранной темы в настройках.

* При нажатии на ссылки вида "Сообщение" (а также при нажатии на дате сообщения) происходит добавление "якорей" в истории браузера: можно делать на этих ссылках `onClick` с `event.preventDefault()`, чтобы история не разбухала, и прокручивать до сообщения по нажатой ссылке яваскриптом.

------------------------------------

* Можно написать в tumba.ch

* Можно интегрировать с LynxChan (http://lynxhub.com/lynxchan/): http://lynxhub.com/lynxchan/res/722.html.

* Написал в hispachan.org

* Можно напиать в arisuchan.

https://github.com/arisu-dev/arisuchan

```
setBoards(
        Board.fromSiteNameCode(this, "art and design", "art"),
        Board.fromSiteNameCode(this, "culture and media", "cult"),
        Board.fromSiteNameCode(this, "cyberpunk and cybersecurity", "cyb"),
        Board.fromSiteNameCode(this, "personal experiences", "feels"),
        Board.fromSiteNameCode(this, "psychology and psychonautics", "psy"),
        Board.fromSiteNameCode(this, "arisuchan meta", "q"),
        Board.fromSiteNameCode(this, "miscellaneous", "r"),
        Board.fromSiteNameCode(this, "киберпанк-доска", "ru"),
        Board.fromSiteNameCode(this, "science and technology", "tech"),
        Board.fromSiteNameCode(this, "paranoia", "x"),
        Board.fromSiteNameCode(this, "zaibatsu", "z"),
        Board.fromSiteNameCode(this, "diy and projects", "Δ"),
        Board.fromSiteNameCode(this, "programming", "λ")
);
```

https://arisuchan.jp/ru/catalog.json

https://arisuchan.jp/ru/res/15.json

* Можно написать в lainchan (не активен).

https://github.com/lainchan/lainchan

https://github.com/vichan-devel/vichan-API/

```
setBoards(
  Board.fromSiteNameCode(this, "Programming", "λ"),
  Board.fromSiteNameCode(this, "Do It Yourself", "Δ"),
  Board.fromSiteNameCode(this, "Security", "sec"),
  Board.fromSiteNameCode(this, "Technology", "Ω"),
  Board.fromSiteNameCode(this, "Games and Interactive Media", "inter"),
  Board.fromSiteNameCode(this, "Literature", "lit"),
  Board.fromSiteNameCode(this, "Musical and Audible Media", "music"),
  Board.fromSiteNameCode(this, "Visual Media", "vis"),
  Board.fromSiteNameCode(this, "Humanity", "hum"),
  Board.fromSiteNameCode(this, "Drugs 3.0", "drug"),
  Board.fromSiteNameCode(this, "Consciousness and Dreams", "zzz"),
  Board.fromSiteNameCode(this, "layer", "layer"),
  Board.fromSiteNameCode(this, "Questions and Complaints", "q"),
  Board.fromSiteNameCode(this, "Random", "r"),
  Board.fromSiteNameCode(this, "Lain", "lain")
);
```

https://lainchan.org/sec/catalog.json

https://lainchan.org/sec/res/4243.json

* Можно добавить 8ch.net:

https://8ch.net/boards.json

https://8ch.net/now/threads.json

https://8ch.net/now/res/1.json


* Можно добавить kohlchan.net:

https://kohlchan.net

https://encyclopediadramatica.rs/List_of_*chan_boards


* Можно добавить wizchan.org:

https://wizchan.org/

* sushigirl.us (не активен):

```
setBoards(
  Board.fromSiteNameCode(this, "artsy", "wildcard"),
  Board.fromSiteNameCode(this, "sushi social", "lounge"),
  Board.fromSiteNameCode(this, "site meta-discussion", "yakuza"),
  Board.fromSiteNameCode(this, "vidya gaems", "arcade"),
  Board.fromSiteNameCode(this, "cute things", "kawaii"),
  Board.fromSiteNameCode(this, "tasty morsels & delights", "kitchen"),
  Board.fromSiteNameCode(this, "enjoyable sounds", "tunes"),
  Board.fromSiteNameCode(this, "arts & literature", "culture"),
  Board.fromSiteNameCode(this, "technology", "silicon"),
  Board.fromSiteNameCode(this, "internet death cult", "hell"),
  Board.fromSiteNameCode(this, "dat ecchi & hentai goodness", "lewd")
);
```

https://sushigirl.us/lounge/catalog.json

https://sushigirl.us/lounge/res/4980.json

* Список активных чанов:

https://github.com/Floens/Clover/tree/dev/Clover/app/src/main/java/org/floens/chan/core/site/sites

* Можно добавить иконку звёздочки ("Добавить тред в избранное"). При нажатии — анимация (как лайка в твиттере, например).

* В мобильном меню добавить кнопку "Избранные треды". Как-то подсвечивать её, когда появляются новые сообщения там. Туда же буду попадать треды, в которых пользователь оставил комментарий. При появлении ответов — будет так же подсвечиваться, и ещё будет появляться красный значок количества ответов.

* Можно ограничить ширину колонки с комментариями, и при нажатии на тред переключать на список комментариев как в iOS (Navigator animation). При этом кнопка "назад" (с названием доски) будет с такой же (но обратной) анимацией переключать на список тредов.

* Можно создать раздел "горячее" с "самыми горячими тредами" (активно только в рамках доски). Для этого может быть иконка в меню (как для настроек и ночного режима). На дваче тоже есть "Топ тредов" (по доскам). На форчане, видимо, [нет подобного адреса API](https://github.com/4chan/4chan-API/issues/64), но можно вычислять приближение "количества сообщений в минуту" вида: `thread.comments.length / ((Date.now() - thread.createdAt.getTime()) / 60 * 1000)`.

* Можно посмотреть, как цитируются ссылки на YouTube: в обычном сообщении они заменяются на название, или на `attachment`: можно посмотреть, в каком виде они появляются в `inline-quote`.

<!--
* `getPostText()` чтобы добавлял `\n\n` при сложении параграфов (например, `type="attachment"`). `attachment` можно заменять на "Picture" или "Video" (с локализацией). Если у `picture` или `video` есть `title`, то можно выводить его.
-->

* На десктопах может быть выводить картинку слева от текста (классический вид), если один `attachment`. А может и не выводить.

* Можно перематывать на пост при переходе по ссылке вида `/board/thread#post`. Такую же перемотку можно сделать при нажатии на ссылках вида "Сообщение", потому что обычный "anchor" перематывает так, что перекрывается <Header/>-ом, а также router при этом подгружает страницу, что можно обойти используя `replaceLocation()`.

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