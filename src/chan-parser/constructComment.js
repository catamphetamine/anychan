import filterComment from './filterComment'
import parseAndFormatComment from './parseAndFormatComment'
import ignoreText from './ignoreText'

const NO_OP = () => {}

export default function constructComment(
	boardId,
	threadId,
	id,
	rawComment,
	authorName,
	authorRole,
	authorWasBanned,
	subject,
	attachments,
	timestamp,
	{
		filters,
		parseCommentPlugins,
		correctGrammar,
		messages,
		getUrl,
		commentUrlRegExp,
		parseContent,
		threadComments
	}
) {
	const comment = {
		id,
		createdAt: new Date(timestamp * 1000)
	}
	if (attachments) {
		comment.attachments = attachments
	}
	if (subject) {
		if (correctGrammar) {
			subject = correctGrammar(subject)
		}
		if (subject) {
			comment.title = subject
			if (filters) {
				const subjectCensored = ignoreText(subject, filters)
				if (subjectCensored !== subject) {
					comment.titleCensored = subjectCensored
				}
			}
		}
	}
	if (parseContent === false) {
		// `.parseContent()` should always be present in case of `parseContent: false`,
		// even when a comment has no content. This is just for convenience.
		comment.parseContent = NO_OP
	}
	if (rawComment) {
		function parseCommentContent() {
			return parseAndFormatComment(rawComment, {
				filters,
				correctGrammar,
				commentUrlRegExp,
				plugins: parseCommentPlugins,
				// These're used by `postProcessCommentContent`
				comment,
				boardId,
				threadId,
				messages,
				getUrl
			})
		}
		// The "opening" post of a thread is always parsed.
		// (because it makes sense)
		if (parseContent === false && id !== threadId) {
			comment.rawContent = rawComment
			comment.parseContent = () => {
				comment.rawContent = undefined
				// `.parseContent()` method is set to a "no op" function
				// instead of `undefined` for convenience.
				// (because it can be called multiple times in case of a
				//  `virtual-scroller` with `initialState` being passed)
				comment.parseContent = () => {}
				comment.content = parseCommentContent()
				if (comment.onContentChange) {
					comment.onContentChange()
				}
			}
		} else {
			comment.content = parseCommentContent()
		}
	}
	if (authorName) {
		comment.authorName = authorName
	}
	if (authorRole) {
		comment.authorRole = authorRole
	}
	if (authorWasBanned) {
		comment.authorWasBanned = true
	}
	return comment
}