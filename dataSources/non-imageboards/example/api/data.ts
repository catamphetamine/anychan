import type { ChannelFromDataSource, ThreadFromDataSource, CommentFromDataSource } from '@/types'

import IMAGE1 from '../resources/images/image-1.svg.js'
import IMAGE2 from '../resources/images/image-2.svg.js'
import IMAGE3 from '../resources/images/image-3.svg.js'

// Those SVGs are explicitly configured in `webpack.config.ts` file
// to be loaded not as React components but as string URLs.
const IMAGE1_URL = IMAGE1 as unknown as string
const IMAGE2_URL = IMAGE2 as unknown as string
const IMAGE3_URL = IMAGE3 as unknown as string

export const CHANNEL1: ChannelFromDataSource = {
	id: 'b',
	title: 'Random'
}

const CHANNEL1_THREAD1_COMMENT1_PICTURE1 = {
	type: 'image/svg+xml',
	url: IMAGE1_URL,
	width: 553.043798,
	height: 469.597629
}

export const CHANNEL1_THREAD1_COMMENT1: CommentFromDataSource = {
	id: 2101,
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
	id: 2102,
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
	id: 2103,
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

const CHANNEL1_THREAD1_COMMENTS = [
	CHANNEL1_THREAD1_COMMENT1,
	CHANNEL1_THREAD1_COMMENT2,
	CHANNEL1_THREAD1_COMMENT3
]

export const CHANNEL1_THREAD1: ThreadFromDataSource = {
	id: CHANNEL1_THREAD1_COMMENT1.id,
	channelId: CHANNEL1.id,
	title: 'Chill thread',
	commentsCount: CHANNEL1_THREAD1_COMMENTS.length,
	attachmentsCount: CHANNEL1_THREAD1_COMMENTS.reduce((attachmentsCount, comment) => {
		return attachmentsCount += comment.attachments ? comment.attachments.length : 0
	}, 0),
	comments: CHANNEL1_THREAD1_COMMENTS
}

const CHANNEL1_THREAD2_COMMENT1_PICTURE1 = {
	type: 'image/svg+xml',
	url: IMAGE2_URL,
	width: 415.853478,
	height: 408.283473
}

const CHANNEL1_THREAD2_COMMENT4_PICTURE1 = {
	type: 'image/svg+xml',
	url: IMAGE3_URL,
	width: 390.637376,
	height: 440.719598
}

export const CHANNEL1_THREAD2_COMMENT1: CommentFromDataSource = {
	id: 2201,
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
	id: 2102,
	content: [
		[
			{
				type: 'post-link',
				url: `${CHANNEL1.id}/${CHANNEL1_THREAD2_COMMENT1.id}#${CHANNEL1_THREAD2_COMMENT1.id}`,
				meta: {
					channelId: CHANNEL1.id,
					threadId: CHANNEL1_THREAD2_COMMENT1.id,
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
	id: 2103,
	content: [
		[
			'It\'s mathematics but it was popularized deforming it into a bastard breed.',
			'\n',
			'Personally I would wedge it somewhere between differential equations and graph theory.'
		]
	]
}

export const CHANNEL1_THREAD2_COMMENT4: CommentFromDataSource = {
	id: 2104,
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

const CHANNEL1_THREAD2_COMMENTS = [
	CHANNEL1_THREAD2_COMMENT1,
	CHANNEL1_THREAD2_COMMENT2,
	CHANNEL1_THREAD2_COMMENT3,
	CHANNEL1_THREAD2_COMMENT4
]

export const CHANNEL1_THREAD2: ThreadFromDataSource = {
	id: CHANNEL1_THREAD2_COMMENT1.id,
	channelId: CHANNEL1.id,
	title: 'Question',
	commentsCount: CHANNEL1_THREAD2_COMMENTS.length,
	attachmentsCount: CHANNEL1_THREAD2_COMMENTS.reduce((attachmentsCount, comment) => {
		return attachmentsCount += comment.attachments ? comment.attachments.length : 0
	}, 0),
	comments: CHANNEL1_THREAD2_COMMENTS
}
