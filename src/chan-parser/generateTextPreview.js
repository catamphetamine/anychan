import getPostText from 'webapp-frontend/src/utility/post/getPostText'
import trimText from 'webapp-frontend/src/utility/post/trimText'

/**
 * Generates a text preview of a comment.
 * Text preview is used for `<meta description/>`.
 * @param {object} comment
 * @return {string} [preview]
 */
export default function generateTextPreview(comment) {
	const textPreview = getPostText(comment, {
		ignoreAttachments: true,
		softLimit: 150
	})
	if (textPreview) {
		comment.textPreview = trimText(textPreview, 150)
	}
}