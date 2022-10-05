import { cloneDeep } from 'lodash-es'

/**
 * Returns a serialized JSON of a thread
 * @param  {Thread} thread
 * @param  {boolean} [options.exportAttachments] — Whether to export full-sized attachments.
 * @param  {function} options.getCommentById — Returns a comment by an ID. Is used because the `thread` is being dynamically refreshed, which causes some comment object references to change, which would mess things up unless `getCommentById()` is passed.
 * @return {string} Returns a JSON of the thread.
 */
export default async function serializeThread(thread, { exportAttachments, getCommentById } = {}) {
	// Parse all comments' content.
	for (const comment of thread.comments) {
		// `.hasContentBeenParsed` flag is set by the `parseContent()`
		// function that the `imageboard` library has created.
		// Don't set this flag manually. Only read it.
		if (!comment.hasContentBeenParsed) {
			comment.parseContent({ getCommentById })
		}
	}
	// Don't change the original `thread` object or any of its sub-objects.
	// Create a "deep" copy that will be changed.
	thread = cloneDeep(thread)
	for (const comment of thread.comments) {
		if (exportAttachments) {
			if (comment.attachments) {
				for (const attachment of comment.attachments) {
					// https://gitlab.com/catamphetamine/social-components/-/blob/master/docs/Post/PostAttachments.md
					if (attachment.type === 'picture') {
						embedPictureDataInUrl(attachment)
					} else if (attachment.type === 'video') {
						if (attachment.url) {
							// attachment.url = downloadFileAsBase64(attachment.url)
						}
						if (attachment.picture) {
							embedPictureDataInUrl(attachment.picture)
						}
					} else if (attachment.type === 'audio') {
						if (attachment.url) {
							// attachment.url = downloadFileAsBase64(attachment.url)
						}
					} else if (attachment.type === 'file') {
						// attachment.url = downloadFileAsBase64(attachment.url)
					}
				}
			}
		}
	}
	// `comment.replies[]` and `comment.inReplyTo[]` objects
	// result in recursive references that can't be serialized to JSON
	// because that would produce a "circular structure".
	// So, convert `comment.replies[]` and `comment.inReplyTo[]`
	// from comment objects to comment IDs.
	thread.comments = thread.comments.map((comment) => {
		if (comment.replies) {
			// Don't change the original `comment`'s `.replies[]`.
			// Create a copy of a `comment` an change its `.replies[]`.
			comment.replies = comment.replies.map(_ => _.id)
		}
		if (comment.inReplyTo) {
			// Don't change the original `comment`'s `.inReplyTo[]`.
			// Create a copy of a `comment` an change its `.inReplyTo[]`.
			comment.inReplyTo = comment.inReplyTo.map(_ => _.id)
		}
		return comment
	})
	// Return thread JSON.
	return JSON.stringify(thread, null, '\t')
}

function embedPictureDataInUrl(picture) {
	if (picture.sizes) {
		for (const size of picture.sizes) {
			if (size.url) {
				size.url = downloadImageAsBase64(size.url)
			}
		}
	}
	if (picture.url) {
		picture.url = downloadImageAsBase64(picture.url)
	}
}

// Downloads an image and returns its base64-encoded data.
function downloadImageAsBase64(url) {
	return new Promise((resolve, reject) => {
		const image = new Image()
		image.onload = () => {
			// https://stackoverflow.com/questions/6150289/how-can-i-convert-an-image-into-base64-string-using-javascript
			const canvas = document.createElement('canvas')
			const ctx = canvas.getContext('2d')
			canvas.height = image.height
			canvas.width = image.width
			ctx.drawImage(image, 0, 0)
			resolve(canvas.toDataURL())
		}
		// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Image_loading_errors
		image.onerror = (event) => {
			// // Log the error to `sentry.io`.
			// setTimeout(() => {
			// 	console.log(event)
			// 	throw new Error(event)
			// }, 0)
			if (event.path && event.path[0]) {
				console.error(`Image not found: ${event.path[0].src}`)
			}
			const error = new Error('IMAGE_NOT_FOUND')
			error.url = url
			error.event = event
			reject(error)
		}
		image.src = url
	})
}