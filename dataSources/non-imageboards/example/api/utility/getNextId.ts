import { CHANNELS } from '../data/index.js'

export default function getNextId() {
	// Get max thread ID across all channels.
	// Strictly speaking, this is not required because thread IDs are included in comment IDs.
	// I just didn't remove this part of the code because it was already written.
	const maxThreadIdForChannels = CHANNELS.map(
		(channel) => Math.max(...channel.threads.map(_ => _.id))
	)
	const maxThreadId = Math.max(...maxThreadIdForChannels)

	// Get max comment ID across all threads of all channels.
	const maxCommentIdForChannelsForThreads = CHANNELS.map(
		(channel) => channel.threads.map(
			(thread) => Math.max(...thread.comments.map(_ => _.id))
		)
	)
	const maxCommentIdForChannels = maxCommentIdForChannelsForThreads.map(
		(maxCommentIdForChannelsForThread) => Math.max(...maxCommentIdForChannelsForThread)
	)
	const maxCommentId = Math.max(...maxCommentIdForChannels)

	// Choose the maximum ID and add `1` to it.
	return Math.max(maxThreadId, maxCommentId) + 1
}