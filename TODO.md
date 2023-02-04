// `react-pages`: add @serverSideRender(({ children: string }) => string) (и убрать `renderContent: false`, включая readme и -example)

// Мб сделать в `react-pages` что-нибудь, чтобы последний компонент route'а всегда re-mount-ился при смене location, даже если URL остался тем же: это решит те случаи, когда, например, на странице есть ссылка на саму себя (но это редкие случаи). Например, можно добавлять в `key` все параметры `route`'а.

// `react-pages`: Не unmount-ит страницу текущего треда при переходе по ссылке другого треда. https://github.com/4Catalyzer/found/issues/639





Add channel view mode: List or Grid.

Add toggle "Show"/"Hide" Threads List in sidebar button.





"Единый поиска игор тред" — почему-то в конце списка показывается, а следует его показывать вначале (`thread.onTop` and `thread.onTopOrder`).

Scroll threads list in left sidebar to top when navigating to a new channel in the right sidebar (or some other way).






* Сделать список тредов доски под разделом "Доски" в сайдбаре. Если пользователь находится на доске или на треде на доске. Ограничивать список тредов кнопкой "показать все" (show all). Например, можно показывать штук 20 самых "популярных", или "онлайновых", причём онлайновые можно выделять зелёной точкой. Популярность считать как-нибудь (по статусу недавнего комментария, и т.п. — как subscribed threads). Если пользователь находится на странице треда, то выделять этот тред в списке. Если доска ещё не загружалась (каталог), то не показывать "Треды". Также показывать значок закрытого треда. В общем, дизайн — как у tracked threads.








Replace Cancel / Reply buttons with an "X" and an "enter" square (maybe google "send button").

Показывать в списке тредов количество комментариев.

Как-нибудь подвыделять открытый тред в сайдбаре тредов.

* Пофиксить баг с флажками и написать коммент: https://github.com/catamphetamine/anychan/issues/12

* Сделать баннер на старом сайте — participate in beta.






Если зашёл сразу на страницу треда, потом случайно нажал BackButton, потом снова нажал на этот тред — делать быструю навигацию.

При заходе на страницу треда сразу — показывать item этого треда слева, и под ним кнопку "Show all threads", при нажатии на которую будут подгружаться треды (с progress indicator) и текущий тред будет выделен цветом, но не прокручен до, потому что он может быть на любой позиции.




Check design on all screens.
Check design of misc pages on all screens.
Check the design of the InReplyToModal on all screens.
Check the design of announcements on all screens.
Check all imageboards.







`boards.showRestBoards`

Под пунктом "Доски" сайдбара сделать кнопку "Показать все доски", которая будет показывать раздел "Ещё доски" в сайдбаре. По умолчанию этот раздел будет скрыт. Он будет показан, пока не добавлено как минимум одной favorite board, или если пользователь не находится на странице доски или треда. Если пользователь находится на странице доски или треда, то показывать текущую доску в сайдбаре выделенной внизу списка (до кнопки "показать ещё", если список частично скрыт) вне зависимости от того, добавлял ли пользователь эту доску в список "избранных" досок. Можно сделать кнопку "скрыть прочие доски", которая может скрывать список "Ещё доски".

У списка тредов сделать переключалку: Latest (Недавние) / Popular (Популярные).

* В режиме with "latest comments" у зелёных цитат слева нет border-а.

* Была ошибка при переключении режимов: при нажатии на режим "with latest comments" после режима "popular": [virtual-scroller] "onItemHeightChange()" has been called for item 0, but that item hasn't been rendered before. Ещё была с item: 2, 3, 4.

* Fix errors in console on Channel page (with "latest comments"): Post #xxxxxxx not found

* Проверить автообновление subscribed threads.

* Проверить автообновление subscribed threads когда открыт один из subscribed threads.

* Сделать фоны цветные.

* Если `channelView` стал недоступен для движка, то сбрасывать его как в initial `loadChannelPage`, так и постфактом в `settings`.

* Проверить, работают ли остальные imageboards.

* Задеплоить веб-сайт (пока без reddit).

* Попробовать постинг на `2ch.hk`.

* Сделать баннер на старом сайте. Сделать баннер со ссылкой на канал в телеграме.

* При заходе на страницу localhost:1234/2ch/b/273701928

```
    // `routeIndices` might be `undefined` after a `<Redirect/>`
    // is made and a user clicks the "Back" button in a web browser.
    // https://github.com/4Catalyzer/found/issues/632
    if (!routeIndices) {
        throw new Error('"'.concat(event.type, '" Redux action misses "routeIndices" property. This usually means that the target URL path "').concat(location.pathname, "\" didn't match any route. ").concat(location.pathname[0] !== "/" ? 'The target URL path is missing a leading slash: correct your routes configuration to include a leading slash for "' + location.pathname + '" path. ' : "", "See the issue for more info: https://github.com/4Catalyzer/found/issues/632"));
    }
```









Можно сделать возможность обновить список досок, минуя кеш. Это может быть использовано при обновлении списка "иконок" или "тегов" на какой-нибудь доске: если появилась новая иконка и пользователь её не видит потому что она "не найдена" в закешированных данных досок.





После жалобы на пост — автоматически скрывать его.





На новую версию сайта — не редиректы, а баннеры с краткой подсказкой нового сайти и способа миграции user data + settings





Check new `react-pages`' server-side rendering on webapp-frontend




Добавить возможность «Подписаться на ответы» к комментарию.







При первом заходе на канал — генерировать градиент для него, еслитема — дефолт

Для пользователей, у которых уже есть favorite channels — генерировать градиенты во время миграции

Может делать отступы по краям на мобильных у элементов Post (margin left / right).




['UserDataCleaner', 'Page inactive. Cancel clean-up'] — даже когда page active











Перегенерировать subscribedThreadStats в CommentReadStatusWatcher

Если пришло обновление subscribedThreadStats из другой вкладки, если возникла ситуация merge, если они разные, то ...



Remove: `console.log('[social-components-react] on touch')`




Migrate links to https://allchans.github.io/:

* anychan readme
* imageboard readme
* anychan github repo link
* anychan gitlab repo link
* imageboard github repo link
* imageboard gitlab repo link
* captchan.surge.sh — Add a banner on top
* catamphetamine.github.io/anychan — Add a banner on top
* edit telegram channel link



flush cached local storage (user data collections) on read latest comment in a thread



When local storage is not available, show a banner and use `MemoryStorage`.
`import isLocalStorageAvailable from './utility/storage/isLocalStorageAvailable.js'`



Test `OkCancelModal`.

Test Slideshow: "flow" mode and non-"flow" mode, разные режимы типа drag & scale, перелистывания и не перелистывания, ... Video fullscreen, etc.






Emit redux events on subscribed thread update progress (including external updates).

Show individual refresh indicators for subscribed threads (should work both for same tab and other tabs).

Initial subscribed thread update — fade in / fade out a two-arrow spinner (both in the sidebar section title and in the bottom right corner of the mobile menu button).

Add instant loading of thread pages when previous page was catalog (same board, only when clicking a thread card link, not in subscribed threads — add ‘cache’ property on a link), or it’s a back/forward navigation. Insta-load catalog pages on back/forward navigation. The back button should always be functional on mobile and desktop. Save and restore: scroller state, scroll position, data.

Красный кружок уведомлений о subscribed threads показывать на кнопке мобильного меню, если оно не открыто.

На мобильных можно начинать с открытого меню.

User data size: “view stats” button + modal.

On latest read comment change in a subscribed thread — update indication in sidebar (`subscribedThreadsUpdateInProgress`).

Update subscribed thread stats on latest comment read.

Maybe check "In Reply To" modal.

Remove or not remove comment: "There seems to be no style `<link/>` tag in development."





Background image сделать отдельным слоем `position: fixed` and `background-size: cover` and `background-repeat: no-repeat` and `background-position: center`.

Background image: for dark mode and for light mode. Maybe add a checkbox: "[x] Dark [x] Light".

Background image default settings: opacity 0.4, filter: grayscale(25%) blur(3px)

У доски можно будет настроить тему, которая будет применяться поверх выбранной по умолчанию.

Возможность назначать разные цвета для разных досок + avatar picture

Setting: "[x] Use Channel Theme"

Themes: document adding non-pattern background image and pattern background image (z-index: above non-pattern)

Add "Edit Theme" button above "Add Theme"

Background variations: Image, Gradient, Pattern.

First goes image, then goes gradient, then goes pattern.

Gradient example: `background: linear-gradient(blue, pink);`

У каждого из этих слоёв — параметр Opacity (+ фильтры на изображения)

Градиентную заливку для каждой доски можно настраивать в GUI: угол наклона и два цвета + прозрачность.

Выбор угла наклона можно сделать как в Телеграме:
https://telegram.org/file/464001940/3/78UcwEnPEuo.4799153.mp4/e4262626f9e88a0e4f

Можно сделать predefined color palette ("приятные цвета", или даже их сочетания):
https://telegram.org/blog/verifiable-apps-and-more

Noon to Dusk: `linear-gradient(to right, rgb(255, 110, 127), rgb(191, 233, 255))`
Hazel: `linear-gradient(to right, rgb(119, 161, 211), rgb(121, 203, 202), rgb(230, 132, 174))`

https://uigradients.com

Возможность упрощённого задания темы: выбор только оттенков (hue) для каждой доски: base color, accent color (тёмная и светлая темы).

Захостить шаблоны SVG на том же сайте и потом предлагать их как стандартные на выбор.

https://blog.1a23.com/wp-content/uploads/sites/2/2020/02/pattern-5.svg
https://blog.1a23.com/wp-content/uploads/sites/2/2020/02/pattern-6.svg

https://blog.1a23.com/2020/02/13/telegram-chat-backgrounds-patterns-extracted/

Выбирается цвет фона и цвет шаблона.

Background pattern size based on `aspect-ratio`:
https://developer.mozilla.org/en-US/docs/Web/CSS/@media/aspect-ratio

Можно попробовать фон: облака и градиент с красного нижнего на верхний серый.
То же самое можно попробовать с градиентом с персикового нижнего на фиолетово-розовый верхний.

Replace `var(--white-color)` with `var(--white-color, white)` in SVGs.

<div style={{
    position: fixed;
    top: 0;
    left: 0;
    right: 100%;
    bottom: 100%;
    background-image: linear-gradient(to left top, rgb(230, 92, 0), rgb(249, 212, 35));
    /* isolation stops any further parent element from blending with a mix-blend-mode descendant. */
    /* https://css-tricks.com/almanac/properties/i/isolation/ */
    isolation: isolate;
}}>
    <div style={{
        position: fixed;
        top: 0;
        left: 0;
        right: 100%;
        bottom: 100%;
        background-image: url(./background-pattern.svg);
        background-size: 35%;
        background-repeat: repeat;
        opacity: 1; // Intensity
        mix-blend-mode: soft-light; // soft-light, hard-light (for very light backgrounds), overlay (more contrasty). Maybe just overlay for all cases, and then adjust the intensity.
        filter: invert(100%); // For white pattern: 100%. For black pattern: 0% / none.
    }}>
    </div>
</div>

Maybe remove `npm link` after test passes.

Remove `babel.config`s if swc works (including hot reload of react and redux actions and styles).

Remove `test.js` "self-test" files.


Add `frontend-storage` install to readme + `frontend-utilities` + `frontend-timer`





Run tests using proper mocha rather than a browser mock




Test local storage `onQuotaExceeded()` error message.



On open — open the first "favorite channel", if any.

Add start/stop on UserData / UserSettings / Storage (StartStopStorage wrapper)

Add provider switch in the top right corner (outline + accent color).

На сайте anychan'а фоном тоже сделать шаблон + градиент.



Test external change of latest read comment id in same thread.





Use `-tail` API on `4chan` for thread auto-update and subscribed thread update.






Check React fast refresh (components, Redux actions/store).
If not works, change `swc-loader` to `babel-loader`.
https://github.com/swc-project/swc/issues/588

Maybe remove `.swcrc`
https://github.com/swc-project/swc/issues/4431

Maybe clean up `babel.config.js` in `webapp-frontend`



Любая вкладка (сразу после открытия):



            SubscribedThreadUpdate - mutually exclusive execution + debug


Check that replies' parent comment quote text gets updated when the parent comment's YouTube video gets loaded (rewrote `virtualScroller.current.renderItem()` -> props).

Что будет, если открыт subscribed thread, и пользователь его скроллит, а в другой вкладке запустился SubscribedThreadsUpdater, и у него ещё старый latestReadCommentId, на основе которого он вычислил counts, и записал их в storage, а потом эта вкладка увидела обновление и "подтянула" его, вместе с не верными counts.


Проверить сценарий: один и тот же тред открыт с авто-апдейтом в двух вкладках. В одной из этих вкладок прочитываются все новые комментарии, чтобы убралась индикация. Тогда на второй вкладке, по идее, тоже убирается индикация.



show channels list — Open the list of Channels + outline button




Проверить — Иконка "новое" пропадает, если переключиться на вкладку, даже если там ещё есть непрочитанные, и потом не загорается.

Обновлять иконку (`useApplicationIcon()`), если есть новые комментарии или ответы в subscribed threads.

Обновлять `subscribedThreadsState` — `newCommentsCount`, `newRepliesCount` — as the user scrolls.




Можно сделать скрипт, который, будучи добавленным на страницу, будет после `document` `load` показывать слой "loading" (spinner) `position: fixed; width: 100%; height: 100%`, затем читать данные треда или доски, добавлять новый слой `id="react"`, в котором рендерить новый UI, и затем всё старое делать `display: none`. Если ссылка была на комментарий, то будет мотать на комментарий.


setSubscribedThreadNewComments({
    newCommmentsCount: 123,
    newRepliesCount: 0
}) — { cache: true }

else — { cache: false }


Maybe remove properties from `subscribedThreads` collection items


Archived thread test:
http://localhost:1234/2ch/b/119034529


check kohlchan, 4chan, 2ch in the UI after sort by popularity



On hide OP comment: чтобы проставлял hiddenThread.




Link in footer links to website. Add links to github repo and to twitter there via icons.



anychan

В шапке: собака плавает вверх-вниз немного, потом резко вверх-вниз два раа — типа "гав гав" — дальше печатается справа >woof woof. Когда собака гавкает — на ней ещё очки подпрыгивают.

Universal online discussion platforms client

FAQ.

Q: Which imageboard engines are supported by `anychan`?
A: Currently it supports:

* `4chan.org`
* `2ch.hk`
* All `vichan` forks
* `lynxchan`, although there're some minor [issues](https://gitlab.com/catamphetamine/imageboard/-/blob/master/docs/engines/lynxchan-issues.md)

Q: What is the recommended imageboard engine for `anychan`?
A: There haven't been a lot of them. Originally there was [`vichan`](https://github.com/vichan-devel/vichan) and it still seems to work fine (at least for non-highload scenarios) but is no longer being developed. The only one currently alive seems to be [`lynxchan`](https://gitgud.io/LynxChan/LynxChan), although it has some minor [issues](https://gitlab.com/catamphetamine/imageboard/-/blob/master/docs/engines/lynxchan-issues.md) that the author doesn't seem to be willing to fix. Still, it is functional. You could write your own imageboard engine too, and then request adding it to the [`imageboard`](https://gitlab.com/catamphetamine/imageboard) library providing clear API docs with examples.







Можно добавить https://8chan.moe/





Test new comment animation slide up. Move webapp frontend repo to gitlab. Update imgboard, read ex file and ph numb inp on github

Можно сделать неймспейс @anychan и подпакет reddit (reddit plugin).




Поэкспериментировать с основным шрифтом:

    font-family: "Helvetica Neue","Arial",sans-serif;
    /* color: #425466; */
    color: #414141;
    font-size: 18px;
    /* line-height: 28px; */
    line-height: 1.55em;
    /* letter-spacing: .2px; */ */
    letter-spacing: .1px;


Можно добавить открытие меню поста по клику правой кнопкой мыши на посте (на том же месте, где double click).

Проверить, что touch-and-press увеличивает комментарий, и мб добавляет тень под ним.



// The latest known list of live (non-archived, non-expired) threads in a channel.
— what for?


Cached local storage — check that latest read comments are cached.

Cached local storage listen onChange key regexp.

Индекс будет использоваться только при clean Up User Data / repair User Data — те, ключи, треды которых не в индексе, будут просто стираться.

clean Up : будет проходить по всем ключам вида `captchan` (`captchan.chanId.*.boardId.threadId`).

on thread expired — тереть все ключи вида `captchan` (типа `captchan.chanId.*.boardId.threadId`).

Мигрировать (стирать) старые ключи вида `captchan.userData`. Этим можно воспользоваться, чтобы сбросить версию. А может и не сбрасывать.

Посмотреть, каким будет экспорт UserData в файл.

increment the version so that it only cleans up on 3 -> 4 update or something like that.

Add “threads” ids list (per board), that will be refreshed on each catalog response. Also add "archivedThreads" index with archivedAt dates (with periodical auto-clear). When threads are removed from “threads”, they become archived or expired, including when localStorage "threads" change event is received from another tab.

onThreadArchived / onThreadExpired — ничё не делать, если это был external event, потому что там уже всё сделано.


Add a test on merge (import) User Data.
Check that it doesn't alert the user that it will overwrite User Data on import because it merges.







Над формой ответа показывать подсказку, что ответить на комментарий можно двойным кликом или длинным нажатием.




"Активность" — touchdown mousedown pointerdown keydown scroll resize






Add own comment / own thread as "latest read comment"



    // What if thread not archived,
    // then refreshed and archived in UserData,
    // but Redux dispatch not yet run,
    // and user reads next comment
    // and that comment is written to UserData, not to UserData.archive.
    // Maybe add a check in UserData: check if thread is archived before write.
    // And what if thread has expired?
    // Thread already expired and cleared from UserData,
    // but is still rendered on screen,
    // and the user still hasn't read the latest comments,
    // and they scroll down and it writes new "latest read comment" to UserData
    // while it shouldn't have written anything to UserData.



Tracked threads new comments or replies indicator: use redux/thread latestReadCommentId and thread.id


Cached local storage: should cache only when tab is visible. On thread fetched: user data on thread first comment -> trim things like own comments, votes, subscribed thread replies. Add replies to subscribed threads. Check that latest seen threads aren’t cleared on archival or expiry. Add user data argument to compare subscribed threads. Remove sort subscribed threads from non-user-data.


При set in archive добавлять тред в archived threads. Migrate latestComment i -> number


Во время get from user data смотреть архив. А что, если есть и там, и там?


Cached storage listen keys. Get threads sortBy rating creationDate latestComment. Expired threads stay in archive for a week. Merge data on archive


Дописать тесты update tsubscribed thread


Add to comment: missing from threads stats if new or if just expired


Сделать быструю функцию sort threads by rating


Добавить кнопку очистить архив


Remove:

  if (!subscribedThread.replies) {
    return 0
  }









add merge option to cached local storage + write a test.

Sort subscribed threads on merge in a cached local storage.

Check that it updates subscribed threads list in the UI on user data import / clear / merge.


`sortSubscribedThreads()` — how to handle subscribed thread archived/non-archived status for reading latest read comment from archive or non-archive.

Update `sortSubscribedThreads()` code with the latest ordering scheme.

Test `sortSubscribedThreads()` and `getSubscribedThreadNewRepliesCount()`.

Set `.replies[]` on each subscribed thread + migrate + PropTypes.


Add a larger red dot when there're new replies in subscribed threads.

show expired icon in thread header.

console.log('------------------------------ on thread expired', threadId)

On read comment: update subscribed thread new comments status icon.


When not `withLatestReplies`, sort threads from newest to oldest.

Move board view switch to its own position and make it larger.

Move thread archive settings to `imageboard`.

При переключении переключателя вида доски — рефрешить список тредов.

Добавить в imageboard метод getPopularThreads(). Для двача будет использоваться метод getPopularThreads + merge from the default method. Для остальных провайдеров — default method:

* To sort threads by "popularity", calculate an approximate "posts per minute" stats for each thread: `((thread.repliesCount + 1) / (currentTimestamp - thread.createdAtTimestamp)) / 60`. This is an average "posts per minute" stats for a thread across its entire lifespan. It's not completely accurate because it assumes that replies are evenly spread throughout the thread's lifetime.

В режиме new comments не показывать "--- previously seen threads: ---" и показывать latest comment date перед thread creation date (через точку можно).

Unread comments count: after slash ("10 / 5").

Above the first shown "latest comment" it could write "N more new comments" (or just "N more comments", if all of them're new).

Mark "previously read" comments in "new comments" view of a board.

Maybe add "No new comments" indication subheading in "new comments" view of a board.

Можно убирать архивные треды из показываемых, если пользователь в курсе, что они были закрыты или архивированы. Мб через сутки после их закрытия / архивирования.

Increment version counter + add CHANGELOG + git tag






можно добавить кнопку отмены сброса пользовательских данных / настроек.





У каждого треда в архиве проставляется метка, когда он в этот архив был добавлен, и потом уже отдельный таймер раз в сутки занимается таким вот "garbage collection"-ом.

The clean-up procedure will move all non-present threads to the `archive`.

The `archive` will be cleaned also daily in similar a job (`UserData.archiveCleanUpStartedAt: ...`). Archived thread data lifetime could be a `MONTH`.

Remove `const archivedThread = userData.archive.getArchivedThread(channelId, threadId)` from `onThreadsList()` when periodical archive clean-up has been added.







Когда используется `-tail.json`, сохранять ответ сервера на предыдущий "полный" thread `*.json`, и потом просто добавлять к нему новые комментарии через какой-то `mergeXxx()`: таким образом ссылки на предыдущие комментарии будут распаршиваться нормально (не будет "comment not found").

Делать такой `merge` непосредственно в `imageboard`, потому что так будет нормально считаться после этого `.commentsCount` и `.attachmentsCount` в случае с 8ch.net в `parseThread()`.



`latest_replies` содержат ссылки на предыдущие комментарии, которые не загружены: в этом случае чтобы не писал "Удалённый комментарий", а просто ссылку на комментарий в треде делать, с instantBack.




В getThread добавить параметр addUpdateThread, который будет добавлять треду функцию .refresh()





subscribed threads - show threads with new comments even when archived, and hide archived; if all archived, then don't show "threads expired" label; как стилизовать треды, которые expired и при это has new comments; показывать замочек и коробку на архивных тредах






Если зайти на http://localhost:1234/2ch/error?url=%2Fv, и потом перейти на /v/, то VirtualScroller выдаёт ошибки, как если бы он восстанавливал какой-то state.



show a lock icon on closed threads in sidebar, and don't auto-refresh those (when tracked).



Slideshow "Drag & Scale mode" on Esc: don't play bounce animation (on non-touch-devices).



Add slideshow hotkeys to settings list.


Add hide thread / comment hotkey: Delete





In some future, maybe add support for LynxChan push notifications.




Own comments markers:

In own comments, overwrite author name with "You", and add color (Clickable-color), maybe colorize the person icon too.

In replies to own comments, expand block post quote links to own comments, and add the same CommentAuthor block there (and in inline post link quotes too).






Mark archived threads as archived

Dont hide expired and archived threads in sidebar.

Expired threads can have new comments.

Dont refresh expired, archived and closed threads.

Edit the sorting function accordingly.







Добавить в side menu кнопку "Add to Favorites" (если тред уже добавлен в избранное — потолще рамку иконки делать, и цветом clickable color мб).

Под ней — кнопку "две стрелки вниз" (перейти к самому позднему комментарию).

На десктопе слева — такие же кнопки. При этом стрелку назад можно будет переместить куда-нибудь в середину экрана, или в верхнюю часть. Тогда можно будет добавить и стрелку вверх вверху (и в мобильном меню тоже — там смотреть, чтобы все иконки меню были в пределах видимости, мб через javascript).




При наличии новых ответов — подсвечивать иконку немного другим цветом, чем когда просто есть новые комментарии. Например, вместо красного кружка делать красный кружок с синей обводкой (в итоге — того же размера).




Меню на десктопе можно сделать как на мобильном: сразу слева от текстовой части постов, плавающем поверх.




Mark archived (and closed) subscribed threads with "lock" icon.





Добавить горячую клавишу "F".

По нажатию F в каталоге — появляется рамка фокуса (цвета clickable color) вокруг карточек тредов, которую можно двигать стрелками вверх/вниз. По Enter-у — переход в тред. Добавить эту клавишу в настройках. Добавить изменение горячей клавиши. Добавить её в settings. Не срабатывать будет, если на input/textarea. Сделать Backspace тоже редактируемой клавишей. Во время переназначения — показывать animated <Ellipsis/>.

При Tab-е — переходить на фокусировку элементов выделенного комментария, так что саму эту рамку можно сделать как tabIndex={-1}.






Latest Seen Thread — надо ли вообще.
Может быть вместо этого помечать треды как массив из Seen Threads, а не просто один Latest Seen Thread.











На мобильных:

добавить в `react-pages` настройку `useSlideInTransition({ fromRoute, toRoute })`, которая может быть включена для каких-то `instant` navigation'ов (например, доска -> тред, и обратно). Во время такого transition'а будет выполняться функция Component.preload() (если она есть), потом уже обычный Component.load(), не блокирующий навигацию. При этом, в `.load()` будет передаваться функция `isCancelled()`, которую `.load()` сможет вызывать, чтобы прекращать выполнение. После загрузки страницы (выполнения Promise) контент её будет fade in. Если была ошибка при загрузке, то перенаправлять на `/error` безо всяких slide in / slide out (проверить, что работает). Предыдущая страница — показывается как обычно. Новая — создаётся в слое `position: fixed` с `overflow: scroll-y` (настраивается через CSS в самом приложении), который через `transform: translateX(100%)` надвигается. Всё это время — `<Loading/>` поверх всего. `<Loading/>` завершается, когда анимация надвигания закончилась, и у слоя новой страницы убирается `position: fixed` и `transform`, а предыдущая страница — перестаёт показываться. Анимацию slide-in можно использовать такую же, как для меню (или какую-нибудь ещё).

// Опционально: Во время такой загрузки страницы треда, можно показывать либо основной комментарий треда, либо, если уже что-то прочитано, то запись из `.latestReadCommentsList`, который будет иметь максимальную длину (скажем, 100), в зависимости от того, каков размер будет одной такой запсис. Под этим — троеточие какое-нибудь анимированное, пока не загрузится тред.




Попробовать скачать и развернуть релиз где-нибудь на gh-pages — работает ли этот релиз.








На мобильных:

 в сайдбаре под лого провайдера показывать текущую доску на странице доски.

 в сайдбаре под лого провайдера показывать текущую доску и текущий тред (fixed height overflow hidden) на странице треда.






На странице доски сделать кнопку "+" слева от кнопки поиска — это будет постинг треда. Пока может просто перенаправлять на страницу доски на "оригинальном" чане.

На странице доски сделать кнопку "refresh" где-нибудь справа от кнопки поиска.




Кнопку "добавить тред в избранное" — что на мобильных, что на десктопах, мб вынести как-то отдельно, в "особое место", где она была бы доступна при прокрутке и легко нажимаема. Мобильное меню можно сделать так: сверху иконка "добавить в избранное", дальше иконка "вверх", дальше иконка "меню", дальше иконка "вниз". А на десктопе может быть оставить "как есть" — вроде как нормально, если будет прокрутка "вверх".



Если есть новые комментарии в отслеживаемых тредах, то в мобильном сайдбаре (смотря на какой ширине экрана, мб только на самых малых) показывать их над списком "частых" досок. Если же нет новых комментариев в отслеживаемых тредах, то показывать их под списком "частых" досок.


Сделать немного тоньше палки иконок плавающего меню (не десктопного).




Сделать стрелку "Назад" в каталог тредов (можно `instantBack`) со страниц ошибок (типа 404).

Попробовать сделать стрелку "Назад" в каталог тредов со страницы доски (когда открыл сразу страницу треда) через `instantBack`, и будет ли работать такое: с треда на доску (туда/сюда — instantBack, нажатие на карточку треда — instantBack), далее нажимается карточка другого треда (туда/сюда — instantBack, нажатие на карточку треда — instantBack).



На айфоне "съедаются" иконки некоторые:
* Меню сайдбара — шестерёнка настроек и полумесяц ночного режима.
* Меню треда — иконка открытия слайдшоу справа и снизу.



На странице треда:

При безостановочной прокрутке вверх, скажем, на 25% экрана, кнопка "Назад" меняется на стрелку вверх (анимированно — добавлением класса с rotate(90)), и её onClick меняется на scrollToTop().
Это только если window.pageYOffset — более высоты одного экрана.
Меняется обратно на "Назад" по событию "scroll", когда window.pageYOffset — равно или менее высоты одного экрана.

На десктопе:

Область кнопки назад слева делится на две части: верхняя "Назад" и нижняя "Вниз". Пропорция — мб 2:1, или типа того.
По :hover — показывать границу между этими двумя кнопками (линия).
По событию scroll, если до низа прокрутки осталось менее, скажем, высоты одного экрана, то кнопка "Вниз" исчезает, и всё место занимает кнопка "Назад".
Также проверять это условие при onMount (помимо события scroll).

На мобильном:

Кнопка "Вниз" показывается под кнопкой "Назад".

Кнопка "Вниз":

Показывает три наиболее поздних комментария. Если текущих показанных комментариев уже столько же или меньше — не показывается эта кнопка. Также не показывается эта кнопка, если до низа осталось менее, скажем, высоты одного экрана.

Если нажал кнопку вверх, то проставлять в `state` позицию скролла, и если потом нажал кнопку вниз, то возвращать будет на ту же позицию. Сбрасывать позицию скролла в `state`, если после нажатия кнопки вверх, прокрутил ниже, скажем, высоты одного экрана (или, если доступная высота скролла меньше или равна, скажем, двум экранам — в таком случае не будет писаться позиция скролла в `state` изначально).


На странице канала: тоже показывать иконку "вверх" над иконкой "меню".




Если сделать "expand attachments", и какой-то attachment будет выше высоты экрана, и потом нажать на этот attachment, то он откроется в размере выше высоты экрана.







При расчёте количества новых комментариев — не считать их на основе `latestReadComment.i`, если тред `isRolling`.






На мобильных, может добавить кнопку "Add to favourites" на странице треда где-нибудь справа, над кнопкой меню.




Автообновление тредов на 4chan-е можно делать через `-tail.json`.




При открытии страницы, собирать список очереди обновления отслеживаемых тредов.
Далее, для каждого из таких отслеживаемых тредов показывать справа анимированное троеточие.
Троеточие перестаёт показываться после того, как обновление данного отслеживаемого треда завершилось (или была ошибка).
Максимальная частота запросов во время такого обновления — 1 в секунду.
Race conditions как-то хендлить.




Если ссылка на такой же домен, что и сам чан (или один из доменов), и ссылка эта — на channelId, threadId или commentId, то делать её как single-page application navigation.






On "Show Previous Comments" — preserve scroll position while "previous comments"' YouTube videos get loaded (which results in changing those "previous comments"' heights).

`virtual-scroller`:

  `preserveScrollPositionOnPrependItemsUntilUserScrolls`:

  on prepend:
    set `this.preserveScrollPositionOnPrependItemsUntilUserScrolls = true`
    set `this.previouslyFirstItemTopOffsetOnScreen = ...`

  in onScroll:
    if (this.preserveScrollPositionOnPrependItemsUntilUserScrolls)
      if (scroll originated from `.scrollWhileIgnoringScroll()`)
        then return
        else
          set `this.preserveScrollPositionOnPrependItemsUntilUserScrolls = undefined`
          set `this.previouslyFirstItemTopOffsetOnScreen = undefined`
          continue handling the scroll event

  on item height change:
    get top offset of the previously-first item on screen
      get the difference: (theNewOne - `this.previouslyFirstItemTopOffsetOnScreen`)
        if the difference is `!== 0`
          then `.scrollBy()` the difference
            set `this.previouslyFirstItemTopOffsetOnScreen = theNewOne`

  on resize:
    set `this.preserveScrollPositionOnPrependItemsUntilUserScrolls = undefined`
    set `this.previouslyFirstItemTopOffsetOnScreen = undefined`

  on set items:
    set `this.preserveScrollPositionOnPrependItemsUntilUserScrolls = undefined`
    set `this.previouslyFirstItemTopOffsetOnScreen = undefined`







Setting Comment Read Status:

is `latestScrolledAt` after `commentMountedAt`?
                           -> yes: mark the comment as read
                           -> no: add the comment to the `unreadComments` queue

on `scroll`:
             for each comment of `unreadComments`
               if the comment's bottom is visible (scroll event handlers run before Intersection Observer)
                 then mark it as read and remove it from the queue.
                 else,
                   if the comment's bottom was visible (for `previousScrollPosition`)
                     then, mark it as read and remove it from the queue.
                     else, remove it from the queue.
             set `prevousScrollPosition`.

on `scroll`, `mousedown`, `pointerdown`, `touchdown`, `keydown`:
             if there're any items in the `unreadComments` queue.
               for each comment of `unreadComments`
                 if the comment's bottom is visible (scroll event handlers run before Intersection Observer)
                   then mark it as read and remove it from the queue.
                   else, remove it from the queue.

on page visibility change: hidden -> visible
            start a read-on-page-visible timer (maybe schedule to run after a second)
               for each comment of `unreadComments`
                 if the comment's bottom is visible (scroll event handlers run before Intersection Observer)
                   then mark it as read and remove it from the queue.
                   else, remove it from the queue.

on page visibility change: visible -> hidden
            stop the read-on-page-visible timer

Then comment in the issue and close:
https://github.com/catamphetamine/captchan/issues/9





Проверить, что после автообновления, если страница просто открыта (мб даже свёрнута?), то сообщения сами не прочитываются, и что помечаются прочитанными только после user input'а.







Update unread comments count in redux/thread as comments are "read" via scrolling.






Add header/footer banner CSS vars, add footer banner with a link to news/discussions on demo pages via "custom" config.




On reply to a comment — first scroll up so that the <CommentsMoreActions/> button is visible (if it's not visible), then hide the reply form, then animate the replies counter like twitter does when there's a new like or comment. On expanding reply form below a comment, hide its replies tree.




Для тредов, отсортированных по дате наиболее позних комментариев, показывать дату updatedAt до даты создания треда (через точку). Да и вообще, для любого режима, кроме "по дате создания" так делать (например, для режима "горячие"). А может и только для того режима.






Можно сделать скрытие тредов и комментариев.






Randomize refresh time of subscribed threads between different tabs (+ locks: see announcement refresh for an example).





### Обновление отслеживаемых тредов


Background refresh чтобы не конфликтовал с cached local storage (visibility change): если thread watched, то записывать прочитанность сразу, чтобы не было ситуаций, когда уже прочтено много, но ещё не отмечено, а браузер обновляет в фоне, и говорит, что столько-то непрочитанных. Также, при записи на диск обновлять счётчик непрочитанных в отслеживаемых тредах (таким образом устраняя race condition).

Вместо количества новых комментариев мб показывать просто не особо выделенную точку, чтобы не было "obsessive compulsive".

What's the `_areThereAnyNewComments()` function.

Добавить в `<ApplicationIcon/>` количество новых непрочитанных комментариев из `state.subscribedThreads`.

Также показывать красную точку на кнопке мобильного меню, когда есть новые непрочитанные комментарии в `state.subscribedThreads`.








Сделать отключаемым список игнорируемых слов.

Сделать настраиваемым список игнорируемых слов в настройках (можно сделать галку: "расширяет список по умолчанию" или "заменяет список по умолчанию").





Список тредов доски: "Все"/"Новые". `lynxchan` не предоставляет `thread.createdAt`: вместо этого можно сортировать все треды доски по `thread.id`.


Сделать поиск по тредам доски (contentText = ... toLowerCase())

Отключать seen status setting во время поиска по доске

Стрелку "наверх" можно делать справа сверху (выше кнопки меню, мб прямо под ThreadPageHeader-ом).







Add new comments count ( in base or active color) on thread crads: 5 / 255

Add thread card menu item: Don’t track new comments

Add dontTrackNewComments user data item.







По long press-у на карточке треда в кталоге — предлагать open in new tab

Посидеть на чане в мобильном режиме, и посмотреть, удобно ли.

Сейчас переходит на тред по лонг прессу — не делать, если event был отменён мб (контекстное меню).

Можно убрать text selection на карточке треда в режиме доски.





Переключатель тредов "Все"/"Новые": писать его положение в UserData, и считывать оттуда при загрузке страницы.








Стрелку "назад" на мобильных показывать отдельно от кнопки меню (кнопку меню показывать всегда), и только если можно назад. Тогда стрелку "наверх" можно показывать под ними на расстоянии мб (а может и без расстояния в случае трёх кнопок) (а может и с).

Добавить кнопку "Go to top": на десктопах она будет слева под кнопкой "назад", а на мобильных — под кнопкой меню снизу (с той же стороны — слева для левшей).

Если сделал "Back" из треда, а потом нажал на него же — открывать его как "instant".




На иконке мобильного меню (кнопки сайдбара) показывать значок уведомлений ("красный"), если есть новые комментарии в отслеживаемых тредах (наверное, по количеству тредов, с разделением на два: обычный комментарии и другого цвета ответы; если что-то одно, то один значок).






Показывать иконку сайта с красным кружочком, если есть новые ответы в каком-то из отслеживаемых тредов.




Делать sortAndTrimSubscribedThreads() при обновлении отслеживаемых тредов (background update).











После первого ответа в тред, можно показывать форму ответа развёрнутой (по самым нижним комментарием) — режим чата, как вконтакте.

При новом комментарии (в том числе ответе) в отслеживаемом треде показывать уведомление как вконтакте (остающееся на экране, схлопывающееся в рамках одного треда в "гармошку" как уведомления на айФоне, без разъезжания по клику). При нажатии на такое уведомление открывать мини-окошко треда, как если бы это было окошко переписки вконтакте (с подобных "лейаутом"). В заголовке окошка ("/b/123 Название") — ссылка на тред в "нормальном" режиме. Таким образом можно будет удобнее отвечать на комментарии и "чатиться" в треде. Мини-окошки — перетаскиваемые мышью, и поверх всего.

Вышеописанное описано для случая, когда вкладка открыта (реализованное на каждой из вкладок и синхронизируемое между ними). Если страница была открыта после того, как поступили новые комментарии, то при нажатии на тред в избранном открывать тред в "нормальном" режиме, а не в окошке. Аргументация: мини-окошки удобны тогда, когда пользователь уже занят чем-то другим, и его не нужно отвлекать, чтобы не "терять контекст" переходом с одной страницы на другую. Когда же пользователь только что открыл вкладку, он ещё ничем не занят, поэтому ссылкам в "Избранном" логично вести на треды в "нормальном" режиме. Когда же пользователь уже находится на открытой вкладке, и пришло уведомление, то у пользователя есть выбор: либо нажать на такой тред в избранном (там он "поднимется" автоматически, и загорится счётчик), и перейти на этот тред в "нормальном" режиме, либо нажать на всплывшее уведомление, и открыть тред в режиме "мини-окошка" чата.

Настраиваемые хоткеи можно сделать на слайдшоу, развернуть картинки и добавить в избранное


Если прочитанность по скроллу, то делать задержку, чтобы соучайный скролл не помечал прочтённость (мб секунду).

Прочитанность - либо по событию скролла (даже если уже некуда крутить), либо по не переключению и не закрытию вкладки в течение какого-то времени после активности, и потом ещё активность, мб время зависит от длины текста.






Форма ответа — "Write a comment..." (Напишите комментарий...), слева — скрепка прикрепления файла, а может и справа.






Кнопку создания треда тоже как-то можно сделать (и форму).








Print Screen PNG -> JPG:

```js
// ==UserScript==
// @name         Convert pasted image to jpg
// @namespace    https://2ch.hk/
// @version      0.1
// @description  Converts pasted images from png to jpg
// @author       Anon
// @match        *://2ch.hk/*
// @match        *://2ch.pm/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

    const imageOpts = {
        filename: 'image.jpg',
        type: 'image/jpeg',
        quality: 0.95,
    };

    function imageToFile(image, { type, filename, quality }, callback) {
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext('2d').drawImage(image, 0, 0);
        canvas.toBlob(blob => callback(new File([blob], filename, { type })), type, quality);
    }

    $('.makaba').off('paste').on('paste', function(e) {
        var items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (const item of items) {
            if (item.kind !== 'file') {
                continue;
            }

            var blob = item.getAsFile();
            if (item.type !== 'image/png') {
                window.FormFiles.addMultiFiles([blob]);
                continue;
            }

            let img = new Image();
            img.onload = function() {
                imageToFile(img, imageOpts, file => window.FormFiles.addMultiFiles([file]));
            };
            img.src = (window.URL || window.webkitURL).createObjectURL(blob);
        }
    })
})();
```






Можно добавить кастомизацию фона доски (как в реддите или твиттере) — Аватар в кружке, фон. — через "Настройки доски" (Board settings) (шестерёнка), boardSettings boardId-data collection.









На странице доски можно добавить кнопку "Обсуждаемое" ("Active"), где показывать "топ" тредов (по "скорости" постинга в них). Такой API есть на `2ch.hk`.









Можно сжимать bitmap-print-screen-скриншоты в png при вставке их в форма ответа:
https://stackoverflow.com/a/37579385





### Ответ по long press / double click

+ add "pop" animation like in telegram: небольшая задержка (мб миллисекунд 150), затем небольшое затемнение и уменьшение, потом bounce обратно.

При нажатии на "Ответить" из меню — переходить в режим ответа и показывать сверху от формы ответа notification: "Отвечать на комментарии можно также двойным нажатием на краю комментария, или через long press (touch или мышь)". При нажатии на "Got it", проставлять cookie, чтобы более не показывалась такая подсказка.






### Thread Activity Status

on getThreads(), do `for (thread of threads) dispatch(updateThread(thread))`.
on getThread(), do `dispatch(updateThread(thread)`.
on refreshSubscribedThread(), do `dispatch(updateThread(thread)`.
in updateThread(): refresh `ThreadActivityStatus`.

Показывать кружок статуса активности треда слева от счётчика комментариев в: catalog, thread, subscribed threads.






Можно сохранять содержимое отслеживаемых тредов (мб также текущего открытого треда) куда-то каждый раз при обновлении (запросе на сервер): таким образом, можно будет видеть удалённые посты (помечать такие посты как удалённые).








When a comment is posted to a thread and the error code is 404, then call `dispatch(threadExpired())` and show an appropriate error message and show "Thread Expired" message like "Thread is closed".








На странице доски сделать две вкладки: "Все" и "Новые" (или: "Новые ответы" ("New comments") и "Новые треды" ("New threads")). На вкладке «Новые» показывать треды по дате создания, и после списка "ещё не увиденных" (определеямых по попаданию на экран целиком при скролле или при user input, как описано уже) тредов рисовать черту, писать «Просмотрено» и показывать список остальных тредов. На вкладке «Новые» показывать счётчик "ещё не увиденных" тредов ("+N" или просто "N").

На странице доски в Toolbar можно сделать кнопку обновления списка тредов (содержимое и значок вкладки "Новое", и т.д.).




Можно добавить "хоткей" на кнопку "назад со страницы треда на страницу канала".





Может зарелизить `OnLongPress`.





После того, как будет сделан ответ на комментарии, проверить VirtualScroller state: ввести текст, приаттачить картинку, затем "Назад"/"Вперёд".







Проверить возможность ответа на комментарий, показанный в модальном окне, появляющемся по клику на цитате.

После отправки комментария — всплывающее уведомление с текстом типа "Комментарий отправлен. Посмотреть", где текстовая кнопка "Посмотреть" показывала бы тред, начиная с добавленного комментария как единственного непрочитанного.






Можно добавить возможность скрывать ветку (типа "срача"). Потому что в таких случаях не скрывается по id автора, т.к. они только на спец досках.






Может быть сделать кнопку "посмотреть ответы" у тредов на странице доски, которая будет загружать и показывать несколько самых поздних комментариев прямо там же, "инлайново", без ухода со страницы.






### Открытие страницы треда на мобильных

На загружаемых страницах на мобильных можно сделать индикатор "три "мигающих" (увеличиваются-уменьшаются) квадратика".

Делать ли наезд новой страницы в стиле навигатора на мобильных.












How ReCaptcha works:
https://www.blackhat.com/docs/asia-16/materials/asia-16-Sivakorn-Im-Not-a-Human-Breaking-the-Google-reCAPTCHA-wp.pdf

Invisible ReCaptcha:
https://tehnoblog.org/google-no-captcha-invisible-recaptcha-first-experience-results-review/#google-invisible-recaptcha-v2.0

How does Google reCAPTCHA v2 work.
https://stackoverflow.com/questions/27286232/how-does-google-recaptcha-v2-work-behind-the-scenes





<script>
	let googleReCaptchaLoaded
	let googleReCaptchaElement
	function onGoogleReCaptchaLoad() {
		console.log('ReCaptcha loaded')
		googleReCaptchaLoaded = true
	}
</script>

<script src="https://www.google.com/recaptcha/api.js?onload=onGoogleReCaptchaLoad&render=explicit" async defer></script>

<script>
	// Shows post reply form.
	const onPostReply = () => {
		if (!googleReCaptchaLoaded) {
			return alert('Google ReCaptcha not loaded')
		}
		if (!googleReCaptchaElement) {
			googleReCaptchaElement = document.createElement('div')
			document.body.appendChild(googleReCaptchaElement)
		}
		// grecaptcha.hl = locale
		grecaptcha.render(googleReCaptchaElement, {
	    sitekey: 'your_site_key',
			size: 'invisible',
			// badge: 'inline', // CSS positioning.
	    callback: (gReCaptchaResponse) => {
	    	alert(gReCaptchaResponse)
			}
		})
	}

	const onSubmitReply = () => {
		grecaptcha.execute()
	}
</script>



ReCaptcha domain validation:
https://developers.google.com/recaptcha/docs/domain_validation

https://security.stackexchange.com/questions/149324/why-bother-validating-the-hostname-for-a-google-recaptcha-response




Captcha links:

Captcha in mobile apps

https://github.com/mishamoix/Channy/issues/5

2ch wiper

https://github.com/tsunamaru/mobile-wiper/blob/master/app/src/main/java/com/bund/wishmaster/Captcha.java

The Chan

https://github.com/acedened/TheChan.iOS/issues/472

2ch public captcha key:

6LeQYz4UAAAAAL8JCk35wHSv6cuEV5PyLhI6IxsM










Использование пасскода при работе с API:
https://github.com/8of/2ch-Browser-iOS/blob/50b75569a79950b0418fb18d5ee508ed3b6ef24e/API-DOC/README.md




Не показывать дату для тредов в режиме "Все".

Передизайнить карточки тем на мобильных: сделать иконку слева маленькой, и дальше мало текста, и количество комментариев только мб показывать, или и их, и аттачментов, и маленькими иконками где-нибудь, мб сверху тоже.

При переходе по цитатам сообщений — крутить в середину мб только при возврате на "изначальное" сообщение (то, с которого начинались переходы).

Если открыть видео (обычное) в полном экране, и оно дойдёт до конца, то фокус переместится на страницу, и пробел будет её листать, а стрелки не будут переключать слайды.

Scroll smoothly to replies if they're not on screen, highlight comment on "go to comment".

Create translation thread on kohlchan.

Сделать настройку "Дополнительные стили" (Additional styles).

На `post-link`-и, не развёрнутые в блоки цитат, вида "(комментарий)" — тоже вешать `onPostLinkClick`.

Если есть инлайновая ссылка на комментарий, то подставлять текст комментария инлайново, короткий (если из того же треда). Иначе: "[другой тред]" или "[комментарий из другого треда]".

Можно сделать переключатель "Все" / "Новые" на странице доски.

Можно сделать кнопку автообновления доски (как у треда, только вверху), и показывать точку, если есть вероятность новых комментариев (updateAt есть и не равен предыдущему, или commentsCount не равен предыдущему, но это не гарантия, т.к. могут быть удалены комментарии — добавить этот комментарий в код).

Можно сделать перемотку на "Show previous" комментарий так же, как сейчас сделано "Show all".

Мб использовать `position: fixed` вместо `position: sticky` для кнопки "Return".

Ссылки на треды и доски двача преобразовывать во внутренние (то же самое для форчана и т.п.).

Сделать настройки модальным окном на десктопах, и на мобильных — внутри сайдбара с кнопкой-крестиком.




Если ответить из окна "В ответ на" — закрывать это окно.




При заходе в тред (и при авто-обновлении треда) — кешировать его в кеше "N наиболее недавних загруженных тредов". Также кешировать отслеживаемые треды при каждой их загрузке и обновлении. Если такой тред истекает, то показывать страницу треда, как если бы он не истёк (миниатюры можно сохранять тоже, но оригиналы уже делать некликабельными, или показывающими крестик "картинка не может быть загружена"), и `position: fixed` красную плашку (с закрывашкой), говорящую о том, что тред истёк, и что он будет очищен из кеша через некоторое время, а пока его можно "Сохранить" (в виде .json файла с миниатюрами).




Maybe add user-configured word auto-replacement. Example: "girl" -> "catwife".



Можно сделать запись и отправку голосовых сообщений.



Может быть сделать что-то типа `position: fixed` кнопки внизу "Show most recent comments" ("Показать последние комментарии"), которая будет видна только при заходе в тред, в котором нет прочитанных или есть прочитанные, но количество непрочитанных больше сотни, например, и которая будет пересоздавать VirtualScroller так, как если бы все остальные, кроме самих недавних, были бы уже прочитанными (можно так их и помечать сразу, потому что они и так будут помечены как прочитанные при показе самих недавних комментариев). Также показывать, если впоследствии нажал "Показать все".




Сделать анимацию перехода на страницу треда со страницы доски для мобильных через `prevChildren`. Добавить потом коммент сюда: https://github.com/4Catalyzer/found/issues/596 (что сделал). При этом нормально обрабатывать scroll position. Например: на странице доски прокрутить вниз, нажать на тред, там тоже прокрутить, затем нажать кнопку "назад": далее содержимое страницы треда переезжает в `<div/>` с `position: fixed`, и ему ставится scroll, равный скроллу <body/> до навигации, а у <body/> восстанавливается скролл страницы доски. При сдвигании новой страницы, старая сдвигается где-то на четверть. Анимацию погуглить как ios navigation animation css. Не показывать на средних и больших экранах.





При нажатии на тред на странице доски: делать сразу наезд на страницу треда, где показывать первый пост, а под ним — писать что-нибудь типа "Загрузка...", и полоска снизу ездящая (как в адидасе). Таким образом, `.load()` будет работать по-разному: в зависимости от `window.previousRoute` (если `board` - тот же: брать из state.threads текущую по id, и если найдена, то делать так, а если не найдена, то загружать по классике).

На мобильных (малых экранах) не показывать `<Loading/>` для `isBoardLocation()` и `isThreadLocation()`. Вместо этого — карточки в стиле инстаграма (переливающиеся). При загрузке доски: показывать её название (как в header, так и в page__header), и, например, 100 карточек. При загрузке треда: показывать первый комментарий и карточки (по количеству комментариев, минимум одну), обновлять название в header'е. После загрузки треда: обновлять комментарий (мог измениться) — полностью, включая счётчики ответов и картинок.

Каким будет переход на мобильных, когда жмут на отслеживаемый тред? Каким будет переход на мобильных, когда жмут на тред, в котором уже есть прочтённые сообщения? В этих случаях не будет показан начальный комментарий. Видимо, будет показана просто страница с плейсхолдерами комментариев + show previous link (если есть какие-то прочитанные комментарии в треде).

При таких "не дисейблящих всю страницу" переходах: в `react-pages` отключать instantBack-функциональность, пока идёт загрузка страницы (от UPDATE_MATCH до RESOLVE_MATCH): в таких случаях ссылки и goto() будут как обычная навигация.











`thread.willExpireSoon` пока отключён: если на страницу треда (либо прямо, либо с доски), то для получения такой информации предполагается делать отдельный запрос `/catalog.json` (или "облегчённый" его вариант), что на `2ch.hk` занимает 100 KB (`/threads.json`), а на `4chan.org` — 0.5 KB (`/threads.json`), поэтому можно включить это дело на `4chan.org`. `lynxchan` — не предоставляет какого-то "облегчённого" `/thread.json`.

А можно просто сделать кликабельным время наиболее позднего комментария, поставить тултип "Click to refresh thread status", и показывать справа либо стрелку вправо-вверх "Thread is on place x of y: it's not expiring for now", либо стрелку вправо-вниз.

С другой стороны, кто будет жать эту кнопку...

`threadExpiresSoon.replace('{0}', 1).replace('{1}', 2)`









Если пользователь докрутил до конца комментариев — запускать обновление автоматически.
Обновление: кнопка "Refreshing in ... mins/secs" (`javascript-time-ago`), и внизу полоска, которая тикает справа налево.
Если нажать на кнопку: запускается "Refreshing..." (или когда дотикает).
Полоску при этом можно начинать анимировать как у кнопки в rrui.
Далее, в конце обновления — возвращается на исходные позиции, и снова тикает.

При доскролле до конца - запускать автообновление, но не с момента запроса новых комментариев, а с полоски обратного отсчёта ("Автообновление через ..."). Автообновление будет делать запрос новых комментариев только если `now - threadLoadedAt >= getInterval(comments)`. Таким образом получится, что для тредов, в которых самый поздний коммент был больше суток - не будет сразу слать запрос при доскролле до конца.

Если появились новые комментарии: показывает слева счётчик на фоне "base-color" с рамкой "content-color" (или shadow), и стрелка вниз под счётчиком. Всё это "кликабельное", и анимированно скроллит до первого нового комментария в центре экрана — смотреть высоту List'а до новых, и крутить так, чтобы этот уровень оказался, например, на 2/3 снизу по высоте (если там есть, куда крутить, а то может не быть пространства для кручения — тогда останавливать кручение на том уровне, до которого можно докрутить).
Если появились новые ответы: показывает notification-ы во всех вкладках, плюс обновляет счётчик в сайдбаре в отслеживаемых тредах, а также счётчик на кнопке меню, если это не текущий тред, который автообновляется. Поэтому рефрешер будет какой-то общий на все вкладки. Содержимое уведомления: текст комментария (`getPostSummary()`, без `post-quote`s), ограниченный по длине. Плюс слева можно вставлять первый аттачмент (если он есть — картинка или видео) — тогда если пустой `getPostText()`, то не выводить ещё и текст, чтобы не получилось: картинка и текст "Картинка".
По нажатию на notification — переходит в тред, и показывает начиная с новых комментариев.
Если в том же треде, и включено автообновление — крутит на новые комментарии.
По прочтению очередного комментария — обновлять как счётчик слева, так и счётчик в сайдбаре в отслеживаемых тредах, так и счётчик ответов на кнопке меню.

При автообновлении треда — сначала делать какой-то `window.Thread.requested()`, возвращающий объект `{ cancelled: true/undefined }`, с методом `cancel()`, который будет вызываться внутри .`requested()` для предыдущего `requested`-треда. Таким образом, если автообновление будет запущено, и затем, не дождавшись, пользователь перейдёт в другой тред, то сообщения этого другого треда не будут перезатёрты в Redux state.

Во время автообновления треда какие-то комментарии могли измениться, а какие-то — быть удалены. Поэтому сравнивать предыдущие и новые `comments[]` по `comment.id`, и если каких-то уже нет, то вставлять на место удалённых placeholder, который рендерить как "Удалённый комментарий" (как "Скрытый комментарий").

Прочитанность комментария: если он появился на экране нижней границей в результате scroll down, или если пробыл на экране нижней границей как минимум секунду со времени своего появления и времени какого-либо user input'а (mouse move, key down, touch down, mouse down).

Сейчас сообщение помечается как прочитанное при первом появлении его нижней границы на экране. Но в случаях, когда сообщения автоматически догружаются, пользователь может уже закрывать страницу, а новое сообщение появится, и пометится прочитанным, а пользователь его не прочёл. Поэтому сделано прочитанность нормально — так, как описано выше.

Прочитанность сообщений при открытом сайдбаре — не считать. Запускать все таймеры прочитанности заново после закрытия сайдбара (очищать их при открытии сайдбара).

Если будет введено автообновление, то появившиеся комментарии добавлять либо в прочитанные, либо в ShownCommentsAwaitingUserInputToBeRead (мб где-то в Redux state), которая будет проверяться глобальными хендлерами, установленными на window в Application on mount (и убираемыми по unmount).

Проверить, что счётчики новых комментариев в списке отслеживаемых тредов обновляются при прочтении комментариев в треде.

















`thread.updatedAt` seems to be present in all currently supported engines: show it in `/catalog` view on thread cards. Maybe to the right of the "comments count"/"attachments count" icons. Иконка — мб циферблат ("time icon"). Tooltip: в зависимости от того, какой chan — у `4chan` будет "the last time the thread was modified (post added/modified/deleted, thread closed/sticky settings modified)". У `lynxchan` — "last time this thread was bumped". У `makaba` — наверное, так же, как и у `4chan`.

`post-link`s: rename `postWasDeleted` -> `deleted`, `postIsHidden` -> `hidden`, `postIsExternal` -> remove and compare `boardId` and `threadId` instead. `deleted` — Maybe add to `webapp-frontend`, other -> only in `captchan` (perhaps).

В превью тредов не подставляет "Комментарий" на месте ссылок на посты ("Прошлый тред 31225129 (OP)").

Если текст `post-link` оканчивается на " OP", то можно делать не "(комментарий)", а "(тред)".

Вместо круглых скобок делать квадратные (`[]`).

`messages.thread.default = Тред`, `messages.thread.external = Другой тред`. Цвет — тоже серый, как для удалённых сообщений. Плюс серый цвет для всех external `post-link`s в виде цитат.

Block post links:

* `deleted` комментарии — делать без ссылки и серым цветом и в виде autogenerated post-link quote.
* `external` комментарии — делать просто ссылкой `service link` с иконкой обычной ссылки (без post link quote).
* `hidden` комментарий делать в виде post-link quote (тоже цветом каким-нибудь, мб серым).
* `default` — не бывает такого случая.

Inline post links:

* `deleted` комментарии — делать lowercase и в скобках, обычной ссылкой.
* `external` комментарии — делать lowercase и в скобках, ссылкой `service link` с иконкой обычной ссылки.
* `hidden` комментарий — делать lowercase и в скобках, обычной ссылкой.
* `default` комментарий — делать lowercase и в скобках, обычной ссылкой.

Кнопку мобильного меню можно сделать пожирнее в нажатом состоянии, поместить её посередине, и меню сделать выезжающим справа.

Colored person icons are too small — make it a large colored block like on `4chan.org`. Color the hash with white color. The background colors should be saturated and not too light (and not too dark).

Don’t show remove button on non-expired subscribed threads.

Вместо "Комментарий" можно писать "Комментарий из другого треда".

Можно выделять автосгенерированные цитаты другим цветом, чем "зелёные цитаты", написанные людьми. (мб жёлтый, мб оранжевый, мб синий).

Можно сделать настройку "не заменять ссылки на комментарии автосгенерированными цитатами", а то пользователи могут жаловаться, что им так непривычно.

Возможно раскрывать ссылки на комментарии по нажатию прямо на месте, но на том же уровне, без вложенности. Тогда картинку слева убирать под пост, видимо. У развёрнутого поста: сверху и снизу кнопки «свернуть»; по нажатию — сворачивают и сохраняют скролл (кнопка снизу); пост развёрнутый — аттачмент не выносить влево; кнопку показа ответов на развёрнутый пост можно не показывать; при клике на дату развёрнутого поста — сворачивать его и перематывать на этот пост.









Сохранять черновики текста комментариев и ответов в `localStorage`, и очищать их при истечении тредов. В этом случае, в `VirtualScroller.itemState` — хранить не просто `showReplyForm`, но и её `content`, вместе с attachments и прочими полями формы.




Add floating "Add new comment/thread", "Go to top" buttons:

На мобильных: "< Доска" ("назад") — слева снизу, "^ наверх" — справа снизу. Кнопки сами — круглые, мб не большие, без текста.

На десктопах (с размера, когда видно sidebar слева): "< Доска" ("назад") — полоска слева, на пустом месте, темнеет по наведению мыши, наверху иконка-стрелка; "^ наверх" — полоска справа, на пустом месте, темнеет по наведению мыши, наверху иконка-стрелка.

Кнопка "Ответить", "Написать комментарий", "Создать тред": круглая кнопка-плюс. Иконка — плюс. Раскрывает форму отправки сообщения (выезжает снизу в `position: fixed`, добавляя padding bottom странице; после отправки сообщения — уезжает вниз).







В Application.didMount запускать обновляльщик отслеживаемых тредов: через интервал в 15 минут будет в секунду обновлять по одному треду, показывая спиннер в сайдбаре (и пересортировывать после каждого обновлённого треда). Писать время refreshedAt, addedAt, latestCommentDate (для измерения возможного рейтинга stale thread), newCommentsCount, newRepliesCount.

Помечать наиболее поздние прочитанные сообщения и треды:
* в virtual scroller по скроллу ручному (не программному), когда они полностью попали в экран.
* по любому user input-у (keydown, mousemove threshold, scroll, click, etc), если есть какие-то "не прочитанные" комментарии или треды в списке, и они полностью попали в экран.

При "прочтении" непрочитанных сообщений в треде (как описано выше) — обновлять UserData, что перерендерит счётчики уведомлений и пересортирует список отслеживаемых тредов.

Сортировать треды отслеживаемые сначала по тем, в которых replies (по количеству), потом те, в которых комментарии (по количеству), потом остальные.

Можно сделать обновления в thread tracker через service workers (не зависят от открытости/закрытости сайта).





<!-- Можно сделать preview комментария/темы перед отправкой. Такое не прокатит, например, на `2ch.hk`, т.к. там сервер генерирует markup. -->

Сохраняется ли фокус на видео, когда autoPlay меняется с false на true в slideshowMode.

Maybe add hotkeys for "Expand attachments" and "Start slideshow".

Toggle search on Ctrl/Cmd + F.

When "Expand attachments": max height shouldn't exceed screen height.


Show the "bump limit" indicator in the "Watched threads" list for threads that have reached their "bump limit". Also show "Closed thread" indicator there.

Как-то помечать цветом (или полоской слева, или ещё как-то) own comments, own threads, replies to own comments.



В цитатах можно показывать link.content и service link icon вместо link.url, и для youtube video добавлять иконку youtube. Также можно к "Картинка" добавлять иконку картинки (или даже вставлять ту картинку, которая цитируется, в уменьшенном видео), а к "Видео" — иконку видео (или картинку preview в уменьшенном виде).




Ссылку на доску в шапке сделать как "goBack()".

При ответе в тред сделать галку "Не отслеживать комментарии в этом треде".


Redo screenshots in the repo README.




Может быть проставлять постам что-то типа commentQuoteText, чтобы не вычислять его каждый раз.

При нажатии на ссылки вида "Сообщение" (а также при нажатии на дате сообщения, или на цитате сообщения) — неанимированно скроллить на этот комментарий плюс top offset на высоту Header'а. При нажатии на ссылки вида "Сообщение" (а также при нажатии на дате сообщения, или на цитате сообщения) происходит добавление "якорей" в истории браузера — делать на этих ссылках `onClick` с `event.preventDefault()`, чтобы история не разбухала.

Мб делать какую-то кнопку "Вернуться" (со стрелкой в соответствующем направлении: вверх или вниз) после перехода к некоторому сообщению по ссылке на него (включая цитату).

Что, если цитируемое сообщение не загружено (например, если показываются сообщения с "самого позднего прочитанного") — в таких случаях сначала показывать предыдущие сообщения и делать им `parseContent()`, а уже потом крутить на них.

При заходе на сайт по ссылке на комментарий — прокручивать на этот комментарий.

Highlight the linked comment when navigating to comment URL (maybe add a border around it or something).

При переходе по ссылке comment URL или board URL: мотать список досок так, чтобы текущая доска там была где-нибудь ближе к верху на экране.

Implement comment "..." menu: Copy URL (only on Thread page), Report, Hide, etc.



If a thread is in bump limit, show a waterline after the last bumping message (including the last one maybe) with a sailing ship icon and some text ("This thread has reached bump limit and will eventually disappear").






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






Load instagram posts through CORS proxy (if a proxy is configured).



Движок Двача не даёт просто так взять и запостить mp3 или m4a файл.
В случае с mp3 или wav, он просто возвращает ошибку "-11: Тип файла не поддерживается."
В случае с m4a, он конвертирует аудио в видео формата mp4 с нулевой шириной и высотой.
В принципе, клиент мог бы на лету конвертировать из wav/mp3 в m4a, и потом показывать ролики mp4 нулевой ширины в виде аудиоплеера, но выглядит как какой-то хак.
Хз, почему не сделано просто прикрепление mp4/wav.
Возможно, чтобы РосКомНадзор не блокировал за пиратскую музыку.
В принципе, запись с микрофона в формат m4a реализовать, наверное, как-то можно на клиенте.





На `4chan.org`, если нажать на id постера, то будут подсвечиваться все его посты в треде. Это удобно. Можно сделать в настройках какой-нибудь функционал типа "Назначить прозвище и цвет автору с id = ...", при котором в `postAuthor` будет выводиться только это прозвище (без id, имени, емейла, роли, и т.п.), и в дополнение к этому background у этого прозвища может быть назначен каким-то цветом, выбираемым пользователем в виджете по кнопке "Назначить цвет". Эта фоновая заливка прозвища должна как-то отличаться от обычной фоновой заливки id автора, чтобы сразу "на подходе" уже было видно, не смотря прямо на сообщение.



Можно добавить IntersectionObserver в компонент Picture (lazy load): загружать картинки только тогда, когда они будут видны через высоту экрана, например (Page Down).



Можно сделать страницу с хоткеями, где сделать хоткеи на Slideshow Flow Mode и Expand Attachments и Toggle Favorite Thread.


Если в OP-посте есть раскрытый твит, то при нажатии на такой твит на карточке треда в каталоге — он не раскрывается, а переходит на сам тред. Можно было бы раскрывать такой тред по клику, но в <Clickable/> хз как отменять клик по самому Clickable (onTouchStart, onTouchEnd, etc).



--------------------------------------------------------------------------------------------



lynxchan get file SHA256 hash:

```js

  var reader = new FileReader();

  reader.onloadend = async function() {


    if (crypto.subtle) {

      var hashBuffer = await
      crypto.subtle.digest('SHA-256', reader.result);

      var hashArray = Array.from(new Uint8Array(hashBuffer));

      var hashHex = hashArray.map(function(b) {
        return b.toString(16).padStart(2, '0');
      }).join('');

    } else {

      var i8a = new Uint8Array(reader.result);
      var a = [];

      for (var i = 0; i < i8a.length; i += 4) {
        a.push(i8a[i] << 24 | i8a[i + 1] << 16 | i8a[i + 2] << 8 | i8a[i + 3]);
      }

      var wordArray = CryptoJS.lib.WordArray.create(a, i8a.length);
      var hashHex = CryptoJS.SHA256(wordArray).toString();
    }

    // ...
  }

  reader.readAsArrayBuffer(file);
```

```js
postCommon.newCheckExistance(file, function checked(sha256, mime, found) {

    var toPush = {
      name : postCommon.selectedFiles[index].name,
      spoiler : spoiled,
      sha256 : sha256,
      mime : mime
    };

    if (!found) {
      toPush.content = file;
    }

    files.push(toPush);

    postCommon.newGetFilesToUpload(callback, ++index, files);

  });
```



Можно создать issue в `arisuchan` и `lainchan`, `4chan` и `8ch`. Также можно создать треды на их чанах.
https://github.com/arisu-dev/arisuchan
https://github.com/lainchan/lainchan

Можно добавить `tumba.ch` (у них свой движок по типу `4chan`).

Можно добавить `wizchan.org` (`4chan` api).
https://wizchan.org/

Можно отображать время изменения комментария (`updatedAt` в `lynxchan` API response).

Alternatively, hypothetically, someone could change `howManyCommentsToShowBeforeLatestReadComment` from `0` to `2`, and then, when a user navigates to an already visited thread page, scroll down so that the earliest unread comment (or "no new comments" message) is positioned at about 25% of page height from the top. Such scroll position adjustment would also have to be "dynamic" in a way that if some embedded media (like a YouTube video) is loaded and "expanded" in one of the "already read" comments, and the user hasn't scrolled down yet, then the scroll position should automatically adjust itself in order to compensate for the changed "already read" comments height.

При истечении треда (если он не найден в каталоге, или выдаётся 404 по клику на него) — по нажатию на него в списке отслеживаемых тредов направлять на "архив". Например, на дваче это "https://2ch.hk/pr/arch/2020-07-29/res/1634080.html#1634080" (тред — https://2ch.hk/pr/res/1634080.html#1634080, `"date": "16/03/20 Пнд 00:37:16",`, `"timestamp": 1584308236`) (при этом не известно, как вычисляется дата архивирования треда: например, пользователь зашёл через неделю — и как программа узнает, какую дату нужно подставлять в URL архива), а на форчане тред просто помечается как `archived: 1`. Иногда тред не обязательно в архиве — может быть просто удалён модератором, например.

Если бы чаны предоставляли API для топа тредов по всему чану вообще, то можно было бы сделать такой раздел меню. Иконка — "огонь".

"Комментарии из другого треда": можно после показа страницы как-то подгружать эти "другие треды", и автогенерировать им цитаты, как-то отмечая, что это цитата из другого треда.

Можно добавить анимацию (как в Твиттере) иконке "Добавить тред в избранное".

<!-- (caching won't work when auto-scrolling right to "new unread comments") Cache board and thread data: при заходе на доску показывать старый каталог (при заходе в тред показывать старые сообщения), и крутилку показывать, что обновляется. (можно где-нибудь в Header'е показывать). -->

// Может быть всё-таки показывать "latest replies" у тредов в каталоге, потому что так "более живо" всё это смотрится: когда пользователь заходит без определённой цели, просто почитать, "что там нового", то любой комментарий равноценен (или часто бывает даже интереснее) "основного комментария" треда. Также, если пользователь по нескольку раз заходит в "каталог", то не будет ощущения, что "всё то же самое" и "ничего не меняется".

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

<!-- Ограничить ownComments и ownThreads длиной. subscribedThreads — тоже. -->

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

// При открытии картинки на мобильных: она может загружаться через "крутилку", и, соответственно, будет затемнение миниатюры (с показом "крутилки"), и если проигрывается анимация "scaleOpenCloseTransition", то затемнение пропадёт сразу на увеличиваемой миниатюре.

// Мб показывать "latest replies" у тредов на странице каталога. 4chan — предоставляет такое в catalog.json. На 2ch — теоретически можно как-то запрашивать отдельно https://2ch.hk/b/catalog.json, и одновременно https://2ch.hk/b/index.json, и заполнять "latest replies" на первой "странице" каталога с возможностью догрузки остальных "страниц" (https://2ch.hk/b/1.json, и т.д.). При этом будет рассинхронизация, потому что "страницы" постоянно обновляются, т.к. пишутся новые посты, и если, например, запрошена первая страница, то вторая страница уже будет не совсем "второй", т.к. треды уже пересортируются после появления в них новых комментариев. У Lynxchan — принцип мог бы быть тем же самым (https://kohlchan.net/b/1.json); это также могло бы решить вопрос "упрощённых" версий ОП-постов (конкретно, их attachment-ов), которые lynxchan выдаёт в catalog.json. Например, если пользователь зашёл на доску, и листает её, и продолжает листать (докрутил докуда-то), то догружать "страницы" по кругу (1, 2, ...) в некоторый кеш, из которого уже потом заполнять "latest replies" у тредов на странице каталога. Если какой-то тред не попал в кеш после прохода, то мб запрашивать его напрямую через `getThread()`. Пока грузятся "latest replies", можно не показывать заглушки на их месте, потому что в треде может и не быть ответов.

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

Стрелку "наверх" на мобильных некоторые показывают не всегда, а выезжающей справа при кручении наверх (через небольшой таймаут): https://www.kommersant.ru/doc/4628239












































4chan post
==========

https://github.com/4chan/4chan-JS/blob/8714d5fe9c138bdb0587c860a90a1289ffda65e3/extension.js

```
https://www.google.com/recaptcha/api2/reload?k=6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc
https://www.google.com/recaptcha/api2/userverify?k=6Ldp2bsSAAAAAAJ5uyx_lx34lJeEpTLVkP5k04qc

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

// byteLength = encodeURIComponent(comment).split(/%..|./).length - 1;
```














Имеется вот такая мобильная капча:
https://2ch.hk/api/captcha/recaptcha/mobile

При этом она выдаёт заголовок:
X-Frame-Options: SAMEORIGIN

Из-за этого, её не использовать в <iframe/>.
Чем вызвана такая строгость по отношению именно к <iframe/>?

Также, эта страница передаёт какой-то странный "callback": "callback: function(a) { window.external.notify(JSON.stringify(a)); }".
Вместо этого, можно было бы делать: "callback: function(a) { parent.postMessage("g-captcha-response", JSON.stringify(a)); }".

"window.external.notify" — это какой-то способ связи с C# приложениями. Зачем он здесь? Могли бы, как минимум, проверять, если ли вообще такая функция, и если она есть, то вызывать, а если её нет, то слать сообщение в parent фрейм.

Иначе, нет никакой связи из фрейма в основную страницу, и, соответственно, основная страница не получит g-captcha-response.