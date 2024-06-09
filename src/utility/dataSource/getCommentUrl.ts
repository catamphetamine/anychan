import type { DataSource, Channel, Thread, Comment } from '@/types'

import getCommentUrlPattern from './getCommentUrlPattern.js'

export default function getCommentUrl(dataSource: DataSource, {
	channelId,
	threadId,
	commentId,
	channelContainsExplicitContent
}: Parameters) {
	return getCommentUrlPattern(dataSource, { channelContainsExplicitContent })
		.replace('{channelId}', channelId)
		.replace('{threadId}', String(threadId))
		.replace('{commentId}', String(commentId))
}

interface Parameters {
	channelId: Channel['id'];
	threadId: Thread['id'];
	commentId: Comment['id'];
	channelContainsExplicitContent: boolean;
}