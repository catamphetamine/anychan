import createByIdIndex from './utility/createByIdIndex'

/**
 * For each post sets `post.replies` to
 * the list of replies to this post.
 * Doesn't set it to an array of post objects
 * to prevent JSON circular structure.
 * Sets just post ids instead.
 * @param {object[]} posts — Parsed posts.
 */
export default function setReplies(posts) {
	// Create "posts by id" index for optimized performance.
	const getPostById = createByIdIndex(posts)
	for (const post of posts) {
		if (post.inReplyTo) {
			for (const postId of post.inReplyTo) {
				// Using `postsById` index is much faster.
				// const inReplyToPost = posts.find(_ => _.id === postId)
				const inReplyToPost = getPostById(postId)
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