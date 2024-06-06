import type { Imageboard } from 'imageboard'
import type { RateCommentParameters, RateCommentResult } from '../../types/index.js'

export default async function rateComment(imageboard: Imageboard, {
	channelId,
	...rest
}: RateCommentParameters): Promise<RateCommentResult> {
	return await imageboard.rateComment({
		boardId: channelId,
		...rest
	})
}