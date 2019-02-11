import YouTube from 'webapp-frontend/src/utility/video-youtube'

/**
 * Expands attachment links into standalone attachments.
 * @param  {object} post
 */
export default async function expandStandaloneAttachmentLinks(post) {
	if (!post.content) {
		return
	}
	let j = 0
	while (j < post.content.length) {
		const paragraph = post.content[j]
		// Only processes text paragraphs.
		if (!Array.isArray(paragraph)) {
			j++
			continue
		}
		let i = 0
		while (i < paragraph.length) {
			const block = paragraph[i]
			if (typeof block === 'object' && block.type === 'link' && block.attachment) {
				const prevBlock = paragraph[i - 1]
				const nextBlock = paragraph[i + 1]
				if ((!prevBlock || prevBlock === '\n') && (!nextBlock || nextBlock === '\n')) {

					const attachmentId = getNextAttachmentId(post.attachments)
					const attachment = {
						type: 'attachment',
						attachmentId,
						fit: 'height'
					}

					post.attachments.push({
						id: attachmentId,
						...block.attachment
					})

					const paragraphs = []
					// Add previous paragraph.
					let prevParagraph
					if (i - 1 > 0) {
						// There may be more than one '\n' separating stuff.
						prevParagraph = trimNewLines(paragraph.slice(0, i - 1))
						if (prevParagraph.length > 0) {
							paragraphs.push(prevParagraph)
						}
					}
					// Add current paragraph.
					paragraphs.push(attachment)
					// Add next paragraph.
					if (paragraph.length > i + 1) {
						// There may be more than one '\n' separating stuff.
						const nextParagraph = trimNewLines(paragraph.slice(i + 1 + 1))
						if (nextParagraph.length > 0) {
							paragraphs.push(nextParagraph)
						}
					}

					post.content.splice(j, 1, ...paragraphs)

					if (prevParagraph) {
						j++
					}

					break
				}
			}
			i++
		}
		j++
	}
}

function getNextAttachmentId(attachments) {
	let maxId = 0
	for (const attachment of attachments) {
		if (attachment.id) {
			maxId = Math.max(maxId, attachment.id)
		}
	}
	return maxId + 1
}

function trimNewLines(array) {
	while (array[0] === '\n') {
		array = array.slice(1)
	}
	while (array[array.length - 1] === '\n') {
		array = array.slice(0, array.length - 1)
	}
	return array
}