import Chan from './Chan'
import setThreadInfo from './utility/setThreadInfo'
import configuration from '../configuration'

export default async function getThreads({
	boardId,
	censoredWords,
	messages,
	http
}) {
	const threads = await Chan({ censoredWords, messages, http }).getThreads({
		boardId,
		// The parser parses thread comments up to 4x faster without parsing their content.
		// Example: when parsing comments content — 650 ms, when not parsing comments content — 200 ms.
		parseContent: false,
		commentLengthLimit: configuration.commentLengthLimitForThreadPreview || configuration.commentLengthLimit
	})
	for (const thread of threads) {
		setThreadInfo(thread, 'thread')
	}
	return {
		boardId,
		threads
	}
}