import type { ThreadFromDataSource, CommentFromDataSource } from '@/types'

// Having this export in a separate file prevents "circular dependency"
// from thread `index.ts` files to the channel `index.ts` file.
import CHANNEL1_INFO from '../index.json' assert { type: 'json' }

import IMAGE2_URL from '../../../../resources/images/image-2.svg.dataUri.js'
import IMAGE3_URL from '../../../../resources/images/image-3.svg.dataUri..js'

const CHANNEL1_ID = CHANNEL1_INFO.id

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
	createdAt: new Date('2020-04-15T15:00:00.000Z'),
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
	createdAt: new Date('2020-04-15T15:05:00.000Z'),
	content: [
		[
			{
				type: 'post-link',
				url: `${CHANNEL1_ID}/${CHANNEL1_THREAD2_ID}#${CHANNEL1_THREAD2_COMMENT1.id}`,
				meta: {
					channelId: CHANNEL1_ID,
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
	createdAt: new Date('2020-04-16T15:10:00.000Z'),
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
	createdAt: new Date('2020-05-24T18:00:00.000Z'),
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
	createdAt: new Date('2020-05-25T18:15:00.000Z'),
	content: [
		[
			{
				type: 'post-link',
				url: `${CHANNEL1_ID}/${CHANNEL1_THREAD2_ID}#${CHANNEL1_THREAD2_COMMENT4.id}`,
				meta: {
					channelId: CHANNEL1_ID,
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
	channelId: CHANNEL1_ID,
	createdAt: CHANNEL1_THREAD2_COMMENT1.createdAt,
	title: CHANNEL1_THREAD2_COMMENT1.title,
	commentsCount: CHANNEL1_THREAD2_COMMENTS.length,
	attachmentsCount: CHANNEL1_THREAD2_COMMENTS.reduce((attachmentsCount, comment) => {
		return attachmentsCount += comment.attachments ? comment.attachments.length : 0
	}, 0),
	comments: CHANNEL1_THREAD2_COMMENTS
}
