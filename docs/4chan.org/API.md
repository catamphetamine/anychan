### Get boards list

https://a.4cdn.org/boards.json

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

https://a.4cdn.org/a/catalog.json

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