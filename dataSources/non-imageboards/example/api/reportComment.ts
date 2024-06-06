import type { ReportCommentParameters, ReportCommentResult } from '@/types'

import { CHANNELS } from './data/index.js'

import { ChannelNotFoundError, ThreadNotFoundError, AlreadyReportedCommentError } from '../../../../src/api/errors/index.js'

export async function reportComment({
	channelId,
	threadId,
	content
}: ReportCommentParameters): Promise<ReportCommentResult> {
	const channel = CHANNELS.find(_ => _.id === channelId)

	if (!channel) {
		throw new ChannelNotFoundError({ channelId })
	}

	const thread = channel.threads.find(_ => _.id === threadId)

	if (!thread) {
		throw new ThreadNotFoundError({ channelId, threadId })
	}

	// Doesn't check if the user has already reported the comment.
	// throw new AlreadyReportedCommentError()

	// "Report has been submitted"
}