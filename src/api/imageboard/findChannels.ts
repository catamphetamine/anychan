import type { Imageboard } from 'imageboard'
import type { FindChannelsParameters, FindChannelsResult } from '@/types'

export default async function findChannelsOnImageboard(imageboard: Imageboard, {
	search,
	maxCount
}: FindChannelsParameters): Promise<FindChannelsResult> {
	const { boards } = await imageboard.findBoards({
		search
	})

	return {
		channels: boards,
		hasMoreChannels: false
	}
}