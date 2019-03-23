# `kohlchan.net` API

`kohlchan.net` is built on [`vichan`](https://github.com/vichan-devel/vichan) engine which is a fork of [`Tinyboard`](https://github.com/savetheinternet/Tinyboard) engine.

`vichan` API is mostly compatible to [`4chan` API](https://github.com/catamphetamine/chanchan/blob/master/docs/4chan.org/API.md). For example, compare the official [`vichan` API readme](https://github.com/vichan-devel/vichan-API) to the official [`4chan` API readme](https://github.com/4chan/4chan-API): they're mostly the same.

### Post

`kohlchan.net`, being built on `vichan` engine, supports `email` property on Posts. If `email` is `"sage"` then the post is a ["sage"](https://knowyourmeme.com/memes/sage) (non-bumping) one.

### Attachment

`kohlchan.net` supports multiple attachments per post via the `extra_files[]` property of a Post.

For images, thumbnail extension is always `.png`. For videos, thumbnail extension is always `.jpg`.

Thumbnail size is `200px`.

### Roles

`kohlchan.net` doesn't have a "Name" field when posting a message. So `name` property plays the role of `capcode`.

Possible `name`s:

* `"Helmut"` for admin
* `"Moderation"` for moderators

### Get boards list

`kohlchan.net` doesn't have a `/boards.json` API. The boards list is stored statically in a [JSON file](https://github.com/catamphetamine/chanchan/blob/master/chan/kohlchan/index.json).