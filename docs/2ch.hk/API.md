# 2ch.hk API

## Все посты из треда с номера поста по доске

Страница треда:
https://2ch.hk/abu/res/39220.html

Мобильный API:
https://2ch.hk/makaba/mobile.fcgi?task=get_thread&board=abu&thread=39220&num=41955

Массив объектов типа `post`.

Первый `post` — тот, с которого запрошено; содержит `unique_posters` — возможно, количество уникальных пользователей, написавших комментарий в треде.

`lasthit` — timestamp комментария, который является (на текущее время) "последним", "бампающим" данный тред; например, 500-ый комментарий в треде (или последний текущий, если меньше "бамп лимита" в треде).

```js
const parsedPost = {
  id: parseInt(post.num),
  author: post.name === 'Аноним' ? ((post.email !== 'mailto:sage' && post.email) || null) : post.name,
  createdAt: new Date(post.timestamp * 1000),
  content: post.comment,
  banned: post.banned === 1,
  upvotes: post.likes,
  downvotes: post.dislikes,
  attachments: files.map(file => ({
    type: file.name ~ '.jpg' ? 'image/jpeg' : ...,
    sizes: [{
      width: file.width,
      height: file.height,
      url: `https://2ch.hk${file.path}`
    }, {
      width: file.tn_width,
      height: file.tn_height,
      url: `https://2ch.hk${file.thumbnail}`
    }]
  })),
  inReplyTo: post.parent && post.parent !== '0' ? parseInt(post.parent) : null,
  title: post.subject || null,
  originalPoster: post.op === 1 // unreliable, can be `post.op` === 0 for the opening post.
}
```

`const authorWasBanned = post.banned === 1`

`post.endless` — `1`, если "бесконечный" тред (видимо, тот, который не "опускается" и не удаляется).

`post.sticky` — если не `0`, то, видимо, порядковый номер "закреплённого" поста.

file:

```json
{
  "duration": "",
  "height": 509,
  "md5": "5142804ce50908942ca21e81dd677bab",
  "name": "14532556071840.jpg",
  "path": "/abu/src/39220/14532556071840.jpg",
  "size": 186,
  "thumbnail": "/abu/thumb/39220/14532556071840s.jpg",
  "tn_height": 169,
  "tn_width": 200,
  "type": 1,
  "width": 600
}
```

`type` — `1` для jpeg, `2` для png, `4` для gif, `6` для webm.

```
"displayname": "photo2018-10-27[...].jpg"
"fullname": "photo2018-10-2705-29-50.jpg"
```

Для видео:

```
"duration": "00:00:53"
"duration_secs": 53
```

## Все посты из треда с номера поста по треду

https://2ch.hk/makaba/mobile.fcgi?task=get_thread&board=abu&thread=39220&post=252

JSON треда:

https://2ch.hk/v/res/3475861.json

Cписок постов, начиная с 252-ого по счёту в треде.

```js
{
  "BoardInfo": "Раздел для тредов о видеоиграх, игровой культуре и новостей игрового мира. Официальные и постоянные треды о конкретных играх в <a href=\"/vg/\">/vg/</a> | Конференция доски в Телеграме - <a href=\"https://telegram.me/ru2chvg\">@ru2chvg</a>",
  "BoardInfoOuter": "Видеоигры, random", // hz
  "BoardName": "Video Games",
  default_name: 'Аноним',
  max_comment: 15000, // max comment length
  max_files_size: 40960, // max attachment size
  bump_limit: 500,
  enable_likes: 0,
  enable_posting: 1, // hz
  // enable_images, enable_video, ...
  is_closed: 0, // is the thread open or closed for comments
  posts_count: 456,
  max_num: 3489385, // id самого "последнего" (на текущий момент) поста в треде.
  title: '...',
  threads: [{
    posts: [instanceof `post`]
  }],
  unique_posters: 123
}
```

Изменения:

`post.num` — число, а не строка

`post.number` — порядковый номер поста

`parent`: `0` — у первого поста в треде

## Список тредов

https://2ch.hk/доска/номерстраницы.json (первая страница: index)

```js
{
  "pages": [0, 1, 2, 3, ...],
  "threads": [{
    "posts_count": 27,
    "thread_num": "3475861",
    "posts": [...]
  }]
}
```

## Все треды с сортировкой по последнему посту:

(выводит список тредов, упорядоченных по дате "последнего" (на текущий момент) поста в них (самые новые — сверху); "тред" — в данном случае первый пост треда)

https://2ch.hk/v/catalog.json

```js
{
  "threads": [{
    "banned": 0,
    "closed": 0,
    "comment": "Здесь все реквесты, поиск желаемых&#47;забытых игр, вот это всё.",
    "date": "30/05/17 Втр 22:35:38",
    "email": "",
    "endless": 1,
    "files": [...]

    "files_count": 164,
    "lasthit": 1541026424,
    "name": "Аноним",
    "num": "2080955",
    "op": 0,
    "parent": "0",
    "posts_count": 1538,
    "sticky": 2,
    "subject": "Единый поиска игор тред ",
    "timestamp": 1496172938,
  }]
}
```

Случайные баннеры:

```js
"board_banner_image": "/ololo/ukr_5.jpg",
"board_banner_link": "ukr",
```

## Все треды с сортировкой по времени создания треда

https://2ch.hk/доска/catalog_num.json

## Все треды с доски(облегченный вариант, с просмотрами и рейтингом для топа тредов)

https://2ch.hk/доска/threads.json

```js
{
  threads: [{
    "comment": "ИТТ описываем свои похождения, делимся впечатлениями, постим скриншоты и видео. Закатный: <a href=\"/v/res/3463920.html#3463920\" class=\"post-reply-link\" data-thread=\"3463920\" data-num=\"3463920\">>>3463920 (OP)</a>",
    "lasthit": 1541028071,
    "num": "3475861",
    "posts_count": 374,
    "score": 17.8347107438, // рейтинг треда
    "subject": "Во что играем?",
    "timestamp": 1540597950,
    "views": 2159 // количество просмотров
  },
  ...]
}
```

## Список досок

https://2ch.hk/makaba/mobile.fcgi?task=get_boards

```js
{
  "Взрослым": [{
    "bump_limit": 500,
    "category": "Взрослым",
    "default_name": "Аноним", // "уточка"
    "id": "fag",
    "name": "Фагготрия",
    "pages": 7,
    "icons": [{
      "name": "﻿Амкар",
      "num": 1,
      "url": "/icons/logos/amkar.png"
    }, ...]
  },
  ...],
  ...
}
```

Test cases `parseComment()`:

```
"<a href=\"/abu/res/39220.html#42006\" class=\"post-reply-link\" data-thread=\"39220\" data-num=\"42006\">>>42006</a><br>Text."

"где &#47;e? даже после поста на &#47;test &#47;e не появляется"

&#47; === /

"Аноны не работает топ тредов с такой ошибкой:<br>На шаге &quot;[D]Плашка&quot; произошла ошибка:<br><br>ReferenceError: p_text is not defined<br>@<a href=\"https:&#47;&#47;2ch.hk&#47;makaba&#47;templates&#47;js&#47;swag.js:5141:1\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">https:&#47;&#47;2ch.hk&#47;makaba&#47;templates&#47;js&#47;swag.js:5141:1</a><br>bmark@<a href=\"https:&#47;&#47;2ch.hk&#47;makaba&#47;templates&#47;js&#47;swag.js:1956:13\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">https:&#47;&#47;2ch.hk&#47;makaba&#47;templates&#47;js&#47;swag.js:1956:13</a><br>@<a href=\"https:&#47;&#47;2ch.hk&#47;makaba&#47;templates&#47;js&#47;swag.js:1913:45\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">https:&#47;&#47;2ch.hk&#47;makaba&#47;templates&#47;js&#47;swag.js:1913:45</a><br>g&#47;<br>Как это пофиксить?"

"<a href=\"/abu/res/39220.html#55954\" class=\"post-reply-link\" data-thread=\"39220\" data-num=\"55954\">>>55954</a><br><a href=\"/abu/res/39220.html#55953\" class=\"post-reply-link\" data-thread=\"39220\" data-num=\"55953\">>>55953</a><br>сдаюсь"

"<a href=\"/v/res/3475861.html#3476088\" class=\"post-reply-link\" data-thread=\"3475861\" data-num=\"3476088\">>>3476088</a><br>&quot;Первая майндбрейк игра ребенка&quot;.<br><br><span class=\"unkfunc\">&gt;Игра действительно хороша.</span><br>Текст.",

"<p style=\"color:red;\">Test</p><p style=\"color:green;\">Test</p><p style=\"color:blue;\">Test</p>",

"<span class=\"spoiler\">&gt;<span class=\"s\">тест</span></span>" // s === strikethrough

"<a href=\"/v/res/3492256.html#3512780\" class=\"post-reply-link\" data-thread=\"3492256\" data-num=\"3512780\">>>3512780</a><br>Двачую за шприц. Он нужен как минимум для стиля <a href=\"https:&#47;&#47;www.youtube.com&#47;watch?v=dIFbIUUo0OU\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">https:&#47;&#47;www.youtube.com&#47;watch?v=dIFbIUUo0OU</a><br>Алсо, забавная деталь с удушениями: <a href=\"https:&#47;&#47;www.youtube.com&#47;watch?v=MeqskaJ9Ek4\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">https:&#47;&#47;www.youtube.com&#47;watch?v=MeqskaJ9Ek4</a>"
```

## Поиск по темам доски (и ОП-постам)

https://2ch.hk/b/catalog_num.json

```js
{
  "threads": [{
    "subject": "...",
    "comment": "...",
    "author": "...",
    "files": [],
    "posts_count": 5 // количество "ответов"
  }, ...]
}
```

## Поиск по всем постам доски

https://2ch.hk/makaba/makaba.fcgi

FormData:

```
board: b
task: search
find: текст
```

Можно сделать галку "Автообновления" треда (раз в 10 секунд).
Или автообновлять текущую активную вкладку (тогда какой-то API текущей вкладки наверняка есть).
Новые посты — выделять как-то, мб цветом фона (как вконтакте).
Статус прочитанности менять по scrollTop >= post.bottomY (при двигании мышкой, при скролле, при таче).


Флаги:

```
"enable_flags": 1
post: { ... "icon": "<img hspace=\"3\" src=\"/flags/KR.png\" border=\"0\" />", ... }
```

"Трипкоды".

```
"trip": "!!%adm%!!" — админ двача (мб обезьяну).
"trip": "!!%mod%!!" — модератор двача (шериф в пакете, или полиция мб)
```

## Доски

https://2ch.hk/boards.json

```js
{
  "global_boards": 158,
  "global_posts": "363,061,097\u0000",
  "global_speed": "1,406\u0000",
  "is_index": 1
}
```

## Юзердоски

https://2ch.hk/userboards.json

```js
"boards": [{
  "id": "2d",
  "info": "Щитпостинг, обсуждение вайфу, аватарки и прочее. Анимешный /b/, постинг 3d не приветствуется.",
  "last_num": "793813",
  "name": "Аниме/Беседка",
  "speed": 15, // количество постов в час
  "threads": 401
  },
  ...
]
```

## Стикеры.

Список стикеров - https://2ch.hk/makaba/stickers/

Добавить свой стикер пак - https://2ch.hk/makaba/stickers/editor

После создания стикер пака и загрузки изображений, необходимо нажать "Активировать", чтобы стикер пак был доступен всем для поиска.

Стикер паки владелец может обновлять, добавлять и удалять из них стикеры, а также удалить вовсе.
Измененный пак обновляется автоматически раз в сутки или можете обновить вручную, если видите что в нем появились новые изображения, нажав в окошке со стикерами U

Стикер вызывается через кнопку S в окошке поста.

Один пост = один стикер. Можно добавлять .gif, которые автоматически проигрываются в превью. .png автоматически отображаются прозрачными.

Стикеры доступны как для анонов (можно использовать до 5 паков), так и для пасскодобояр (без лимита).

Создавать паки могут абсолютно все.

Для загрузки изображение PNG/GIF должно вписываться в квадрат 512x512 (одна сторона — от 200 до 512 пикселей, другая — 512 или меньше, но не менее 50)