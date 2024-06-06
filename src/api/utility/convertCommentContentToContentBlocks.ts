import type { ThreadFromDataSource } from '@/types'

// The `content` of each `comment` should be forcefully converted to a list of `ContentBlock`s.
// The rationale is that it's easier to operate on (i.e. post-process) a single pre-defined type of structure
// rather than support different edge cases like `content` being just a `string`.
export default function convertCommentContentToContentBlocks(thread: ThreadFromDataSource) {
	for (const comment of thread.comments) {
		if (typeof comment.content === 'string') {
			comment.content = [[comment.content]]
		}
	}
	if (thread.latestComments) {
		for (const latestComment of thread.comments) {
			if (typeof latestComment.content === 'string') {
				latestComment.content = [[latestComment.content]]
			}
		}
	}
}