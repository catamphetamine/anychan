import type { Imageboard } from 'imageboard'
import type { GetChannelsParameters, GetChannelsResult } from '@/types'

export default async function getChannelsFromImageboard(imageboard: Imageboard, {
	all
}: GetChannelsParameters): Promise<GetChannelsResult> {
	const isCompleteListOfBoards = all || !imageboard.supportsFeature('getTopBoards')

	let { boards: channels } = await (isCompleteListOfBoards ? imageboard.getBoards() : imageboard.getTopBoards())

	return {
		channels,
		hasMoreChannels: !isCompleteListOfBoards
	}
}