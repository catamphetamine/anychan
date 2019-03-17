import visitPostParts from 'webapp-frontend/src/utility/post/visitPostParts'

export default function setInReplyToPosts(post) {
	visitPostParts(
		'post-link',
		link => {
			if (link.postId) {
				post.inReplyTo.push(link.postId)
			}
		},
		post.content
	)
}