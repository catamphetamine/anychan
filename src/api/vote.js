import Chan from './Chan'

export default async function vote({
	http,
	up,
	boardId,
	threadId,
	commentId
}) {
	return await Chan({ http }).vote({
		boardId,
		threadId,
		commentId,
		up
	})
}
