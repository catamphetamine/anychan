import { getPostText } from 'webapp-frontend/src/utility/post'
import trimText from 'webapp-frontend/src/utility/trimText'

/**
 * Adds "in-reply-to" quotes.
 * Has some CPU usage.
 */
export default function setInReplyToQuotes(content, posts, threadId, contentParent) {
	if (Array.isArray(content)) {
		for (const part of content) {
			setInReplyToQuotes(part, posts, threadId, content)
		}
		return
	}
	if (typeof content === 'string') {
		return
	}
	if (typeof content === 'object' && content.type === 'post-link') {
		let postPeek
		if (content.threadId === threadId) {
			content.post = posts.find(_ => _.id === content.postId)
			if (content.post) {
				const text = getPostText(content.post)
				if (text) {
					postPeek = trimText(text, 150)
					const index = contentParent.indexOf(content)
					const possibleQuote = contentParent[index + 2]
					if (possibleQuote && possibleQuote.type === 'inline-quote') {
						// Already quoted.
					} else {
						// Only inject quotes when messages links are at the end of the line.
						if (contentParent[index + 1] === '\n') {
							contentParent.splice(index + 1, 0, '\n')
							contentParent.splice(index + 2, 0, { type: 'inline-quote', automaticInReplyToQuote: true, content: postPeek })
						}
					}
				}
			}
		}
		content.content = 'Сообщение'
	}
}