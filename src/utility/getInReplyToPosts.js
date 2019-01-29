import test from './getInReplyToPosts.test'

const IN_REPLY_TO_REGEXP = ' data-thread="(.+?)" data-num="(.+?)">'

/**
 * Returns a list of posts ids to which this post replies.
 * @param  {text} comment — Raw comment HTML
 * @return {object[]}
 * @example
 * // Outputs:
 * // [{
 * //   threadId: '12345',
 * //   postId: '45678'
 * // }, ...]
 * getInReplyToPosts(...)
 */
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