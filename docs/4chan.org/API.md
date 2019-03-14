## Definitions

### Post

Contains both the comment and the attachment file info.

```js
{
	// Comment data.
	"no": 184187118, // ID.
	"time": 1549182611, // Creation date (Unix timestamp).
	"now": "02/03/19(Sun)03:30:11", // Creation date (text).

	// (optional)
	"name": "Anonymous", // Poster name. They say it can theoretically be blank.

	// (optional)
	"trip": "!Ep8pui8Vw2", // A "tripcode" (some weird cryptographic username having format "!tripcode!!securetripcode").

	// (optional)
	"capcode": "admin", // "Capcodes" are set for "priviliged" posters (admins, moderators, etc). See the "Roles" section.

	// (optional)
	"country": "RU", // ISO 3166-1 alpha-2 country code. Can be used on "international" boards.
	"country_name": "Russia", // Country name. Can be used on "international" boards.

	"resto": 0, // Thread ID. Is always `0` for the "opening post" of the thread.

	// (optional)
	"sub": "Gegege no Kitaro", // Subject.

	// (optional)
	// Message HTML code.
	// Will be missing if there's no text.
	"com": "Kitaro is framed, McNanashi stops by.<br><br>Discuss.",

	// (optional)
	"since4pass": 2016, // The year when 4chan "pass" was bought. I guess this is some kind of an "achievement" to differentiate "newfags" from "oldfags", and the earlier the year the more "oldfag".

	// (optional)
	// Includes all properties of `Attachment` (if any).
}
```

### Attachment

Can be a picture (`.jpeg`, `.png`), an animated `.gif`, a `.webm` video (seems that always muted).

On the `/f/` board the OP files are always `.swf` ones, and there're no thumbnails for attachments: `tn_w === 0`, `tn_h === 0`.

They say it can also be `.pdf` (most likely with no thumbnail then: `tn_w === 0`, `tn_h === 0`).

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
	"filedeleted": ?, // I guess it's `1` if the attachment file was deleted, and is missing otherwise.

	// (optional)
	"spoiler": ?, // Didn't see such a property in API response.
}
```

### Thread

Consists of the "opening post" (thread ID is the "opening post" ID) and some thread-specific properties.

```js
{
	// Includes all properties of `Post`.

	"replies": 24, // Thread comments count.
	"images": 20, // Thread attachments count.

	"bumplimit": 0, // `1` if the "bumplimit" is reached. "Bump limit" is a board-wide setting.
	"imagelimit": 0, // `1` if the attached images limit is reached . Image limit is a board-wide setting.

	"omitted_posts": 19, // I guess this is how many posts are there in the thread minus `last_replies.length` minus `1` for the "opening post".
	"omitted_images": 15, // I guess this is how many images are there attached to posts in the thread minus the respective image count for `last_replies` and the "opening post".

	"semantic_url": "gegege-no-kitaro", // Whatever that is.

	"last_modified": 1549184316 // "Last modified" date (Unix time). Includes replies, deletions, and sticky/closed changes.

	// (optional)
	"custom_spoiler": 1, // "Custom spoiler" ID for attachments. If present, then is always greater than `0`, and in a given thread all attachments have the same "spoiler" image with that ID.

	// (optional)
	// Only present in the opening post when getting a list of comments for a thread.
	"sticky": 0, // `1` if the thread "sticky" (pinned, I guess).
	"closed": 0, // `1` if the thread closed.
	"archived": 0, // `1` if the thread was "archived" (whatever that could mean).
	"archived_on": 1344571233, // The date when the thread was "archived" (Unix time).

	// (optional)
	"tag": "Other", // Can only be present on the `/f/` board. I guess it describes the attached `.swf` file there.

	// (optional)
	"capcode_replies": {"admin":[1234,1267]}, // If a priviliged user (admin, moderator, etc) replies in the thread then this object will contain the respective post IDs.

	// (optional)
	// A random number of last replies in the thread.
	// For `/b/` seems to be `3`.
	// For `/a/` seems to be `5`.
	// Can have fewer `last_replies` if the thread doesn't have enough comments.
	// Will be absent if there're no replies in the thread.
	"last_replies": [
		// A list of `Post` objects
	]
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

## API

### Get boards list

[https://a.4cdn.org/boards.json](https://a.4cdn.org/boards.json)

```js
{
	"boards": [
		// A list of `Board` objects.
	]
}
```

### Get threads list

[https://a.4cdn.org/a/catalog.json](https://a.4cdn.org/a/catalog.json)

```js
[
	{
		"page": 1,
		"threads": [
			// A list of `Thread` objects.
		]
	},
	{
		page: 2,
		threads: [
			...
		]
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

### Get comments list

https://a.4cdn.org/a/thread/<thread-id>.json

```js
{
	"posts": [
		{
			// A list of `Post` objects.
		},
		...
	]
}
```

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
	"custom_spoiler": 1, // Whether the board has "custom spoilers" defined.
	"tail_size": 50, // The length of the `posts` array (minus one for the opening post) in this API response.
	"tail_id": 185788827 // The `id` of the comment which comes before the first comment of the "tail". In other words, the `id` of the last comment not included in the "tail" API response.
}
```

So, in this example, the "tail" API returns an array of 51 `post`s with `tail_size` equal to `50`. The application should search for a message having `id` equal to `tail_id` of the "tail" API response. If such comment is found then the application should append the new (not already displayed) comments from the "tail" on the page. If the comment having `id` equal to `tail_id` is not found though then it means that since the last "auto-refresh" there has been too much new comments and the regular "get thread" API should be used instead on this auto-refresh iteration.