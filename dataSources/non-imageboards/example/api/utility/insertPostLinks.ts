import type { CommentId, ThreadId, ChannelId, ContentBlock } from "@/types"
import type { InlineContent, InlineElementPostLink } from 'social-components'

import interleaveArrayElements from './interleaveArrayElements.js'

// Replaces `">>commentId"` substrings with `type: "post-link"` elements.
// https://gitlab.com/catamphetamine/social-components/-/blob/master/docs/Content.md#post-link
export default function insertPostLinks({
	content: contentBlocks,
	inReplyToIds,
	threadId,
	channelId,
	getPostLinkContent
}: {
	content: ContentBlock[],
	inReplyToIds: CommentId[],
	threadId: ThreadId,
	channelId: ChannelId,
	getPostLinkContent: (params: { commentId: CommentId }) => InlineContent
}) {
	for (const contentBlock of contentBlocks) {
		if (Array.isArray(contentBlock)) {
			let i = 0
			while (i < contentBlocks.length) {
				for (const commentId of inReplyToIds) {
					const contentBlock = contentBlocks[i]
					if (typeof contentBlock === 'string') {
						const replacement = insertPostLinks_(contentBlock, commentId, threadId, channelId, getPostLinkContent)
						if (replacement) {
							contentBlocks[i] = replacement
						}
					} else if (Array.isArray(contentBlock)) {
						let j = 0
						while (j < contentBlock.length) {
							const inlineElement = contentBlock[j]
							if (typeof inlineElement === 'string') {
								const replacement = insertPostLinks_(inlineElement, commentId, threadId, channelId, getPostLinkContent)
								if (replacement) {
									contentBlock.splice(j, 1, ...replacement)
								}
							}
							j++
						}
					}
				}
				i++
			}
		}
	}
}

// Replaces `">>commentId"` parts of text with `type: "post-link"` elements.
// If any were found, returns a replacement.
function insertPostLinks_(
	content: string,
	inReplyToId: CommentId,
	threadId: ThreadId,
	channelId: ChannelId,
	getContent: (params: { commentId: CommentId }) => InlineContent
): (string | InlineElementPostLink)[] {
	const commentId = inReplyToId
	if (content.includes('>>' + String(commentId))) {
		const contentBlockParts = content.split('>>' + commentId)
		const postLink: InlineElementPostLink = {
			type: 'post-link',
			content: getContent({ commentId }),
			meta: {
				channelId,
				threadId,
				commentId: inReplyToId
			}
		}
		return interleaveArrayElements(contentBlockParts, postLink)
			// There could be `""` parts if the comment reference was in the beginning or in the end.
			.filter((_: any) => Boolean(_))
	}
}