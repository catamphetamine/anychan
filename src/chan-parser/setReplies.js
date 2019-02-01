/**
 * For each post sets `post.replies` to
 * the list of replies to this post.
 * Doesn't set it to an array of post objects
 * to prevent JSON circular structure.
 * Sets just post ids instead.
 * @param {object[]} posts — Parsed posts.
 */
export default function setReplies(posts) {
	for (const post of posts) {
		if (post.inReplyTo) {
			for (const postInfo of post.inReplyTo) {
				const { threadId, postId } = postInfo
				if (threadId === posts[0].id) {
					const inReplyToPost = posts.find(_ => _.id === postId)
					// Comments can be deleted by admins.
					if (inReplyToPost) {
						inReplyToPost.replies = inReplyToPost.replies || []
						// Doesn't set it to an array of post objects
						// to prevent JSON circular structure.
						// Sets just post ids instead.
						inReplyToPost.replies.push(post.id)
					}
				}
			}
		}
	}
}