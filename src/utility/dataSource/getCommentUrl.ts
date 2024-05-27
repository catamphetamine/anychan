import type { DataSource, Channel, Thread, Comment } from '@/types'

import getCommentUrlPattern from './getCommentUrlPattern.js'

interface Parameters {
	channelId: Channel['id'];
	threadId: Thread['id'];
	commentId: Comment['id'];
	notSafeForWork: boolean;
}

export default function getCommentUrl(dataSource: DataSource, { channelId, threadId, commentId, notSafeForWork }: Parameters) {
	return getCommentUrlPattern(dataSource, { notSafeForWork })
		.replace('{channelId}', channelId)
		.replace('{threadId}', String(threadId))
		.replace('{commentId}', String(commentId))
}