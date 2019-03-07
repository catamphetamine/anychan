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

Parses a list of [boards](#board).

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

Parses a list of [threads](#thread).

```js
[
	Thread,
	Thread,
	...
]
```

### Parser.parseComments(apiResponse, { boardId })

Parses a list of [comments](#comment).

```js
[
	Comment,
	Comment,
	...
]
```

## Comment

```js
{
	id: number,
	title: string,
	titleCensored: [(string|arrayOf(string|object))],
	createdAt: Date,
	content: arrayOf(arrayOf(postPart)),
	attachments: object[], // Can be a "picture" or a "video".
	replies: id[]
}
```

## Thread

```js
{
	// Inherits from `Comment`.
	commentsCount: number,
	attachmentsCount: number,
	comments: Comment[]
}
```

## Board

```js
{
	id: string,
	name: string,
	description: string
}
```