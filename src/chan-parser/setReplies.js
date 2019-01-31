/**
 * For each post sets `post.replies` to
 * the list of replies to this post.
 * @param {object[]} posts — Parsed posts.
 */
export default function setReplies(posts) {
	for (const post of posts) {
		if (post.inReplyTo) {
			for (const postInfo of post.inReplyTo) {
				const { threadId, postId } = postInfo
				if (threadId === posts[0].id) {
					const inReplyToPost = posts.find(_ => _.id === postId)
					if (inReplyToPost) {
						inReplyToPost.replies = inReplyToPost.replies || []
						inReplyToPost.replies.push(post)
					} else {
						console.warn(`Post #${postId} not found while setting replies`)
					}
				}
			}
		}
	}
}