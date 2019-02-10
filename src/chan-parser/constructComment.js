import unescapeContent from './unescapeContent'
import filterComment from './filterComment'
import parseCommentText from './parseCommentText'
import postProcessComment from './postProcessComment'

export default async function constructComment(
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
		parseCommentTextPlugins,
		getInReplyToPosts,
		correctGrammar,
		youTubeApiKey,
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
		comment.subject = unescapeContent(subject)
		if (correctGrammar) {
			comment.subject = correctGrammar(comment.subject)
		}
	}
	if (rawComment) {
		comment.content = parseCommentText(rawComment, {
			correctGrammar,
			parseCommentTextPlugins
		})
		if (filters) {
			const reason = filterComment(rawComment, filters)
			if (reason) {
				comment.hidden = true
				comment.hiddenReason = reason
			}
		}
	}
	if (author) {
		comment.author = author
	}
	await postProcessComment(comment, {
		threadId,
		filters,
		messages,
		youTubeApiKey
	})
	return comment
}
