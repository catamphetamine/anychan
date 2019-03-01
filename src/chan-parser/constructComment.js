import unescapeContent from 'webapp-frontend/src/utility/unescapeContent'
import filterComment from './filterComment'
import parseComment from './parseComment'
import splitParagraphs from './splitParagraphs'
import trimWhitespace from './trimWhitespace'
import postProcessComment from './postProcessComment'

export default function constructComment(
	boardId,
	threadId,
	id,
	rawComment,
	author,
	subject,
	attachments,
	timestamp,
	{
		filters,
		parseCommentPlugins,
		getInReplyToPosts,
		correctGrammar,
		messages
	}
) {
	const comment = {
		id,
		inReplyTo: rawComment ? getInReplyToPosts(rawComment, { threadId }) : [],
		attachments,
		createdAt: new Date(timestamp * 1000)
	}
	if (subject) {
		comment.title = unescapeContent(subject)
		if (correctGrammar) {
			comment.title = correctGrammar(comment.title)
		}
	}
	if (rawComment) {
		comment.content = splitParagraphs(
			parseComment(rawComment, {
				correctGrammar,
				plugins: parseCommentPlugins
			})
		)
		// `content` internals will be mutated.
		comment.content = trimWhitespace(comment.content)
		if (filters) {
			const result = filterComment(rawComment, filters)
			if (result) {
				comment.hidden = true
				if (result.name !== '*') {
					comment.hiddenRule = result.name
				}
			}
		}
	}
	if (author) {
		comment.author = author
	}
	postProcessComment(comment, {
		threadId,
		filters,
		messages
	})
	return comment
}
