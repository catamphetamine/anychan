import unescapeContent from 'webapp-frontend/src/utility/unescapeContent'
import filterComment from './filterComment'
import parseComment from './parseComment'
import splitParagraphs from './splitParagraphs'
import trimWhitespace from './trimWhitespace'
import postProcessComment from './postProcessComment'
import ignoreText from './ignoreText'

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
		subject = unescapeContent(subject)
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
	if (rawComment) {
		comment.content = parseComment(rawComment, {
			filters,
			correctGrammar,
			plugins: parseCommentPlugins
		})
		if (comment.content) {
			comment.content = splitParagraphs(comment.content)
			// `content` internals will be mutated.
			comment.content = trimWhitespace(comment.content)
		}
	}
	if (author) {
		comment.author = author
	}
	postProcessComment(comment, {
		boardId,
		threadId,
		messages
	})
	return comment
}
