### Get boards list

[https://a.4cdn.org/boards.json](https://a.4cdn.org/boards.json)

```js
{
	"boards": [
		{
			"board": "3", // Board URL ID.
			"title": "3DCG", // Board name.
			"ws_board": 1,
			"per_page": 15,
			"pages": 10,
			"max_filesize": 4194304,
			"max_webm_filesize": 3145728,
			"max_comment_chars": 2000,
			"max_webm_duration": 120,
			"bump_limit": 310,
			"image_limit": 150,
			"cooldowns": {
				"threads": 600,
				"replies": 60,
				"images": 60
			},
			"meta_description": "&quot;/3/ - 3DCG&quot; is 4chan's board for 3D modeling and imagery.", // Board description.
			"is_archived": 1
		},
		...
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
			{
				"no": 184187118, // Thread ID.
				"time": 1549182611, // Thread creation date (Unix timestamp).
				"now": "02/03/19(Sun)03:30:11", // Thread creation date (text).
				"name": "Anonymous", // Thread poster name.
				"sub": "Gegege no Kitaro", // Thread subject.
				"com": "Kitaro is framed as a yokai killer, Ratman is a cunt and McNanashi stops by.", // Thread message HTML.

				"filename": "[HorribleSubs] Gegege no Kitarou (2018) - 42 [720p].mkv_snapshot_03.42_[2019.02.03_10.26.49]", // Attachment file name.
				"ext": ".jpg", // Attachment file extension.
				"w": 1280, // Attachment width.
				"h": 720, // Attachment height.
				"tn_w": 250, // Attachment thumbnail width.
				"tn_h": 140, // Attachment thumbnail height.
				"tim": 1549182611230, // Attachment file name on server.
				"md5": "knN3NBdljasl085ylrpzfQ==", // Attachment file MD5.
				"fsize": 201912, // Attachment file size.

				"replies": 24, // Thread comments count.
				"images": 20, // Thread attachments count.

				"resto": 0, // Thread ID. `0` for the first post of the thread.
				"bumplimit": 0,
				"imagelimit": 0,
				"semantic_url": "gegege-no-kitaro",
				"custom_spoiler": 1,
				"omitted_posts": 19,
				"omitted_images": 15,

				"last_replies": [
					{
						"no": 184187731,
						"now": "02/03/19(Sun)03:56:33",
						"name": "Anonymous",
						"com": "<a href=\"#p184187118\" class=\"quotelink\">&gt;&gt;184187118</a><br>(((Ratman)))",
						"time": 1549184193,
						"resto": 184187118
					},
					{
						"no": 184187732,
						"now": "02/03/19(Sun)03:56:32",
						"name": "Anonymous",
						"com": "daddy eyeball please. you know ratman will fuck you over.",
						"filename": "[HorribleSubs] Gegege no Kitarou (2018) - 42 [1080p].mkv_snapshot_11.33_[2019.02.03_08.52.25]",
						"ext": ".jpg",
						"w": 1920,
						"h": 1080,
						"tn_w": 125,
						"tn_h": 70,
						"tim": 1549184192673,
						"time": 1549184192,
						"md5": "//aizIDjlpOsDM9wHBSwUg==",
						"fsize": 122021,
						"resto": 184187118
					},
					{
						"no": 184187766,
						"now": "02/03/19(Sun)03:57:29",
						"name": "Anonymous",
						"com": "When are they going to remove the rat?",
						"time": 1549184249,
						"resto": 184187118
					},
					{
						"no": 184187770,
						"now": "02/03/19(Sun)03:57:35",
						"name": "Anonymous",
						"filename": "[HorribleSubs] Gegege no Kitarou (2018) - 42 [1080p].mkv_snapshot_12.02_[2019.02.03_08.53.09]",
						"ext": ".jpg",
						"w": 1920,
						"h": 1080,
						"tn_w": 125,
						"tn_h": 70,
						"tim": 1549184255339,
						"time": 1549184255,
						"md5": "TWgyOVcAQXBYV6twm15nLA==",
						"fsize": 134542,
						"resto": 184187118
					},
					{
						"no": 184187790,
						"now": "02/03/19(Sun)03:58:36",
						"name": "Anonymous",
						"com": "<a href=\"#p184187770\" class=\"quotelink\">&gt;&gt;184187770</a>",
						"filename": "[HorribleSubs] Gegege no Kitarou (2018) - 42 [1080p].mkv_snapshot_12.03_[2019.02.03_08.53.00]",
						"ext": ".jpg",
						"w": 1920,
						"h": 1080,
						"tn_w": 125,
						"tn_h": 70,
						"tim": 1549184316000,
						"time": 1549184316,
						"md5": "8+TG3DX9Cnxi6SXjtTpSVA==",
						"fsize": 150738,
						"resto": 184187118
					}
				],
				"last_modified": 1549184316 // Last reply date (Unix time).
			},
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
			"no": 184187118, // Comment ID.
			"time": 1549182611, // Comment creation date (Unix timestamp).
			"now": "02/03/19(Sun)03:30:11", // Comment creation date (text).
			"name": "Anonymous", // Comment poster name.
			"sub": "Gegege no Kitaro", // Comment subject.
			"com": "Kitaro is framed as a yokai killer, Ratman is a cunt and McNanashi stops by.", // Comment message HTML.

			"filename": "[HorribleSubs] Gegege no Kitarou (2018) - 42 [720p].mkv_snapshot_03.42_[2019.02.03_10.26.49]", // Attachment file name.
			"ext": ".jpg", // Attachment file extension.
			"w": 1280, // Attachment width.
			"h": 720, // Attachment height.
			"tn_w": 250, // Attachment thumbnail width.
			"tn_h": 140, // Attachment thumbnail height.
			"tim": 1549182611230, // Attachment file name on server.
			"md5": "knN3NBdljasl085ylrpzfQ==", // Attachment file MD5.
			"fsize": 201912, // Attachment file size.

			"resto": 0, // Thread ID. `0` for the first post of the thread.
			"bumplimit": 0,
			"imagelimit": 0,
			"semantic_url": "gegege-no-kitaro",
			"custom_spoiler": 1,
			"replies": 45, // Thread comments count.
			"images": 41, // Thread images count.
			"unique_ips": 6 // Thread unique IP posters count.
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

* Find the max post ID: `getMaxPostID(response)`.

* Store `maxPostID` and all thread IDs (with their `replies` count) somewhere in state (this is a "stateful" approach).

* Wait for `N` minutes.

* Get the list of threads of a board again.

* Post IDs are local to a board so the amount of posts added since the previous time is the difference of max post IDs: `getMaxPostID(response) - state.maxPostID`. Divide it by `N` and it will be the "posts per minute" stats for the board.

* (stateless) Calculate an approximate "posts per minute" for each thread: `(thread.replies / (thread.last_modified - thread.time)) / 60`. This is an average "posts per minute" stats for a thread across its entire lifespan.

* (possible alternative) Calculate the posts count difference for each thread: `thread.replies - findThreadById(state.threads, thread.no).replies`. Divide it by `N` and it will be the "posts per minute" stats for a thread. For new threads assume the previous posts count to be `0`.

The above steps are performed for each board with a delay `>= 1 sec` between moving from one board to another due to the 4chan API request rate limit of "max one request per second".