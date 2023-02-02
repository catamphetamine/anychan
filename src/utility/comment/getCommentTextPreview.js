import getPostText from 'social-components/utility/post/getPostText.js'
import trimText from 'social-components/utility/post/trimText.js'

/**
 * Generates a text preview of a comment.
 * Text preview could be used for `<meta description/>`.
 * It could also be used when generating thread preview in a sidebar.
 * @param {object} comment
 * @param {object} [options.messages] — An object containing `contentType` messages.
 * @return {string} [preview]
 */
export default function getCommentTextPreview(comment, { messages } = {}) {
	const textPreview = getPostText(comment, {
		ignoreAttachments: true,
		softLimit: 150,
		messages: {
			contentType: {
				...messages.contentType,
				linkTo: '{domain}' // messages.post.textContent.linkTo
			}
		},
		formatUntitledLink: (link) => {
			if (link.service === 'youtube') {
				// return messages.contentType.video
			}
		},
		spaceOutParagraphs: false
	})
	if (textPreview) {
		return trimText(textPreview, 150)
	}
}
