const IN_REPLY_TO_REGEXP = ' data-thread="(\\d+?)" data-num="(\\d+?)">'

/**
 * Returns a list of posts ids to which this post replies.
 * @param  {text} comment — Raw comment HTML
 * @return {object[]}
 * @example
 * // Outputs:
 * // [
 * //   45678,
 * //   ...
 * // ]
 * getInReplyToPosts(...)
 */
export default function getInReplyToPosts(comment, options) {
	const matches = comment.match(new RegExp(IN_REPLY_TO_REGEXP, 'g'))
	if (!matches) {
		return []
	}
	return matches.map(match => match.match(new RegExp(IN_REPLY_TO_REGEXP)))
		.filter(([_, threadId, postId]) => parseInt(threadId) === options.threadId)
		.map(([_, threadId, postId]) => parseInt(postId))
}