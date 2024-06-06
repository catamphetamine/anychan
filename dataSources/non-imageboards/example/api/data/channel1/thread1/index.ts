import type { ThreadFromDataSource, CommentFromDataSource } from '@/types'

// Having this export in a separate file prevents "circular dependency"
// from thread `index.ts` files to the channel `index.ts` file.
import CHANNEL1_INFO from '../index.json' assert { type: 'json' }

import IMAGE1_URL from '../../../../resources/images/image-1.svg.js'

const CHANNEL1_ID = CHANNEL1_INFO.id

const CHANNEL1_THREAD1_ID = 2101

const CHANNEL1_THREAD1_COMMENT1_ID = CHANNEL1_THREAD1_ID
const CHANNEL1_THREAD1_COMMENT2_ID = CHANNEL1_THREAD1_ID + 1
const CHANNEL1_THREAD1_COMMENT3_ID = CHANNEL1_THREAD1_ID + 2
const CHANNEL1_THREAD1_COMMENT4_ID = CHANNEL1_THREAD1_ID + 3

const CHANNEL1_THREAD1_COMMENT1_PICTURE1 = {
	type: 'image/svg+xml',
	url: IMAGE1_URL,
	width: 680,
	height: 680
}

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
				url: `${CHANNEL1_ID}/${CHANNEL1_THREAD1_COMMENT1.id}#${CHANNEL1_THREAD1_COMMENT1.id}`,
				meta: {
					channelId: CHANNEL1_ID,
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
				url: `${CHANNEL1_ID}/${CHANNEL1_THREAD1_COMMENT1.id}#${CHANNEL1_THREAD1_COMMENT2.id}`,
				meta: {
					channelId: CHANNEL1_ID,
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
	channelId: CHANNEL1_ID,
	title: CHANNEL1_THREAD1_COMMENT1.title,
	commentsCount: CHANNEL1_THREAD1_COMMENTS.length,
	attachmentsCount: CHANNEL1_THREAD1_COMMENTS.reduce((attachmentsCount, comment) => {
		return attachmentsCount += comment.attachments ? comment.attachments.length : 0
	}, 0),
	comments: CHANNEL1_THREAD1_COMMENTS
}
