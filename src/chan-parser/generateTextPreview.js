import getPostText from 'webapp-frontend/src/utility/getPostText'
import trimText from 'webapp-frontend/src/utility/trimText'

/**
 * Generates a text preview of a comment.
 * Text preview is used for `<meta description/>`.
 * @param {object} comment
 * @return {string} [preview]
 */
export default function generateTextPreview(comment) {
	const textPreview = getPostText(comment, {
		ignoreAttachments: true
	})
	if (textPreview) {
		comment.textPreview = trimText(textPreview, 150)
	}
}