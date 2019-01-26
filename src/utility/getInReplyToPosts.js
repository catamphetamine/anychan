import test from './getInReplyToPosts.test'

const IN_REPLY_TO_REGEXP = ' data-thread="(.+?)" data-num="(.+?)">'

export default function getInReplyToPosts(comment) {
	const matches = comment.match(new RegExp(IN_REPLY_TO_REGEXP, 'g'))
	if (!matches) {
		return []
	}
	return matches.map((match) => {
		match = match.match(new RegExp(IN_REPLY_TO_REGEXP))
		return {
			threadId: match[1],
			postId: match[2]
		}
	})
}

test(getInReplyToPosts)