import type { ChannelFromDataSource, ThreadFromDataSource, CommentFromDataSource } from '@/types'

import IMAGE1_URL from '../resources/images/image-1.svg.js'
import IMAGE2_URL from '../resources/images/image-2.svg.js'
import IMAGE3_URL from '../resources/images/image-3.svg.js'

// Simplifications:
//
// * Here, it doesn't add `createdAt` timestamps to threads or comments just for brevity.
//   A real-world API would've added `createdAt` timestamps though.
//
// * Here, it uses `*.svg` images just for smaller file size.
//   Hence, it doesn't add a `sizes[]` property to any `Picture`.
//   In real life though, pictures would almost always be "raster" rather than "vector"
//   meaning that they'd have a list of smaller `sizes[]`.

export const CHANNEL1: ChannelFromDataSource = {
	id: 'b',
	title: 'Random'
}

const CHANNEL1_THREAD1_COMMENT1_PICTURE1 = {
	type: 'image/svg+xml',
	url: IMAGE1_URL,
	width: 680,
	height: 680
}

const CHANNEL1_THREAD1_ID = 2101

const CHANNEL1_THREAD1_COMMENT1_ID = CHANNEL1_THREAD1_ID
const CHANNEL1_THREAD1_COMMENT2_ID = CHANNEL1_THREAD1_ID + 1
const CHANNEL1_THREAD1_COMMENT3_ID = CHANNEL1_THREAD1_ID + 2
const CHANNEL1_THREAD1_COMMENT4_ID = CHANNEL1_THREAD1_ID + 3

export const CHANNEL1_THREAD1_COMMENT1: CommentFromDataSource = {
	id: CHANNEL1_THREAD1_COMMENT1_ID,
	replyIds: [
		CHANNEL1_THREAD1_COMMENT2_ID
	],
	title: 'Chill thread',
	content: [
		[
			'Yo man, sup'
		]
	],
	attachments: [{
		type: 'picture',
		picture: CHANNEL1_THREAD1_COMMENT1_PICTURE1
	}]
}

export const CHANNEL1_THREAD1_COMMENT2: CommentFromDataSource = {
	id: CHANNEL1_THREAD1_COMMENT2_ID,
	inReplyToIds: [
		CHANNEL1_THREAD1_COMMENT1_ID
	],
	replyIds: [
		CHANNEL1_THREAD1_COMMENT3_ID
	],
	content: [
		[
			{
				type: 'post-link',
				url: `${CHANNEL1.id}/${CHANNEL1_THREAD1_COMMENT1.id}#${CHANNEL1_THREAD1_COMMENT1.id}`,
				meta: {
					channelId: CHANNEL1.id,
					threadId: CHANNEL1_THREAD1_COMMENT1.id,
					commentId: CHANNEL1_THREAD1_COMMENT1.id,
				},
				content: [
					{
						type: 'quote',
						block: true,
						content: 'sup'
					}
				]
			},
			'\n',
			'Yeah man, I\'m good'
		]
	]
}

export const CHANNEL1_THREAD1_COMMENT3: CommentFromDataSource = {
	id: CHANNEL1_THREAD1_COMMENT3_ID,
	inReplyToIds: [
		CHANNEL1_THREAD1_COMMENT2_ID
	],
	content: [
		[
			{
				type: 'post-link',
				url: `${CHANNEL1.id}/${CHANNEL1_THREAD1_COMMENT1.id}#${CHANNEL1_THREAD1_COMMENT2.id}`,
				meta: {
					channelId: CHANNEL1.id,
					threadId: CHANNEL1_THREAD1_COMMENT1.id,
					commentId: CHANNEL1_THREAD1_COMMENT2.id,
				},
				content: [
					{
						type: 'quote',
						block: true,
						content: 'good'
					}
				]
			},
			'\n',
			'Cool'
		]
	]
}

export const CHANNEL1_THREAD1_COMMENT4: CommentFromDataSource = {
	id: CHANNEL1_THREAD1_COMMENT4_ID,
	content: [
		[
			'bump'
		]
	]
}

const CHANNEL1_THREAD1_COMMENTS = [
	CHANNEL1_THREAD1_COMMENT1,
	CHANNEL1_THREAD1_COMMENT2,
	CHANNEL1_THREAD1_COMMENT3,
	CHANNEL1_THREAD1_COMMENT4
]

export const CHANNEL1_THREAD1: ThreadFromDataSource = {
	id: CHANNEL1_THREAD1_COMMENT1.id,
	channelId: CHANNEL1.id,
	title: CHANNEL1_THREAD1_COMMENT1.title,
	commentsCount: CHANNEL1_THREAD1_COMMENTS.length,
	attachmentsCount: CHANNEL1_THREAD1_COMMENTS.reduce((attachmentsCount, comment) => {
		return attachmentsCount += comment.attachments ? comment.attachments.length : 0
	}, 0),
	comments: CHANNEL1_THREAD1_COMMENTS
}

const CHANNEL1_THREAD2_COMMENT1_PICTURE1 = {
	type: 'image/svg+xml',
	url: IMAGE2_URL,
	width: 580,
	height: 580
}

const CHANNEL1_THREAD2_COMMENT4_PICTURE1 = {
	type: 'image/svg+xml',
	url: IMAGE3_URL,
	width: 580,
	height: 580
}

const CHANNEL1_THREAD2_ID = 2201

const CHANNEL1_THREAD2_COMMENT1_ID = CHANNEL1_THREAD2_ID
const CHANNEL1_THREAD2_COMMENT2_ID = CHANNEL1_THREAD2_ID + 1
const CHANNEL1_THREAD2_COMMENT3_ID = CHANNEL1_THREAD2_ID + 2
const CHANNEL1_THREAD2_COMMENT4_ID = CHANNEL1_THREAD2_ID + 3
const CHANNEL1_THREAD2_COMMENT5_ID = CHANNEL1_THREAD2_ID + 4

export const CHANNEL1_THREAD2_COMMENT1: CommentFromDataSource = {
	id: CHANNEL1_THREAD2_COMMENT1_ID,
	title: 'Question',
	content: [
		[
			'Is game theory a subfield of set theory or a branch of mathematics on its own?'
		]
	],
	attachments: [{
		type: 'picture',
		picture: CHANNEL1_THREAD2_COMMENT1_PICTURE1
	}]
}

export const CHANNEL1_THREAD2_COMMENT2: CommentFromDataSource = {
	id: CHANNEL1_THREAD2_COMMENT2_ID,
	inReplyToIds: [
		CHANNEL1_THREAD2_COMMENT1_ID
	],
	content: [
		[
			{
				type: 'post-link',
				url: `${CHANNEL1.id}/${CHANNEL1_THREAD2_ID}#${CHANNEL1_THREAD2_COMMENT1.id}`,
				meta: {
					channelId: CHANNEL1.id,
					threadId: CHANNEL1_THREAD2_ID,
					commentId: CHANNEL1_THREAD2_COMMENT1.id,
				},
				content: [
					{
						type: 'quote',
						block: true,
						contentGenerated: true,
						content: 'Is game theory a subfield of set theory or a branch of mathematics on its own?'
					}
				]
			},
			'\n',
			'It\'s kind of its own thing. At some point it does involve a little bit of geometry/topology when you mathematically define many-player equilibrium regions.'
		]
	]
}

export const CHANNEL1_THREAD2_COMMENT3: CommentFromDataSource = {
	id: CHANNEL1_THREAD2_COMMENT3_ID,
	content: [
		[
			'It\'s mathematics but it was popularized deforming it into a bastard breed.',
			'\n',
			'Personally I would wedge it somewhere between differential equations and graph theory.'
		]
	]
}

export const CHANNEL1_THREAD2_COMMENT4: CommentFromDataSource = {
	id: CHANNEL1_THREAD2_COMMENT4_ID,
	replyIds: [
		CHANNEL1_THREAD2_COMMENT5_ID
	],
	content: [
		[
			'Any game theory chads here? What\'s the best winning strategy in real life negotiations?'
		]
	],
	attachments: [{
		type: 'picture',
		picture: CHANNEL1_THREAD2_COMMENT4_PICTURE1
	}]
}

export const CHANNEL1_THREAD2_COMMENT5: CommentFromDataSource = {
	id: CHANNEL1_THREAD2_COMMENT5_ID,
	inReplyToIds: [
		CHANNEL1_THREAD2_COMMENT4_ID
	],
	content: [
		[
			{
				type: 'post-link',
				url: `${CHANNEL1.id}/${CHANNEL1_THREAD2_ID}#${CHANNEL1_THREAD2_COMMENT4.id}`,
				meta: {
					channelId: CHANNEL1.id,
					threadId: CHANNEL1_THREAD2_ID,
					commentId: CHANNEL1_THREAD2_COMMENT4.id,
				},
				content: [
					{
						type: 'quote',
						block: true,
						contentGenerated: true,
						content: 'Any game theory chads here? What\'s the best winning strategy in real life negotiations?'
					}
				]
			},
			'\n',
			'“Game theory” is a broad term, different kinds of games will look like different fields of math. A lot of the time it looks like combinatorics. But finding a Nash equilibrium looks like linear optimization. If the game is infinite in some way, then measure theory and even set theory could get involved.'
		]
	]
}

const CHANNEL1_THREAD2_COMMENTS = [
	CHANNEL1_THREAD2_COMMENT1,
	CHANNEL1_THREAD2_COMMENT2,
	CHANNEL1_THREAD2_COMMENT3,
	CHANNEL1_THREAD2_COMMENT4,
	CHANNEL1_THREAD2_COMMENT5
]

export const CHANNEL1_THREAD2: ThreadFromDataSource = {
	id: CHANNEL1_THREAD2_COMMENT1.id,
	channelId: CHANNEL1.id,
	title: CHANNEL1_THREAD2_COMMENT1.title,
	commentsCount: CHANNEL1_THREAD2_COMMENTS.length,
	attachmentsCount: CHANNEL1_THREAD2_COMMENTS.reduce((attachmentsCount, comment) => {
		return attachmentsCount += comment.attachments ? comment.attachments.length : 0
	}, 0),
	comments: CHANNEL1_THREAD2_COMMENTS
}

export const CHANNEL1_THREADS = [
	CHANNEL1_THREAD1,
	CHANNEL1_THREAD2
]