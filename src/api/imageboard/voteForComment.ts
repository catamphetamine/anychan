import type { Imageboard } from 'imageboard'
import type { VoteForCommentParameters, VoteForCommentResult } from '../../types/index.js'

export default async function voteForComment(imageboard: Imageboard, {
	channelId,
	...rest
}: VoteForCommentParameters): Promise<VoteForCommentResult> {
	return await imageboard.voteForComment({
		boardId: channelId,
		...rest
	})
}