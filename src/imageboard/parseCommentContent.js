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
}