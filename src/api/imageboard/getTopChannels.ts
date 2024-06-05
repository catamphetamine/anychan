import type { Imageboard } from 'imageboard'
import type { GetTopChannelsParameters, GetTopChannelsResult } from '@/types'

export default async function getTopChannelsFromImageboard(imageboard: Imageboard, {
	// any parameters
}: GetTopChannelsParameters): Promise<GetTopChannelsResult> {
	const { boards: channels } = await imageboard.getTopBoards()

	return {
		channels
	}
}