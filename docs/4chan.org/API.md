# `4chan.org` API

## Definitions

### Post

Contains both the comment and the attachment file info.

```js
{
	// Post ID.
	"no": 184187118,

	// Post creation date (Unix timestamp).
	"time": 1549182611,

	// Post creation date (text).
	"now": "02/03/19(Sun)03:30:11",

	// (optional)
	"name": "Anonymous", // Poster name. They say it can theoretically be blank.

	// (optional)
	// A "tripcode".
	// (some weird cryptographic username having format "!tripcode!!securetripcode").
	"trip": "!Ep8pui8Vw2",

	// (optional)
	// "Capcodes" are set for "priviliged" posters (admins, moderators, etc).
	// See the "Roles" section.
	"capcode": "admin",

	// (optional)
	// Poster IP hash.
	// Is used to identify posters on some boards like `/pol/`.
	"id": "Bg9BS7Xl",

	// (optional)
	// ISO 3166-1 alpha-2 country code. Can be used on "international" boards.
	"country": "RU",

	// (optional)
	// Country name. Can be used on "international" boards.
	"country_name": "Russia",

	// Thread ID. Is always `0` for the "opening post" of the thread.
	"resto": 0,

	// (optional)
	// Comment HTML code.
	// Will be missing if the comment is empty.
	// (for example, in case of an attachment-only comment)
	"com": "Kitaro is framed, McNanashi stops by.<br><br>Discuss.",

	// (optional)
	// The year when 4chan "pass" was bought.
	// I guess this is some kind of an "achievement"
	// to differentiate "newfags" from "oldfags",
	// and the earlier the year the more "oldfag".
	"since4pass": 2016,

	// (optional)
	// Includes all properties of `Attachment` (if any).
}
```

### Attachment

Can be a picture (`.jpeg`, `.png`), an animated `.gif`, a `.webm` video (seems that the sound is always muted).

On the `/f/` board the OP files are always `.swf` ones, and there're no thumbnails for attachments: `tn_w === 0`, `tn_h === 0`.

They say it can also be `.pdf` (most likely with no thumbnail then: `tn_w === 0`, `tn_h === 0`).

Thumbnail extension is always `.jpg`. Thumbnail max size is `250px` for the main post of a thread and `125px` for all other posts.

If `m_img` is `1` then there's also a middle-sized image with max-width/max-height of `1024px`.

```js
{
	"filename": "Hot-girls", // Attachment file name.
	"ext": ".jpg", // Attachment file extension.
	"w": 1280, // Attachment width.
	"h": 720, // Attachment height.
	"tn_w": 250, // Attachment thumbnail width.
	"tn_h": 140, // Attachment thumbnail height.
	"tim": 1549182611230, // Attachment file name on server (UNIX timestamp + milliseconds).
	"fsize": 201912, // Attachment file size.
	"md5": "knN3NBdljasl085ylrpzfQ==", // Attachment file MD5 (24 character, packed base64 MD5 hash).

	// (optional)
	// Will be `1` if the attachment file was deleted.
	// Seems that if `filedeleted` is `1` then all other
	// attachment-related properties will be absent.
	"filedeleted": 1,

	// (optional)
	// If `1` then it means that the attachment should be
	// covered with a spoiler image.
	"spoiler": 1,

	// (optional)
	// `4chan.org` generates smaller copies of images (limited to 1024x1024)
	// for images having both width and height greater than 1024px.
	// These images are in the same location as usual but the filename ends with "m".
	// `m_img` parameter indicates that this smaller image is available.
	"m_img": 1
}
```

### Thread

Consists of the "opening post" (thread ID is the "opening post" ID) and some thread-specific properties.

```js
{
	// Includes all properties of `Post`.

	// (optional)
	// Comment subject.
	// Some boards (like `/b/`) have no subjects on threads at all.
	"sub": "Gegege no Kitaro",

	// Thread comments count.
	"replies": 24,

	// Thread comments attachments count.
	// This is the count of all attachments in the thread
	// except for the main post attachments.
	// https://github.com/vichan-devel/vichan/issues/327#issuecomment-475165783
	"images": 20,

	// `1` if the "bumplimit" is reached.
	// "Bump limit" (max comments count) is a board-wide setting.
	"bumplimit": 0,

	// `1` if the attached images limit is reached.
	Image limit (max attachments count) is a board-wide setting.
	"imagelimit": 0,

	"semantic_url": "gegege-no-kitaro", // Whatever that is.

	// (optional)
	// At `4chan.org` each board can have a list of "custom spoilers" for attachments.
	// `custom_spoiler` is a number, and if it's `5`, for example, then it means that
	// the board has five custom spoilers defined: from `1` to `5`.
	// One can then choose any one of the available custom spoiler ids.
	// Custom spoiler URLs are: https://s.4cdn.org/image/spoiler-{boardId}{customSpoilerId}.png
	// Every time a new post is added to a thread the chosen custom spoiler id is rotated.
	"custom_spoiler": 1,

	// (optional)
	// `1` if the thread "sticky" (pinned).
	"sticky": 1,

	// (optional)
	// `1` if the thread is locked.
	"closed": 1,

	// (optional)
	// `1` if the thread is "archived" (whatever that could mean).
	"archived": 1,

	// (optional)
	// The date when the thread was "archived" (Unix time).
	"archived_on": 1344571233,

	// (optional)
	// Can only be present on the `/f/` board.
	// I guess it describes the attached `.swf` file there.
	"tag": "Other",

	// (optional)
	// If a priviliged user (admin, moderator, etc) replies
	// in the thread then this object will contain the respective post IDs.
	"capcode_replies": {"admin":[1234,1267]},

	// (only for `catalog.json` API)
	// This is how many posts are there in the thread
	// minus `last_replies.length` minus `1` for the main post.
	"omitted_posts": 19,

	// (only for `catalog.json` API)
	// This is how many attachments are there in the thread
	// minus the attachments count in both `last_replies` and the main post.
	"omitted_images": 15,

	// (only for `catalog.json` API)
	// "Last modified" date (Unix time).
	// Includes replies, deletions, and sticky/closed status changes.
	"last_modified": 1549184316,

	// (optional)
	// (only for `catalog.json` API)
	// A random number of last replies in the thread.
	// Can be anything from zero to five on `4chan.org`.
	// For example, if there're 3 posts total in a thread
	// (the first being the main post and the two other being "comments")
	// then `last_replies` can contain just the last post (no logic).
	// May be absent.
	"last_replies": [
		// A list of `Post` objects
	]

	// (only for `/thread/THREAD-ID.json` API response)
	// Unique poster IPs count.
	"unique_ips": 44,

	// (only for `/thread/THREAD-ID.json` API response)
	// Ignore this property. See the "Auto-refresh" section for more info on "tail" API.
	"tail_size": 50,
}
```

### Board

```js
{
	"board": "3", // Board URL ID.
	"title": "3DCG", // Board name.
	"ws_board": 1, // Is the board "Work Safe".
	"per_page": 15, // Threads per page.
	"pages": 10, // Max thread pages.
	"max_filesize": 4194304, // Max comment attachment size.
	"max_webm_filesize": 3145728, // Max comment `.webm` attachment size.
	"max_webm_duration": 120, // Max comment `.webm` attachment duration.
	"max_comment_chars": 2000, // Max comment length.
	"bump_limit": 310, // The "bump limit" for threads on the board. (How much comments max will "bump" the thread, i.e. how much comments max will move to the top of the threads list)
	"image_limit": 150, // The maximum number of attachments allowed in the comments of the thread.
	"cooldowns": {
		"threads": 600, // Cooldown for creating a thread. A user won't be able to create a new thread until the cooldown passes.
		"replies": 60, // Cooldown for leaving a reply in a thread.
		"images": 60 // Perhaps a cooldown for attaching an image to a comment in a thread. I guess it can be ignored if it's the same as the `replies` cooldown.
	},
	"meta_description": "&quot;/3/ - 3DCG&quot; is 4chan's board for 3D modeling and imagery.", // Board description.
	"is_archived": 1, // Seems to always be `1`.

	// Optional:
	"spoilers": 1, // Whether the board uses "spoilers" for attachments.
	"custom_spoilers": 2, // The amount of "custom spoilers" for attachments on a board. If present, then is always greater than `0`. Every time a new thread is started it gets assigned a random spoiler ID and then all comments in such thread having attachments will have the spoiler with the assigned spoiler ID. So, in a given thread all attachments have the same spoiler image but on a given boards different threads have different spoiler images.
	"forced_anon": 1, // Is the "Author" field for every comment being overwritten with "Anonymous".
	"user_ids": 1, // If `1` then will show comment poster IDs like "(ID: /6oj2yjC)".
	"country_flags": 1, // If `1` then will show comment poster country flags. For example, on "international" boards.
	"min_image_width": 480,
	"min_image_height": 600,
	"webm_audio": 1,
	"sjis_tags": 1,
	"oekaki": 1
}
```

## Syntax

Message HTML syntax is:

* `<strong>...</strong>` — bold text.
* `<b>...</b>` — bold text (legacy).
* `<em>...</em>` — italic text.
* `<i>...</i>` — italic text (legacy).
* `<u>...</u>` — underlined text.
* `<s>...</s>` — spoiler text.
* `<span class="sjis">...</span>` — ["ShiftJIS art"](https://en.wikipedia.org/wiki/Shift_JIS) (for example, is enabled on `/jp/` board).
* `<pre class="prettyprint">...</pre>` — code (for example, is enabled on `/g/` board).
* `[math]...[/math]` — inline math (for example, is enabled on `/sci/` board).
* `[eq]...[/eq]` — block-level math (for example, is enabled on `/sci/` board).
* `<span class="quote">...</span>` — quoted text (starts with a `>`).
* `<span class="deadlink">...</span>` — deleted post link.
* `<a href="#p184569592" class="quotelink">...</a>` — post link (starts with a `>>`).
* `<a href="...">...</a>` — other links (the URL may be in any form: relative like `/a/thread/184064641#p184154285` or `/r/`, absolute like `https://boards.4chan.org/wsr/`, absolute-same-protocol like `//boards.4chan.org/wsr/`).
* "Advanced" users may occasionally use unconventional markup like `<p>`, `<div align="center"/>`, `<h1>`, `<span class="fortune" style="color:#789922;">...</span>`, `<span style="color: red; font-size: xx-large;">...</span>`, `<span style="font-size:20px;font-weight:600;line-height:120%">...</span>`, `<font size="4">...</font>`, `<font color="red">...</font>`, `<ul/>`, `<li/>`, `<blink/>`, `<table>`, `<tr>`, `<td>`, `<img src="//static.4chan.org/image/temp/dinosaur.gif"/>`, so all unknown/invalid tags should be ignored by just displaying their content (which can itself contain unknown/invalid tags).

## API

### Get boards list

[https://a.4cdn.org/boards.json](https://a.4cdn.org/boards.json)

```js
{
	"boards": Board[]
}
```

### Get threads list

[https://a.4cdn.org/a/catalog.json](https://a.4cdn.org/a/catalog.json)

```js
[
	{
		"page": 1,
		"threads": Thread[]
	},
	{
		page: 2,
		threads: Thread[]
	},
	...
]
```


<!--
### Get thread IDs list (and their latest message dates)

[`https://a.4cdn.org/g/threads.json`](https://a.4cdn.org/g/threads.json). The response is:

```js
[
	{
		"page": 1,
		"threads": [
			{
				"no": 51971506,
				"last_modified": 1536364716
			},
			{
				"no": 69694831,
				"last_modified": 1549505043
			},
			// ...
		]
	},
	...
]
```
-->

### Get thread

https://a.4cdn.org/a/thread/THREAD-ID.json

```js
{
	"posts": Post[]
}
```

The first `Post` has various thread info being a [Thread](#thread) object. The other posts are regular [Post](#post) objects.

### Get "Popular threads" list

Seems to be [no such API endpoint](https://github.com/4chan/4chan-API/issues/64).

"Chanu" mobile apps seem to just [parse the HTML](https://github.com/grzegorznittner/chanu/blob/8a65b87847ff1aea0366cf3c1e03d70edb94e36c/app/src/main/java/com/chanapps/four/service/FetchPopularThreadsService.java#L277-L286) of the "Popular threads" section of `4chan.org` main page to get the list of "Popular threads".

There's also a website called [`4stats.io`](4stats.io). I contacted `4stats.io` admins and they replied with a detailed explanation. Their approach is as follows:

* [Get the list of threads of a board](#get-threads-list).

* Find the max post ID and max thread ID.

* Store `maxPostID` and `maxThreadID` somewhere in state (calculating board stats is "stateful" while calculating thread stats can be "stateless").

* Wait for `N` minutes.

* Get the list of threads of a board again.

* Post IDs are local to a board so the amount of posts added since the previous time is the difference of max post IDs: `getMaxPostID(response) - state.maxPostID`. Divide it by `N` and it will be the "posts per minute" stats for the board.

* Count threads having IDs greater than `state.maxThreadId`. Divide it by `N` and it will be the "threads per minute" stats for the board.

* (stateless) Calculate an approximate "posts per minute" for each thread: `(thread.replies / (current_unix_time - thread.time)) / 60`. This is an average "posts per minute" stats for a thread across its entire lifespan.

The above steps are performed for each board with a delay `>= 1 sec` between moving from one board to another due to the 4chan API request rate limit of "max one request per second".

The reason why "posts per minute" stats for threads is calculated in a "stateless" approximate manner is because it can be a good-enough approximation of what kind of threads people generally participate in. Alternatively, precise "posts per minute" stats for threads could be calculated by storing `thread.replies` in state for each thread and then, say, after `M` hours the precise "posts per minute" stats for a thread would be calculated as `(thread.replies - getStateForMinutesAgo(M * 60).findThreadById(thread.id).replies) / (M * 60)`. Such "precise" approach would require storing more data in the database and is therefore more complex. It's likely that the "stateless" approximation already gives good-enough results so no extra precision is required.

### URLs

Images: `//i.4cdn.org/${board}${tim}${ext}`

Thumbnails: `//i.4cdn.org/${board}/${tim}s.jpg`

Spoiler image: `//s.4cdn.org/image/spoiler.png`

Custom spoilers: `//s.4cdn.org/image/spoiler-${board}${custom_spoiler}.png`

Country flags: `//s.4cdn.org/image/country/${country}.gif`

`/pol/` country flags: `//s.4cdn.org/image/country/troll/${country}.gif`

### Roles

If a comment has a `capcode` then it implies that the poster is a priviliged one. Possible `capcode`s:

* `"admin"` for admins
* `"mod"` for moderators
* `"manager"` for managers
* `"developer"` for developers
* `"founder"` for founders

"Janitors" don't get a `capcode`. See [4chan FAQ on "capcodes"](https://www.4chan.org/faq#capcode).

### `<wbr>`

I figured that 4chan places `<wbr>` ("word break") tags when something not having spaces is longer than 35 characters. [`<wbr>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr) is a legacy HTML tag for explicitly defined "word breaks". `4chan.org` inserts `<wbr>` in long URLs every 35 characters presumably to prevent post text overflow. I don't see any point in that because CSS can handle such things using a combination of `overflow-wrap: break-word` and `word-break: break-word` so I simply discard all `<wbr>`s in my code (otherwise they'd mess with hyperlink autodetection). I could replace all `<wbr>`s with `"\u200b"` (a "zero-width" space for indicating possible line break points) but then hyperlink autodetection code would have to filter them out,
and as I already said above line-breaking long text is handled by CSS. Also `4chan.org` sometimes has `<wbr>` in weird places. [For example](https://github.com/4chan/4chan-API/issues/66), given the equation `[math]f(x)=\\frac{x^3-x}{(x^2+1)^2}[<wbr>/math]` `4chan.org` has inserted `<wbr>` after 35 characters of the whole equation markup while in reality it either should not have inserted a `<wbr>` or should have inserted it somewhere other place than the `[/math]` closing tag.

### Math

`4chan.org`'s `/sci/` board allows posting formulae using TeX (or LaTeX) syntax. Inline formulae are delimited with `[math]...[/math]` tags, block level ones — with `[eqn]...[/eqn]` tags. Example:

```js
{
	com: "See the equation for [math]f(x)[/math]:<br><br>[eqn]f(x)=\\frac{x^3-x}{(x^2+1)^2}[/eqn]"
}
```

`4chan.org` uses [MathJAX](https://en.wikipedia.org/wiki/MathJax) library for displaying the equations. MathJAX uses its own "mathematical" font for displaying math.

### Auto-refresh

"Tail" API was introduced for reducing bandwidth when auto-refreshing comments in a thread.

To get a list of all comments in a thread one would send a request to the "get thread" API. For example, `http://a.4cdn.org/a/thread/185776347.json`.

Then, when a user navigates to the thread page and scrolls down to the bottom of the page, the program should start "auto-refreshing" the thread in order to get new messages. This is done using the "tail" API which has `-tail` appended to the "get thread" API URL. In this case, that would be `http://a.4cdn.org/a/thread/185776347-tail.json`.

The response of the "tail" API is the same as the one of the regular "get thread" API with the exception that the first `post` doesn't contain various thread info and instead looks like this:

```js
{
	"no": 185776347, // Thread id.
	"bumplimit": 0, // Is "bump limit" reached?
	"imagelimit": 0, // Is "image limit" reached?
	"replies": 195, // Total comments count.
	"images": 82, // Total attachments count.
	"unique_ips": 44, // Unique poster IPs count.
	"tail_size": 50, // The length of the `posts` array (minus one for the opening post) in this API response.
	"tail_id": 185788827, // The `id` of the comment which comes before the first comment of the "tail". In other words, the `id` of the last comment not included in the "tail" API response.
}
```

So, in this example, the "tail" API returns an array of 51 `post`s with `tail_size` equal to `50`. The application should search for a message having `id` equal to `tail_id` of the "tail" API response. If such comment is found then the application should append the new (not already displayed) comments from the "tail" on the page. If the comment having `id` equal to `tail_id` is not found then it means that since the last "auto-refresh" there have been too much new comments and the regular "get thread" API should be used instead on this auto-refresh iteration.