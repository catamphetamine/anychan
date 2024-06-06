import type { CommentFromDataSource, GetThreadsParameters, GetThreadsResult, ThreadFromDataSource } from '@/types'

import { CHANNELS } from './data/index.js'

import { ChannelNotFoundError } from '../../../../src/api/errors/index.js'

const LATEST_COMMENTS_COUNT = 2

export async function getThreads({
	channelId,
	withLatestComments
}: GetThreadsParameters): Promise<GetThreadsResult> {
	const channel = CHANNELS.find(_ => _.id === channelId)

	if (!channel) {
		throw new ChannelNotFoundError({ channelId })
	}

	return {
		channel: {
			id: channel.id,
			title: channel.title
		},
		threads: getThreadsWithOrWithoutLatestComments(channel.threads, withLatestComments)
	}
}

function getThreadsWithOrWithoutLatestComments(threads: ThreadFromDataSource[], withLatestComments: boolean) {
	if (withLatestComments) {
		return threads.map((thread) => ({
			...thread,
			// Just the "root" comment of the thread.
			comments: [thread.comments[0]],
			// "Latest comments", excluding the "root" comment of the thread.
			latestComments: thread.comments.slice(-LATEST_COMMENTS_COUNT).filter(_ => _.id !== thread.comments[0].id)
		}))
			// Sort by "latest comments first"
			.sort((a, b) => {
				const latestCommentA = a.comments[a.comments.length - 1]
				const latestCommentB = b.comments[b.comments.length - 1]
				return compareLatestFirst(latestCommentA, latestCommentB)
			})
	}

	return threads
		// Sort by "latest threads first"
		.slice().sort((a, b) => {
			const rootCommentA = a.comments[0]
			const rootCommentB = b.comments[0]
			return compareLatestFirst(rootCommentA, rootCommentB)
		})
}

function compareLatestFirst(a: CommentFromDataSource, b: CommentFromDataSource) {
	if (a.createdAt && b.createdAt) {
		return b.createdAt.getTime() - a.createdAt.getTime()
	}
	return b.id - a.id
}