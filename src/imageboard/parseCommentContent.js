import censorWords from 'webapp-frontend/src/utility/post/censorWords'

import parseAndFormatComment from './parseAndFormatComment'

export default function parseCommentContent(comment, {
	censoredWords,
	filterText,
	commentUrlParser,
	parseCommentContentPlugins,
	// These're used by `postProcessCommentContent`
	boardId,
	threadId,
	messages,
	commentUrl,
	emojiUrl,
	toAbsoluteUrl
}) {
	comment.content = parseAndFormatComment(comment.content, {
		censoredWords,
		filterText,
		commentUrlParser,
		parseCommentContentPlugins,
		// These're used by `postProcessCommentContent`
		comment,
		boardId,
		threadId,
		messages,
		commentUrl,
		emojiUrl,
		toAbsoluteUrl
	})
	// Censor/filter comment title.
	if (comment.title) {
		if (filterText) {
			comment.title = filterText(comment.title)
		}
		if (censoredWords) {
			const titleCensored = censorWords(comment.title, censoredWords)
			if (titleCensored !== comment.title) {
				comment.titleCensored = titleCensored
			}
		}
	}
}