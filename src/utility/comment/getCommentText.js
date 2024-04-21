import { getPostText } from 'social-components/post'

/**
 * Returns comment `content` converted into text.
 * Returns `undefined` if there's no text.
 * @param  {Comment} comment
 * @param  {object} options.messages
 * @return {string} [text]
 */
export default function getCommentText(comment, {
	messages,
	...parameters
}) {
	return getPostText(comment, {
		messages: {
			textContent: {
				block: {
					...messages.textContent.block
				},
				inline: {
					...messages.textContent.inline,
					// `"(link to {domain})"` → `"{domain}"`.
					linkTo: '{domain}'
				}
			}
		},

		// Formats an "untitled" link: a link for which a custom title was not set.
		// By default, when this function is not present, links are formatted using
		// `messages.textContent.inline.linkTo`, if it's present, or are output as the URL itself.
		// If this function doesn't return anything then it's ignored.
		getLinkTitle: (link) => {
			// // Replace YouTube video links with autogenerated content with a word "Video".
			// if (link.service === 'youtube') {
			// 	return messages.textContent.block.video
			// }
		},

		// `skipAttachments: true` is the default setting.
		// It skips attachments (embedded and non-embedded).
		// skipAttachments: true,

		// Defines how text for adjacent content blocks should be concatenated.
		// By default, it concatenates it with `\n\n`.
		// If `spaceOutParagraphs: false` flag is passed, it concatenates the text
		// for adjacent content blocks with `\n`.
		spaceOutParagraphs: false,

		...parameters
	})
}