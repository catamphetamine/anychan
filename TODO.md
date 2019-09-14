react-website: add @serverSideRender(({ children: string }) => string) (и убрать `renderContent: false`, включая readme и -example)

После обновления до `react-redux@6` убрать `getWrappedInstance()` во всех кодах.



`react-website`:

Check redirect in preload. Maybe make default initialClientSideRender flag. Add custom preload indicator. Check forceUpdate really updating the comment in updateItem(i). Check youtube video images height non loaded.

Мб сделать в react-website что-нибудь, чтобы последний компонент route'а всегда re-mount-ился при смене location.





Добавить голосование (upvotes/downvotes) на `2ch.hk`.







Release `social-components` npm module.

Release `imageboard` npm module. Move API docs to `imageboard/docs` leaving "This document has been moved to [`imageboard/docs/...`](...)" notes in this repo. Rename `2ch.hk.md` to `makaba.md`, `4chan.org.md` -> `4chan.md`.






У треда хранить количество комментариев в тот раз, когда прочитывал тред (`visitedCommentsCount`), но при этом комментарии могут удаляться, и тогда счётчик съедет, и не покажет "+N" в каталоге. Для таких случаев хранить ещё и `updatedAt`, и смотреть, изменилась ли она. Если изменилась, а новых комментариев нету, то показывать что-нибудь типа "+?", или просто "+".

Для коллекций типа `...-comment` в UserData (например, latestReadComment или ownComments) допускать, что комментарий может быть удалён, и поэтому как-то делать fallback до первого существующего предыдущего комментария, например (в случае с latestReadComment).

Не подсвечивать текущую доску в списках "Досок" и "Всех Досок", если уже показан в сайдбаре подсвеченный отслеживаемый тред. Аналогично, не подсвечивать текущую доску в списке "Всех Досок", если она уже показана в списке "Досок" в сайдбаре.

В хедере показывать мб квадратную картинку треда. Если picture spoiler, то делать blur в хедере.

Если тред отслеживается, то помечать его иконкой в каталоге (мб звездой оранжевой).

Синхронизировать добавление/удаление tracked threads между вкладками (localStorage events) — вообще, синхронизировать таким образом всю UserData (прочитанность комментариев, тредов, и т.п.), и вызывать `onUserDataChange()`.

После удаления треда из списка отслеживаемых показывать "Тред удалён из списка. Отменить". Для удалённых тредов — не показывать. Для существующих — показывать как-то, мб через Notification.

У списка "Избранных" досок - шестерёнка (по нажатию — загружает список `getAllBoards()`, если не `chan.allBoards`), которая включает режим редактирования (без ссылок), показывающий поле добавления и поиска новой доски и кнопки "x" (убирания из списка) у добавленных досок, а сами доски при этом — перетаскиваемые.

Проставлять `autoAddFavoriteBoards: false` при убирании доски из favorite boards, и больше не добавлять доски в "избранное" автоматически.

Порядок отслеживаемых тредов:

Сначала треды с новыми ответами (упорядоченные по количеству новых ответов, и далее по "от недавних ответов к давним"), потом треды с новыми комментариями (упорядоченные по количеству новых комментариев, и далее по "от недавних комментариев к давним"; свои треды — выше остальных и упорядоченные по "от недавних комментариев к давним"), потом свои треды (упорядоченные по "от недавних последних комментариев к давним"), потом свои истёкшие треды (упорядоченные по "от недавних последних комментариев к давним"), потом все остальные треды, упорядоченные по "от недавних последних комментариев к давним"), потом все не-свои истёкшие треды треды, упорядоченные по "от недавних последних комментариев к давним".

Ограничивать список отслеживаемых тредов, например, пятью-десятью, и показывать кнопку "Показать все" (Show all).

При нажатии на "Показать все" (отслеживаемые треды) можно показывать и фокусировать сверху какой-нибудь Search Bar, потому что отслеживаемых тредов может быть много. Искать по toLowerCase().includes().

Сделать кнопку «показать истёкшие» (на подуровне "показать все", но только если есть "показать все", иначе — на верхнем уровне) в списке отслеживаемых тредов. "Истёкшие треды" будут показываться в самом конце списка, упорядоченные по "от недавних последних комментариев к давним".








На странице доски сделать две вкладки: "Все" и "Новые" (или: "Новые ответы" ("New comments") и "Новые треды" ("New threads")). На вкладке «Новые» показывать треды по дате создания, и после списка "ещё не увиденных" (определеямых по попаданию на экран целиком при скролле или при user input, как описано уже) тредов рисовать черту, писать «Просмотрено» и показывать список остальных тредов. На вкладке «Новые» показывать счётчик "ещё не увиденных" тредов ("+N" или просто "N").

На странице доски в BoardOrThreadMenu можно сделать кнопку обновления списка тредов (содержимое и значок вкладки "Новое", и т.д.).

Сохранять черновики текста комментариев и ответов в `localStorage`, и очищать их при истечении тредов.

В `VirtualScroller.itemState` — хранить не просто `showReplyForm`, но и её `content`, вместе с attachments и прочими полями формы.





Add floating "Back", "Add new comment/thread", "Go to top" buttons:

На мобильных: "< Доска" ("назад") — слева снизу, "^ наверх" — справа снизу. Кнопки сами — круглые, мб не большие, без текста.

На десктопах (с размера, когда видно sidebar слева): "< Доска" ("назад") — полоска слева, на пустом месте, темнеет по наведению мыши, наверху иконка-стрелка; "^ наверх" — полоска справа, на пустом месте, темнеет по наведению мыши, наверху иконка-стрелка.

Кнопка "Ответить", "Написать комментарий", "Создать тред": круглая кнопка-плюс. Иконка — плюс. Раскрывает форму отправки сообщения (выезжает снизу в `position: fixed`, добавляя padding bottom странице; после отправки сообщения — уезжает вниз).






При заходе на страницу: сортировать отслеживаемые треды в порядке обновления и обновлять их по порядку.

В мобильном меню показывать значок уведомлений ("красный"), если есть новые комментарии в отслеживаемых тредах.

В Application.didMount запускать обновляльщик отслеживаемых тредов: через интервал в 15 минут будет в секунду обновлять по одному треду, показывая спиннер в сайдбаре (и пересортировывать после каждого обновлённого треда). Писать время refreshedAt, addedAt, latestCommentDate (для измерения возможного рейтинга stale thread), newCommentsCount, newRepliesCount.

Помечать наиболее поздние прочитанные сообщения и треды:
* в virtual scroller по скроллу ручному (не программному), когда они полностью попали в экран.
* по любому user input-у (keydown, mousemove threshold, scroll, click, etc), если есть какие-то "не прочитанные" комментарии или треды в списке, и они полностью попали в экран.

При "прочтении" непрочитанных сообщений в треде (как описано выше) — обновлять UserData, что перерендерит счётчики уведомлений и пересортирует список отслеживаемых тредов.

Сортировать треды отслеживаемые сначала по тем, в которых replies (по количеству), потом те, в которых комментарии (по количеству), потом остальные.

Если в треде есть новые сообщения, то показывать рядом со счётчиком иконки сообщений их количество вида "+N": так пользователь может узнать, насколько много комментариев появилось в треде с того момента, как он в него заходил в прошлый раз.

Можно сделать обновления в thread tracker через service workers (не зависят от открытости/закрытости сайта).






Check <video/> border (focused).

Сохраняется ли фокус на видео, когда autoPlay меняется с false на true в slideshowMode.

Maybe add hotkeys for "Expand attachments" and "Start slideshow".

Toggle search on Ctrl/Cmd + F.

Expand attachments: max height === screen height - header/footer height.


Show the "bump limit" indicator in the "Watched threads" list for threads that have reached their "bump limit".

Как-то помечать цветом (или полоской слева, или ещё как-то) own comments, own threads, replies to own comments.



В цитатах можно показывать link.content и service link icon вместо link.url, и для youtube video добавлять иконку youtube. Также можно к "Картинка" добавлять иконку картинки (или даже вставлять ту картинку, которая цитируется, в уменьшенном видео), а к "Видео" — иконку видео (или картинку preview в уменьшенном виде).

Также можно в цитатах зацензуренные слова делать не квадратами, а красным спойлером, как обычно. Но квадраты останутся, например, для автогенерации thread.subject.




Ссылку на доску в шапке сделать как "goBack()".

При ответе в тред сделать галку "Не отслеживать комментарии в этом треде".


Redo screenshots.




Может быть проставлять постам что-то типа commentQuoteText, чтобы не вычислять его каждый раз.

При нажатии на ссылки вида "Сообщение" (а также при нажатии на дате сообщения, или на цитате сообщения) — неанимированно скроллить на этот комментарий плюс top offset на высоту Header'а. При нажатии на ссылки вида "Сообщение" (а также при нажатии на дате сообщения, или на цитате сообщения) происходит добавление "якорей" в истории браузера — делать на этих ссылках `onClick` с `event.preventDefault()`, чтобы история не разбухала.

Мб делать какую-то кнопку "Вернуться" (со стрелкой в соответствующем направлении: вверх или вниз) после перехода к некоторому сообщению по ссылке на него (включая цитату).

Что, если цитируемое сообщение не загружено (например, если показываются сообщения с "самого позднего прочитанного") — в таких случаях сначала показывать предыдущие сообщения и делать им `parseContent()`, а уже потом крутить на них.

При заходе на сайт по ссылке на комментарий — прокручивать на этот комментарий.

Highlight the linked comment when navigating to comment URL (maybe add a border around it or something).

При переходе по ссылке comment URL или board URL: мотать список досок так, чтобы текущая доска там была где-нибудь ближе к верху на экране.

Implement comment "..." menu: Copy URL (only on Thread page), Report, Hide, etc.


If a thread is in bump limit show a waterline after the last bumping message (including the last one maybe) with a sailing ship icon and some text ("This thread has reached bump limit and will eventually disappear").






Throw `404` on `2ch` on `/catalog` if board is `ageRestricted` and no `usercode_auth` cookie is present.


Show age restricted warning modal (age restriction consent) when navigated to either `ageRestricted` board or a thread on an `ageRestricted` board. Set `ageRestrictionConsent={true}` cookie.

(`2ch.hk` sets `ageallow` cookie to `1` in this case)

Получая доступ ко взрослым разделам Двача вы осознаете и соглашаетесь со следующими пунктами:

•Содержимое этого сайта предназначено только для лиц, достигших совершеннолетия. Если вы несовершеннолетний, покиньте эту страницу.
•Сайт предлагается вам "как есть", без гарантий (явных или подразумевающихся). Нажав на "Я согласен", вы соглашаетесь с тем, что Двач не несет ответственности за любые неудобства, которые может понести за собой использование вами сайта, а также что вы понимаете, что опубликованное на сайте содержимое не является собственностью или созданием Двача, однако принадлежит и создается пользователями Двача.
•Существенным условием вашего присутствия на сайте в качестве пользователя является согласие с "Правилами" Двача, ссылка на которые представлена на главной странице. Пожалуйста, прочтите Правила внимательно, так как они важны.

Я согласен и подтверждаю, что мне есть 18 лет
Уйти отсюда



Можно починить каким-то образом доступ в "скрытые разделы" `2ch.hk` после оставления поста (перенаправлять cookies через CORS-proxy).



При догрузке сообщений ("автообновление треда") обновлять список `replies` у предыдущих постов (и обновлять счётчик у иконки ответов, перерендеривая пост целиком — если её не было, то будет она и счётчик "1").



Сделать "экспорт треда" в json с картинками в base64.



Добавить "скрытие" авторов ("Скрытое сообщение (автор {authorId})"), комментариев, тредов.

При скрытии комментария — перегенерировать автоматически сгенерированные цитаты для комментариев, цитирующих его.

"Скрытые сообщения" в постах называть как "Скрытое сообщение (причина)". Например, "(автор {authorId})".


На `2ch.hk` сохранять в UserData выбранную иконку (board-wide setting).



Load instagram posts through CORS proxy (if configured).


При показе цитаты на "Удалённый комментарий" делать его без ссылки и с `title="Deleted comment"`.

Обновление в `react-time-ago` можно вынести в `requestIdleCallback()`.




Сделать отключаемым список игнорируемых слов.

Сделать настраиваемым список игнорируемых слов в настройках (можно сделать галку: "расширяет список по умолчанию" или "заменяет список по умолчанию").




На странице доски можно добавить кнопку "Обсуждаемое" ("Active"), где показывать "топ" тредов (по "скорости" постинга в них). Такой API есть на `2ch.hk`.





При автозамене кавычек на парные (`«»`) они могут ставиться неправильно, когда весь текст в кавычках разделён другими блоками. Например: `"Цитата <strong>блок</strong>" "Вторая цитата"` -> `"Цитата <strong>блок</strong>« »Вторая цитата"`. При подобной автозамене кавычек можно проставлять флаг, если попалась первая непарная кавычка, и в случае проставления такого флага дальше уже не автозаменять кавычки.




--------------------------------------------------------------------------------------------

Можно создать issue в `arisuchan` и `lainchan`, `4chan` и `8ch`. Также можно создать треды на их чанах.
https://github.com/arisu-dev/arisuchan
https://github.com/lainchan/lainchan

Можно добавить `tumba.ch` (у них свой движок по типу `4chan`).

Можно добавить `wizchan.org` (`4chan` api).
https://wizchan.org/

Можно отображать время изменения комментария (`updatedAt` в `lynxchan` API response).

Если бы чаны предоставляли API для топа тредов по всему чану вообще, то можно было бы сделать такой раздел меню. Иконка — "огонь".

Можно добавить анимацию (как в Твиттере) иконке "Добавить тред в избранное".

<!-- (caching won't work when auto-scrolling right to "new unread comments") Cache board and thread data: при заходе на доску показывать старый каталог (при заходе в тред показывать старые сообщения), и крутилку показывать, что обновляется. (можно где-нибудь в Header'е показывать). -->

Парсинг треда можно распараллелить: можно парсить его в `requestIdleCallback()`, или можно парсить в Web Worker-е (отдельный тред). Время это не сократит, но отзывчивость интерфейса может увеличить за счёт непросадок FPS, хотя кто там что делает во время загрузки треда — думаю, разницы не будет.

Можно сделать "экспорт треда" в PDF (наверное, предпочтительнее будет PDF с expand attachments = true). Как тогда в PDF в файле экспорта будут представлены вложения-файлы (музыка, документы, архивы).

Можно сделать настройку "Левша" ("Изменяет порядок пунктов мобильного меню на обратный.").

Уведомления: дизайн — как в контакте ("Показать все" внизу). Можно использовать "системные уведомления" обозревателя. Разрешение на них можно запрашивать при первом постинге. Текст можно делать кастомный, или кастомное окошко в целом. Звук какой-нибудь можно прикрутить (мб с возможностью кастомизации URL'а этого звука в рамках какой-нибудь темы). Сделать настройку как в контакте: "Получать уведомления обозревателя" с description.

<!-- Уведомления хранить в UserData. -->

Мб снизить обратно поинты аттачментам. А мб и не снижать.

<!-- В списке отслеживаемых тредов показывать "[крутилка] Обновление" шрифтом 16px серым цветом наверху списка, когда он обновляется. -->

<!-- Список отслеживаемых тредов делить на две части: треды, отслеживаемые вручную (наверху), и треды, добавленные в отслеживаемые по ответу в них (внизу). -->

<!-- Во вкладке "Уведомления" — показывать также сообщения вида "Ваш комментарий набрал N лайков/дизлайков", если новое количество лайков/дизлайков отличается от предыдущего количества лайков/дизлайков "сильно": 0 -> >= 1, ... -->

Мб вынести кнопки меню треда/доски в основной хедер на десктопе (и сделать разделитель диагональный справа).

<!-- В режиме preview (mode === 'board') скрывать остальные attachments, и показывать кнопку "Show more attachments" ("Показать все вложения"). -->

<!-- Сделать страницу "/feed", где помещать сверху самые новые комментарии в отслеживаемых тредах, и на иконке "Feed" можно показывать красную точку под иконкой (как в инстаграме), если что-то новое появилось. ("самые новые" — в порядке даты получения этого "нового" в рамках отслеживания тредов, и показывать, начиная с после "последнего прочитанного") -->

<!-- Можно сделать раздел меню "Профиль", где будут разделы "Мои треды" и "Мои сообщения" с индикацией статуса (удалено или ещё не удалено): так могут сохраняться посты и треды, даже если сами треды уже того. Вход в настройки можно сделать через "Профиль", как в Инстаграме. -->

<!-- Ограничить ownComments и ownThreads длиной. trackedThreads — тоже. -->

<!-- Мб количество ответов не показывать в "Отслеживаемых тредах", а показывать их отдельно в "Уведомлениях". Сбрасывать статус нового в "Отслеживаемых тредах" и "Уведомлениях" при прочтении комментариев (при очередном обновлении, например; или если прочёл комментарии в этой же вкладке). -->

В слайдшоу: возможно, не показывать video preview, если размер preview очень мал, а сразу показывать HTML <video/>.

Maybe add loading indicator stripe on top instead of the default spinner + loading indicator stripe under board name when clicking it in boards list + loading indicator stripe under thread preview when clicking it in threads list (but then such loading stripe may be not visible to a user if a post is not fully visible on screen).

"Удалённое сообщение" можно перечёркивать, или делать серым, или писать "В ответ на удалённое сообщение:" ("In reply to a deleted comment") (серым). "Сообщение(я)(й)" можно заменить везде на "Комментарий(я)(й)". То же самое: заменить Message(s) на Comment(s).

<!-- Можно сделать страницу "Лента" (/feed) как в социальных сетях, на которой будут перечислены "отслеживаемые" треды, упорядоченные по "latest bump date". -->

При нажатии на "Показать все" (отслеживаемые треды) можно показывать и фокусировать сверху какой-нибудь Search Bar, в котором искать можно так: разбивать инпут по пробелам и прочей пунктуации (",", ".", "-", "—", ":", ";", "!", "?", "(", ")", "/"), и так же разбивать "boardId threadTitle", и далее искать пересечение этих индексов (причём последний "токен" можно матчить по подстроке).

Add a notification when a watched (or own) thread expires. Add a notification when watched (or own) thread reaches "bump limit".

Backup YouTube video api with oEmbed through CORS proxy (if configured).

В "Слайдшоу" можно добавить "Поиск в iqdb":
https://iqdb.org/?url=http://i.4cdn.org/a/1554643360980s.jpg


Можно сделать какой-нибудь архиватор треда. Картинки и видео можно скачивать в виде `Blob`'ов через `fetch()`. Далее эти `Blob`'ы можно упаковывать вместе с `index.html`, в котором может быть записан JSON постов треда, и через javascript этот JSON может отображаться в разметку `<body/>`. Далее, `index.html`, копия JSON'а и `Blob`'ы, видимо, могут быть записаны в ZIP-архив (тоже `Blob`), который уже потом может быть скачан из браузера в виде файла.

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

Могла бы быть какая-то проверка CORS-прокси при открытии страницы с выводом сообщения в случае неработы CORS-прокси.















































4chan post
==========

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