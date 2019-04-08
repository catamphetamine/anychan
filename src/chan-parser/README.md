Chan API response parser.

Supported chans: `2ch.hk`, `4chan.org`.

Features:

* Parses chan comments HTML into structured JSON documents.
* Automatically inserts quoted posts' text when none provided.

```js
import { Parser } from './chan-parser/2ch'
import { Parser } from './chan-parser/4chan'
```

### Parser.parseBoards(apiResponse)

Parses a list of [Boards](#board).

```js
{
	boards: Board[],
	// (optional)
	boardsByPopularity: Board[],
	// (optional)
	boardsByCategory: {
		'Category': Board[],
		...
	}
}
```

### Parser.parseThreads(apiResponse, { boardId })

Parses board contents. Returns a list of [Threads](#thread).


### Parser.parseThread(apiResponse, { boardId })

Parses a thread (having a list of [comments](#comment)). Returns a [Thread](#thread).

## Attachment

An attachment can be a:

* [Picture](#picture) attachment

```js
{
	type: 'picture',
	picture: Picture,
	// Will be `true` if the picture is marked as a "spoiler".
	// (for example, on `4chan.org`)
	spoiler: boolean?
}
```

* [Video](#video) attachment

```js
{
	type: 'video',
	video: Video,
	// Will be `true` if the video is marked as a "spoiler".
	// (for example, on `4chan.org`)
	spoiler: boolean?
}
```

* [File](#file) attachment

```js
{
	type: 'file',
	file: File
}
```

### Picture

```js
{
	// Picture MIME type. Example: "image/jpeg".
	type: string,
	// Picture width.
	width: number,
	// Picture height.
	height: number,
	// `true` if the image has transparent background.
	// (for example, in case of `2ch.hk` "stickers")
	transparent: boolean?,
	// Picture file size (in bytes).
	size: number,
	// Picture file URL.
	url: string,
	// (only for `2ch.hk`)
	// "sticker" in case of a `2ch.hk` sticker.
	kind: string?,
	// Extra picture sizes (thumbnails).
	sizes: [
		{
			// Thumbnail MIME type.
			type: string,
			// Thumbnail width.
			width: number,
			// Thumbnail height.
			height: number,
			// Thumbnail file URL.
			url: string
		}
	]
}
```

### Video

```js
{
	// Video MIME type. Example: "video/webm".
	type: string,
	// Video width.
	width: number,
	// Video height.
	height: number,
	// Video file size (in bytes).
	size: number,
	// Video duration (in seconds).
	duration: number,
	// Video thumbnail (poster).
	picture: Picture,
	// Video file URL (in case of a video file).
	url: string
}
```

<!--
### YouTube video (parsed from comment)

```js
{
	width: number?,
	height: number?,
	// Video duration (in seconds).
	duration: number?,
	// Video thumbnail (poster).
	picture: Picture,
	// "YouTube" in case of a YouTube video.
	provider: string,
	// YouTube video ID (in case of a YouTube video).
	id: string
}
```
-->

### File

```js
{
	// File MIME type. Example: "application/pdf".
	type: string,
	// File name. Example: "Report".
	name: string,
	// File extension with a dot. Example: ".pdf".
	ext: string,
	// File size (in bytes).
	size: number,
	// File URL.
	url: string
}
```

## Comment

```js
{
	id: number,
	boardId: string,
	threadId: number,
	title: string,
	titleCensored: InlineContent?, // If `title` contained censored words an censored title containing "spoilers" will be generated.
	createdAt: Date,
	tripCode: String?,
	isThreadAuthor: boolean?, // `2ch.hk` provides means for OPs to identify themselves when replying in their threads.
	authorId: String?, // Some chans identify their users by a hash of their IP address on some of their boards (for example, on `/pol/` of `4chan.org`, `8ch.net`, `kohlchan.net`).
	authorIdColor: String?, // If `authorId` is present then it's converted into a HEX color. Example: "#c05a7f".
	authorName: String?,
	authorNameId: boolean?, // `2ch.hk` autogenerates names based on IP address hash on `/po` board. If this flag is `true` then it means that `authorName` is an equivalent of an `authorId`.
	authorCountry: String?, // A two-letter ISO country code (or "ZZ" for "Anonymized"). Some chans identify their users by their country (for example, on `/int/` of `8ch.net`).
	// Some chans allow icons for posts on some boards.
	// For example, `kohlchan.net` shows user icons on `/int/` board.
	// `authorIconId` examples in this case: "UA", "RU-MOW", "TEXAS", "PROXYFAG", etc.
	// `authorIconName` examples in this case: "Ukraine", "Moscow", "Texas", "Proxy", etc.
	// Also, `2ch.hk` allows icons for posts on various boards like `/po/`.
	// `authorIconId` examples in this case: "nya", "liber", "comm", "libertar", etc.
	// `authorIconName` examples in this case: "Nya", "Либерализм", "Коммунизм", "Либертарианство", etc.
	authorIconId: String?,
	authorIconName: String?,
	authorRole: String?, // Examples: "administrator", "moderator".
	authorWasBanned: boolean?,
	upvotes: number?, // Only for boards like `/po/` on `2ch.hk`.
	downvotes: number?, // Only for boards like `/po/` on `2ch.hk`.
	content: Content?, // Example: `[['Text']]`.
	contentPreview: Content?, // If the `content` is too long a preview is generated.
	attachments: Attachment[],
	replies: []
}
```

## Thread

```js
{
	id: number, // Same as the "id" of the first comment.
	boardId: string,
	commentsCount: number,
	commentAttachmentsCount: number,
	comments: Comment[],
	isSticky: boolean?,
	isLocked: boolean?,
	isRolling: boolean?, // Only for 2ch.hk. A "rolling" thread is the one where old messages are purged as new ones come in.
	isBumpLimitReached: boolean?,
	isAttachmentLimitReached: boolean?, // Only for 4chan.org.
	maxCommentLength: number, // Only for 2ch.hk.
	maxAttachmentsSize: number, // Only for 2ch.hk.
	lastModifiedAt: Date, // Only for 4chan.org. "Last Modified Date", including: replies, deletions, sticky/closed status changes.
	customSpoilerId: number?, // Only for 4chan.org. Custom spoiler ID (if custom spoilers are used on the board).
	uniquePostersCount: number?, // Only for "get thread" API response. Unique poster IPs count.
}
```

## Board

```js
{
	id: string,
	name: string,
	description: string,
	isNotSafeForWork: boolean,
	bumpLimit: number,
	attachmentLimit: number, // Only for 4chan.org
	maxCommentLength: number, // Only for 4chan.org
	maxAttachmentsSize: number, // Only for 4chan.org
	maxVideoAttachmentsSize: number, // Only for 4chan.org
	createThreadCooldown: number, // Only for 4chan.org
	replyCooldown: number, // Only for 4chan.org
	attachFileCooldown: number, // Only for 4chan.org
	isSageAllowed: boolean, // Only for 2ch.hk
	showNames: boolean, // Only for 2ch.hk
}
```

## InlineContent

An "inline content" can be:

  * A string
  * An object
  * An array of strings and objects

Examples of an object:

```js
{
	type: 'text',
	style: 'bold',
	content: InlineContent
}
```

```js
{
	type: 'link',
	url: 'https://google.com',
	content: InlineContent
}
```

```js
{
	type: 'spoiler',
	content: InlineContent
}
```

## Content

"Content" is an array of "block-level" elements. A block-level element can be:

  * A paragraph (`InlineContent`)
  * An embedded attachment (picture, video)