import postProcessComments from './postProcessComments'

export default function constructThread(threadInfo, comments, {
	messages,
	commentLengthLimit
}) {
	const threadId = comments[0].id
	postProcessComments(comments, {
		threadId,
		messages,
		commentLengthLimit
	})
	return {
		...threadInfo,
		id: threadId,
		comments
	}
}