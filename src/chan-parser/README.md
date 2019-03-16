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
	boards: [
		Board,
		Board,
		...
	],
	boardsByPopularity: [
		Board,
		Board,
		...
	],
	boardsByCategory: {
		'Category': [
			Board,
			Board,
			...
		],
		...
	}
}
```

### Parser.parseThreads(apiResponse, { boardId })

Parses board contents. Returns a list of [Threads](#thread).


### Parser.parseThread(apiResponse, { boardId })

Parses a thread (having a list of [comments](#comment)). Returns a [Thread](#thread).

## Attachment

An attachment can be:

  * A picture
  * A video

## Comment

```js
{
	id: number,
	boardId: string,
	threadId: number,
	title: string,
	titleCensored: InlineContent, // If `title` contained censored words an censored title containing "spoilers" will be generated.
	createdAt: Date,
	authorName: String,
	authorRole: String,
	authorWasBanned: boolean,
	content: Content, // Example: `[['Text']]`.
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
	attachmentsCount: number,
	comments: Comment[],
	isSticky: boolean?,
	isClosed: boolean?,
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