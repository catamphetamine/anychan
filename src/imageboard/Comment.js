import censorWords from 'webapp-frontend/src/utility/post/censorWords'

export default function Comment({
	boardId,
	threadId,
	id,
	title,
	content,
	authorName,
	authorRole,
	authorTripCode,
	authorBan,
	authorBanReason,
	attachments,
	createdAt,
	...rest
}, {
	censoredWords,
	filterText,
	parseContent,
	parseCommentContent
}) {
	const comment = {
		id,
		...rest
	}
	// The date on which the comment was posted.
	// All chans except `lynxchan` have this.
	// `lynxchan` doesn't have it which is a bug
	// but seems like they don't want to fix it.
	if (createdAt) {
		comment.createdAt = createdAt
	}
	if (attachments) {
		comment.attachments = attachments
	}
	if (title) {
		if (filterText) {
			title = filterText(title)
		}
		if (title) {
			comment.title = title
			if (censoredWords) {
				const titleCensored = censorWords(title, censoredWords)
				if (titleCensored !== title) {
					comment.titleCensored = titleCensored
				}
			}
		}
	}
	if (content) {
		comment.content = content
		if (parseContent !== false) {
			parseCommentContent(comment, { boardId, threadId })
		}
	}
	if (authorName) {
		comment.authorName = authorName
	}
	if (authorRole) {
		comment.authorRole = authorRole
	}
	if (authorTripCode) {
		comment.authorTripCode = authorTripCode
	}
	if (authorBan) {
		comment.authorBan = true
	}
	if (authorBanReason) {
		comment.authorBanReason = authorBanReason
	}
	return comment
}