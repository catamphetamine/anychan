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
	// Comment ID.
	id: number,
	// Board ID.
	// Example: "b".
	boardId: string,
	// Thread ID.
	threadId: number,
	// Comment title.
	title: string,
	// If `title` contained censored words a censored title
	// containing "spoilers" will be generated.
	titleCensored: InlineContent?,
	// The date on which the comment was posted.
	createdAt: Date,
	// A "tripcode".
	// https://encyclopediadramatica.rs/Tripcode
	tripCode: String?,
	// `2ch.hk` provides means for "original posters" to identify themselves
	// when replying in their own threads from the same IP address subnet.
	isThreadAuthor: boolean?,
	// Some chans identify their users by a hash of their IP address subnet
	// on some of their boards (for example, all chans do that on `/pol/` boards).
	authorId: String?,
	// If `authorId` is present then it's converted into a HEX color.
	// Example: "#c05a7f".
	authorIdColor: String?,
	// Comment author name.
	authorName: String?,
	// `2ch.hk` autogenerates names based on IP address subnet hash on `/po` board.
	// If this flag is `true` then it means that `authorName` is an equivalent of an `authorId`.
	authorNameId: boolean?,
	// A two-letter ISO country code (or "ZZ" for "Anonymized").
	// Chans usually show poster flags on `/int/` boards.
	authorCountry: String?,
	// Some chans allow icons for posts on some boards.
	// For example, `kohlchan.net` shows user icons on `/int/` board.
	// `authorIconId` examples in this case: "UA", "RU-MOW", "TEXAS", "PROXYFAG", etc.
	// `authorIconName` examples in this case: "Ukraine", "Moscow", "Texas", "Proxy", etc.
	// Also, `2ch.hk` allows icons for posts on various boards like `/po/`.
	// `authorIconId` examples in this case: "nya", "liber", "comm", "libertar", etc.
	// `authorIconName` examples in this case: "Nya", "Либерализм", "Коммунизм", "Либертарианство", etc.
	authorIconId: String?,
	authorIconName: String?,
	// If the comment was posted by a "priviliged" user
	// then it's gonna be the role of the comment author.
	// Examples: "administrator", "moderator".
	authorRole: String?,
	authorWasBanned: boolean?,
	// Downvotes count for this comment.
	// Only for boards like `/po/` on `2ch.hk`.
	upvotes: number?,
	// Downvotes count for this comment.
	// Only for boards like `/po/` on `2ch.hk`.
	downvotes: number?,
	// Comment content.
	// Example: `[['Text']]`.
	content: Content?,
	// If the `content` is too long a preview is generated.
	contentPreview: Content?,
	// Comment attachments.
	attachments: Attachment[]?,
	// The IDs of the comments to which this comment replies.
	inReplyTo: number[]?,
	// The IDs of the comments which are replies to this comment.
	replies: number[]?
}
```

## Thread

```js
{
	// Thread ID.
	// Same as the "id" of the first comment.
	id: number,
	// Board ID.
	// Example: "b".
	boardId: string,
	// Comments count in this thread.
	// (not including the main comment of the thread).
	commentsCount: number,
	// Attachments count in the comments of this thread.
	// (doesn't include the main comment of the thread).
	commentAttachmentsCount: number,
	// Comments in this thread.
	// (including the main comment of the thread).
	comments: Comment[],
	// Is this thread "sticky" (pinned).
	isSticky: boolean?,
	// Is this thread locked.
	isLocked: boolean?,
	// A "rolling" thread is the one where old messages are purged as new ones come in.
	isRolling: boolean?,
	// Was the "bump limit" reached for this thread already.
	isBumpLimitReached: boolean?,
	// `4chan.org` sets a limit on maximum attachments count in a thread.
	isAttachmentLimitReached: boolean?,
	// Maximum comment length in a thread on the board (a board-wide setting).
	// Is only present on threads on `2ch.hk`.
	// `4chan.org` has it on boards.
	maxCommentLength: number?,
	// Maximum total attachments size in a thread on the board (a board-wide setting).
	// Is only present on threads on `2ch.hk`.
	// `4chan.org` has it on boards.
	maxAttachmentsSize: number?,
	// "Last Modified Date", including: replies, deletions, sticky/closed status changes.
	// Only present for `4chan.org`.
	lastModifiedAt: Date?,
	// Custom spoiler ID (if custom spoilers are used on the board).
	// Only present for `4chan.org`.
	customSpoilerId: number?,
	// Unique poster IP address subnets count.
	// Only present in "get thread" API response.
	uniquePostersCount: number?
}
```

## Board

```js
{
	// Board ID.
	// Example: "b".
	id: string,
	// Board name.
	// Example: "Anime & Manga".
	name: string,
	// Board description.
	description: string,
	// Is this board "Not Safe For Work".
	isNotSafeForWork: boolean?,
	// "Bump limit" for threads on this board.
	bumpLimit: number?,
	// The maximum attachments count in a thread.
	// Only present for 4chan.org
	attachmentLimit: number?,
	// Maximum comment length in a thread on the board (a board-wide setting).
	// Only present for `4chan.org`.
	maxCommentLength: number?,
	// Maximum total attachments size in a thread on the board (a board-wide setting).
	// Only present for `4chan.org`.
	maxAttachmentsSize: number?,
	// Maximum total video attachments size in a thread on the board (a board-wide setting).
	// Only present for `4chan.org`.
	maxVideoAttachmentsSize: number?,
	// Create new thread cooldown.
	// Only present for `4chan.org`.
	createThreadCooldown: number?,
	// Post new comment cooldown.
	// Only present for `4chan.org`.
	replyCooldown: number?,
	// Post new comment with an attachment cooldown.
	// Only present for `4chan.org`.
	attachFileCooldown: number?,
	// Whether "sage" is allowed when posting comments on this board.
	// Only present for `4chan.org`.
	isSageAllowed: boolean?,
	// Whether to show a "Name" field in a "post new comment" form on this board.
	// Only present for `2ch.hk`.
	showNames: boolean?
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