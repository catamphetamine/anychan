import YouTube from 'webapp-frontend/src/utility/video-youtube'

// This should be the last one in the chain of comment transformations
// because it splits text into paragraphs.
export default async function expandStandaloneAttachmentLinks(post) {
	if (!post.content) {
		return
	}
	let j = 0
	while (j < post.content.length) {
		const paragraph = post.content[j]
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
					if (i - 1 > 0) {
						paragraphs.push(paragraph.slice(0, i - 1))
					}
					paragraphs.push(attachment)
					if (paragraph.length > i + 1) {
						paragraphs.push(paragraph.slice(i + 1 + 1))
					}

					post.content.splice(j, 1, ...paragraphs)
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