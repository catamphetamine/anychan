import type { GetCommentById, Thread } from '@/types'

import createByIdIndex from '../createByIdIndex.js'

export default function createGetCommentById(thread: Thread): GetCommentById {
	return createByIdIndex(
		thread.latestComments
			// When a `thread` is fetched for the channel page for "with latest comments" layout,
			// the `thread` object only contains the "original comment" and some of the "latest comments".
			// Therefore, in such restrained conditions, it can only search in that limited set of comments
			// and it can't really search in all of the comments.
			// Still, some is better than none so it creates a limited list of comments it can search in.
			? thread.latestComments.concat(thread.comments)
			: thread.comments
	)
}