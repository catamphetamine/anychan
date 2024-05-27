import type { Thread, Comment } from '@/types'
import type { Picture } from 'social-components'

import { cloneDeep } from 'lodash-es'

import preloadImage from '../preloadImage.js'

type CommentSerialized = Omit<Comment, 'replies' | 'inReplyTo' | 'parseComment'>

type ThreadSerialized = Omit<Thread, 'comments'> & {
	comments: Array<CommentSerialized>
}

/**
 * Returns a serialized JSON of a thread
 * @param  {Thread} thread
 * @param  {boolean} [options.exportAttachments] — Whether to export full-sized attachments.
 * @param  {function} options.getCommentById — Returns a comment by an ID. Is used because the `thread` is being dynamically refreshed, which causes some comment object references to change, which would mess things up unless `getCommentById()` is passed.
 * @return {string} Returns a JSON of the thread.
 */
export default async function serializeThread(thread: Thread,
	{
		exportAttachments,
		getCommentById
	}: {
		exportAttachments?: boolean,
		getCommentById?: (id: Comment['id']) => Comment | undefined
	} = {}) {
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
						await embedPictureDataInUrl(attachment.picture)
					} else if (attachment.type === 'video') {
						if (attachment.video.url) {
							// attachment.url = downloadFileAsBase64(attachment.url)
						}
						if (attachment.video.picture) {
							await embedPictureDataInUrl(attachment.video.picture)
						}
					} else if (attachment.type === 'audio') {
						if (attachment.audio.url) {
							// attachment.url = downloadFileAsBase64(attachment.url)
						}
					} else if (attachment.type === 'file') {
						// attachment.url = downloadFileAsBase64(attachment.url)
					}
				}
			}
		}
	}

	const threadSerialized = {
		...thread,
		parseComment: undefined,
		comments: undefined
	} as ThreadSerialized

	// `comment.replies[]` and `comment.inReplyTo[]` objects
	// result in recursive references that can't be serialized to JSON
	// because that would produce a "circular structure".
	// Because of that, they have to be removed during serialization.
	threadSerialized.comments = thread.comments.map((comment) => {
		const commentSerialized = {
			...comment,
			replies: undefined,
			inReplyTo: undefined
		} as CommentSerialized

		// if (comment.replies) {
		// 	commentSerialized.replyIds = comment.replies.map(_ => _.id)
		// }

		// if (comment.inReplyTo) {
		// 	commentSerialized.inReplyToIds = comment.inReplyTo.map(_ => _.id)
		// }

		return commentSerialized
	})

	// Return thread JSON.
	return JSON.stringify(threadSerialized, null, '\t')
}

async function embedPictureDataInUrl(picture: Picture) {
	if (picture.sizes) {
		for (const size of picture.sizes) {
			if (size.url) {
				size.url = await downloadImageAsBase64(size.url)
			}
		}
	}
	if (picture.url) {
		picture.url = await downloadImageAsBase64(picture.url)
	}
}

// Downloads an image and returns its base64-encoded data.
function downloadImageAsBase64(url: string) {
	return preloadImage(url).then((image: HTMLImageElement) => {
		// https://stackoverflow.com/questions/6150289/how-can-i-convert-an-image-into-base64-string-using-javascript
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')
		canvas.height = image.height
		canvas.width = image.width
		ctx.drawImage(image, 0, 0)
		return canvas.toDataURL()
	})
}