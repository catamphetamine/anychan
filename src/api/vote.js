import Chan from './Chan'

export default async function vote({
	up,
	http
}) {
	return await Chan({ http }).vote({
		boardId,
		commentId,
		up
	})
}
