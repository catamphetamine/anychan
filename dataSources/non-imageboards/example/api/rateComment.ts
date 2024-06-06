import type { RateCommentParameters, RateCommentResult } from '@/types'

import { CHANNELS } from './data/index.js'

import { ChannelNotFoundError, ThreadNotFoundError, CommentNotFoundError, AlreadyRatedCommentError } from '../../../../src/api/errors/index.js'

export async function rateComment({
	channelId,
	threadId,
	commentId,
	up
}: RateCommentParameters): Promise<RateCommentResult> {
	const channel = CHANNELS.find(_ => _.id === channelId)

	if (!channel) {
		throw new ChannelNotFoundError({ channelId })
	}

	const thread = channel.threads.find(_ => _.id === threadId)

	if (!thread) {
		throw new ThreadNotFoundError({ channelId, threadId })
	}

	const comment = thread.comments.find(_ => _.id === commentId)

	if (!comment) {
		throw new CommentNotFoundError({ channelId, threadId, commentId })
	}

	// Doesn't check if the user has already rated this comment.
	// throw new AlreadyRatedCommentError()

	if (up) {
		comment.upvotes = (comment.upvotes || 0) + 1
	} else {
		comment.downvotes = (comment.downvotes || 0) + 1
	}

	// "Your vote has been submitted"
	return true
}