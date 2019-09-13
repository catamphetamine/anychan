import parseAttachment from './parseAttachment'

export default function parseAttachments(post, { toAbsoluteUrl }) {
	if (post.files.length > 0) {
		return post.files.map((file) => {
			return parseAttachment(file, { toAbsoluteUrl })
		})
	}
}