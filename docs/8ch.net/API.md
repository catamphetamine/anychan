# `8ch.net` API

`8ch.net` is built on [`OpenIB`](https://github.com/OpenIB/OpenIB) engine which is a security-focused fork of [`infinity`](https://github.com/ctrlcctrlv/infinity) enging which is a fork of [`vichan`](https://github.com/vichan-devel/vichan) engine which is a fork of [`Tinyboard`](https://github.com/savetheinternet/Tinyboard) engine.

`vichan` API is mostly compatible to [`4chan` API](https://github.com/catamphetamine/chanchan/blob/master/docs/4chan.org/API.md). For example, compare the official [`vichan` API readme](https://github.com/vichan-devel/vichan-API) to the official [`4chan` API readme](https://github.com/4chan/4chan-API): they're mostly the same.

### Post

`8ch.net`, being built on `vichan` engine, supports `email` property on Posts. If `email` is `"sage"` then the post is a ["sage"](https://knowyourmeme.com/memes/sage) (non-bumping) one.

### Attachment

`8ch.net`, being built on `infinity` engine, supports multiple attachments per post via the `extra_files[]` property of a Post.

For images, thumbnail extension is always the extension of the original attachment (even for `.gif` files). For videos, thumbnail extension is always `.jpg`.

If an attachment has `fpath: 1` property then its URL is `https://media.8ch.net/file_store/{name}{ext}` instead of the regular `https://media.8ch.net/{boardId}/src/{name}{ext}`, and its thumbnail URL is `https://media.8ch.net/file_store/thumb/{name}{ext}` instead of the regular `https://media.8ch.net/{boardId}/thumb/{name}{ext}`.

Thumbnail size is `255px`.

### Roles

If a comment has a `capcode` then it implies that the poster is a priviliged one. Possible `capcode`s:

* `"Admin"` for global admins
* `"Global Volunteer"` for global moderators
* `"Board Owner"` for board admins
* `"Board Volunteer"` for board moderators

### Get boards list

`8ch.net` allows their users to create their own boards which results in a huge amount of boards being returned from the `https://8ch.net/boards.json` API (about 20 000 boards total).

Because of that, `8ch.net` provides a lighter-weight API for getting the top-50-some list of the most active boards: `https://8ch.net/boards-top20.json`.

Example output:

```js
[
  {
    "uri": "pol",
    "title": "Politically Incorrect",
    "subtitle": "Politics, news, happenings, current events",
    "indexed": "1",
    "sfw": "0",
    "posts_total": "13007534",
    "time": null,
    "weight": 0,
    "locale": "English",
    "tags": [
      "/pol/",
      "politics",
      "news",
      "free-speech",
      "current-events"
    ],
    "max": "13007534",
    "active": 3808,
    "pph": 287,
    "ppd": 7664,
    "pph_average": 329
  },
 	...
]
```

### Get board settings

[`https://8ch.net/settings.php?board=b`](https://8ch.net/settings.php?board=b)

[Read the comments in the engine code](https://github.com/ctrlcctrlv/infinity/blob/master/inc/config.php)

```js
{
	// Board name.
  "title": "Anime/Random",

  // Board description.
  "subtitle": "Not vaccinated!",

  // Whether this board is "indexed".
  // (I guess, it means something like "searchable").
  "indexed": true,

  // Whether to show poster country flags.
  "country_flags": false,

  // When `true`, all names will be set to `$config['anonymous']`.
  "field_disable_name": false,

  // Whether links to popular services can be embedded on this board.
  "enable_embedding": false,

  // Whether the main post must have an attachment.
  "force_image_op": true,

  // Whether attachments are disabled for posting on this board.
  "disable_images": false,

  // Whether to show poster IDs (IP address hashes).
  "poster_ids": false,

  // Whether to display if a post is a "sage" (non-bumping) one.
  "show_sages": true,

  // Whether to automatically convert things like "..." to Unicode characters ("…").
  "auto_unicode": true,

  // Whether to strip combining characters from Unicode strings (eg. "Zalgo").
  // (whatever that means)
  "strip_combining_chars": true,

	// Allow dice rolling:
	// an email field of the form "dice XdY+/-Z" will result in X Y-sided dice rolled and summed,
	// with the modifier Z added, with the result displayed at the top of the post body.
  "allow_roll": false,

  // Whether to reject duplicate image uploads.
  "image_reject_repost": false,

  // Whether to reject duplicate image uploads within the thread.
  // Doesn't change anything if `$config['image_reject_repost']` is `true`.
  "image_reject_repost_in_thread": false,

  "early_404": true,

  // Whether to allow deleting something.
  // Perhaps images or comments themselves.
  "allow_delete": false,

  // The default poster name (if none provided).
  "anonymous": "Anonymous",

  // Some sort of a banner (header).
  "blotter": "Just 🐝 yourself. <a href=\"https://8ch.net/b/rules.html\">Rules.</a>",

  // Styles available for the board.
  "stylesheets": {
    "Yotsuba": "yotsuba.css",
    "Tomorrow": "tomorrow.css",
    "Custom": "board/b.css",
    ...
  },

  // Default style for the board.
  "default_stylesheet": [
    "Custom",
    "board/b.css"
  ],

  // CAPTCHA settings.
  "captcha": {
  	// Whether CAPTCHA is enabled on this board.
    "enabled": false,
    // CAPTCHA expires in (seconds).
    "expires_in": 120,
    // CAPTCHA characters count.
    "length": 6,
    // Custom CAPTCHA provider path.
    "provider_get": "https://8ch.net/8chan-captcha/entrypoint.php",
    "provider_check": "https://8ch.net/8chan-captcha/entrypoint.php",
    // Custom captcha extra field (eg. charset).
    "extra": "abcdefghijklmnopqrstuvwxyz",
    "provider_get_sys": "https://sys.8ch.net/8chan-captcha/entrypoint.php",
    "provider_check_pop": "https://8ch.net/8chan-captcha/entrypoint_pop.php"
  },

  // Whether the main post must have a subject.
  "force_subject_op": true,

  // Whether this board allows posting from Tor network.
  "tor_posting": true,

  // Whether this board requires solving a CAPTCHA to start a new thread.
  "new_thread_capt": true,

  // Board language.
  "locale": "en",

  // Perhaps allowed video attachment extensions.
  "allowed_ext_files": [
    "webm",
    "mp4"
  ],

  // Allowed attachment extensions.
  "allowed_ext": [
    "jpg",
    "jpeg",
    "gif",
    "png"
  ],

  // Available flag images for posters on this board.
  // The key is the filename of a flag image.
  "user_flags": {
    "1518895436081": "8kek",
    "1518895448688": ":^)",
    "1518895459383": "Akira",
    ...
  },

  // Word replacement.
  // Can contain regular expressions.
  "wordfilters": [
    [
      "fnords",
      ""
    ],
    [
      "fnord",
      ""
    ]
  ],

  // Whether this board allows posting math using LaTeX syntax.
  // For example, it could be enabled for some `/science/` boards.
  "latex": false,

  // Whether this board allows posting code using code tags.
  // For example, it could be enabled for some `/programming/` boards.
  "code_tags": true,

  // Maximum number of newlines.
  // (whatever that means)
  // (0 for unlimited)
  "max_newlines": 0,

  // I guess this is the "bump limit" for threads on this board.
  "reply_limit": 250,

  // Max attachments per post.
  "max_images": 5
}
```

### Links

For some reason, links on `8ch.net` have their protocol colon wrapped in `<em></em>` tag. Perhaps this is to prevent some kind of crawling. Google doesn't index `8ch.net` anyway.