import parseComment from './parseComment'
import splitParagraphs from './splitParagraphs'
import postProcessCommentContent from './postProcessCommentContent'
import trimWhitespace from 'webapp-frontend/src/utility/post/trimWhitespace'

export default function parseAndFormatComment(rawComment, {
	censoredWords,
	correctGrammar,
	commentUrlParser,
	plugins,
	// These're used by `postProcessCommentContent`
	comment,
	boardId,
	threadId,
	messages,
	commentUrl,
	emojiUrl,
	toAbsoluteUrl
}) {
	let content = parseComment(rawComment, {
		censoredWords,
		correctGrammar,
		commentUrlParser,
		emojiUrl,
		toAbsoluteUrl,
		plugins
	})
	// Split content into paragraphs on multiple line breaks,
	// trim whitespace around paragraphs.
	if (content) {
		// Split content into multiple paragraphs on multiple line breaks.
		content = splitParagraphs(content)
		// Trim whitespace around paragraphs.
		content = trimWhitespace(content)
	}
	if (content) {
		postProcessCommentContent(content, {
			// `comment` is only used by `expandStandaloneAttachmentLinks()`.
			comment,
			boardId,
			threadId,
			messages,
			commentUrl
		})
	}
	return content
}