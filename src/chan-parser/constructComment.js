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
		subject = unescapeContent(subject)
		if (correctGrammar) {
			subject = correctGrammar(subject)
		}
		if (filters) {
			for (const filter of filters) {
				if (filter.regexp.test(subject)) {
					subject = undefined
					break
				}
			}
		}
		if (subject) {
			comment.title = subject
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
		threadId,
		filters,
		messages
	})
	return comment
}
