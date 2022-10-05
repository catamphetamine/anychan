export default function setEmbeddedAttachmentsProps(post) {
	// Doesn't do anything.
	// Used to set attachments' `align` and `margin` properties.
}

// export default function setEmbeddedAttachmentsProps(post) {
// 	if (post.content) {
// 		_setEmbeddedAttachmentsProps(post.content)
// 		if (post.contentPreview) {
// 			_setEmbeddedAttachmentsProps(post.contentPreview)
// 		}
// 	}
// }

// function _setEmbeddedAttachmentsProps(content) {
// 	if (content) {
// 		for (const block of content) {
// 			if (block.type === 'attachment') {
// 				block.align = 'left'
// 				block.margin = 'small'
// 			}
// 		}
// 	}
// }