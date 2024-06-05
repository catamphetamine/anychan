import type { Imageboard } from 'imageboard'
import type { GetChannelsParameters, GetChannelsResult } from '@/types'

export default async function getChannelsFromImageboard(imageboard: Imageboard, {
	// any parameters.
}: GetChannelsParameters): Promise<GetChannelsResult> {
	const { boards: channels } = await imageboard.getBoards()

	return {
		channels,
		hasMoreChannels: false
	}
}