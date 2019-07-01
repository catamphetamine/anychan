# `kohlchan.net` API

`kohlchan.net` is built on [`vichan`](https://github.com/vichan-devel/vichan) engine which is a fork of [`Tinyboard`](https://github.com/savetheinternet/Tinyboard) engine.

`vichan` API is mostly compatible to [`4chan` API](https://github.com/catamphetamine/chanchan/blob/master/docs/4chan.org.md). For example, compare the official [`vichan` API readme](https://github.com/vichan-devel/vichan-API) to the official [`4chan` API readme](https://github.com/4chan/4chan-API): they're mostly the same.

### Post

`kohlchan.net`, being built on `vichan` engine, supports `email` property on Posts. If `email` is `"sage"` then the post is a ["sage"](https://knowyourmeme.com/memes/sage) (non-bumping) one.

### Attachment

`kohlchan.net` supports multiple attachments per post via the `extra_files[]` property of a Post.

For images, thumbnail extension is always `.png`. For videos, thumbnail extension is always `.jpg`.

Thumbnail size is `200px`.

## Syntax

Message HTML syntax is:

* `<strong>...</strong>` — bold text.
* `<em>...</em>` — italic text.
* `<span style="text-decoration: underline">...</span>` — underlined text.
* `<span style="text-decoration: line-through">...</span>` — strikethrough text.
* `<span class="quote">...</span>` — quoted text (starts with a `>`).
* `<span class="quote2">...</span>` — red quoted text (starts with a `<`).
* `<span class="spoiler">...</span>` — spoiler text.
* `<code>...</code>` — inline code.
* `<a href="#p184569592" class="quotelink">...</a>` — post link (starts with a `>>`).
* `<a href="...">...</a>` — other links (the URL may be in any form: relative like `/a/thread/184064641#p184154285` or `/r/`, absolute like `https://boards.4chan.org/wsr/`, absolute-same-protocol like `//boards.4chan.org/wsr/`).
* "Advanced" users may potentially use some unconventional markup, so all unknown/invalid tags should be ignored by just displaying their content (which can itself contain unknown/invalid tags).

### Roles

`kohlchan.net` doesn't have a "Name" field when posting messages. So `name` property plays the role of a `capcode`.

Possible `name`s:

* `"Helmut"` for admin
* `"Moderation"` for moderators

### Get boards list

`kohlchan.net` doesn't have a `/boards.json` API. The boards list is stored statically in a [JSON file](https://github.com/catamphetamine/chanchan/blob/master/chan/kohlchan/index.json).