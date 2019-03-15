import filterComment from './filterComment'
import parseComment from './parseComment'
import splitParagraphs from './splitParagraphs'
import postProcessComment from './postProcessComment'
import ignoreText from './ignoreText'

import trimWhitespace from 'webapp-frontend/src/utility/post/trimWhitespace'
import generatePostPreview from 'webapp-frontend/src/utility/post/generatePostPreview'

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
		getInReplyToPosts,
		correctGrammar,
		messages,
		getUrl,
		commentUrlRegExp
	}
) {
	const comment = {
		id,
		inReplyTo: rawComment ? getInReplyToPosts(rawComment, { threadId }) : [],
		attachments,
		createdAt: new Date(timestamp * 1000)
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
	if (rawComment) {
		comment.content = parseComment(rawComment, {
			filters,
			correctGrammar,
			commentUrlRegExp,
			plugins: parseCommentPlugins
		})
		// Split content into paragraphs on multiple line breaks,
		// trim whitespace around paragraphs.
		if (comment.content) {
			// Split content into multiple paragraphs on multiple line breaks.
			comment.content = splitParagraphs(comment.content)
			// Trim whitespace around paragraphs.
			comment.content = trimWhitespace(comment.content)
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
	postProcessComment(comment, {
		boardId,
		threadId,
		messages,
		getUrl
	})
	return comment
}