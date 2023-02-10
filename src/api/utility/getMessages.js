export default function getMessages(messages) {
	return {
		// `thread` and `comment` messages are used in `imageboard` package
		// to set the content of comment links.
		thread: {
			default: messages.thread.default
		},
		comment: {
			default: messages.comment.default,
			deleted: messages.comment.deleted,
			external: messages.comment.external
		},

		// `textContent` messages are use in `social-components` package
		// when getting a textual representation of a `post`.
		textContent: {
			block: {
		    picture: messages.textContent.block.picture,
		    video: messages.textContent.block.video,
		    audio: messages.textContent.block.audio,
		    attachment: messages.textContent.block.attachment
			},
			inline: {
				attachment: messages.textContent.inline.attachment,
				link: messages.textContent.inline.link,
				linkTo: messages.textContent.inline.linkTo
			}
		}
	}
}