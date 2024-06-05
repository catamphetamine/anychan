import type { Channel, GetChannelsResult, DataSource } from '@/types'

export interface ChannelsStateProperties {
	channels: Channel[];
	channelsSortedByPopularity?: Channel[];
	channelsByCategory?: { category: string, channels: Channel[] }[];
}

/**
 * Returns the properties for `channels` redux state.
 */
export default function getChannelsStateProperties(
	channels: Channel[],
	{ dataSource }: { dataSource: DataSource }
) {
	const result: ChannelsStateProperties = {
		channels
	}

	if (channels.length > 0) {
		// If each `channel` has `commentsPerHour` property then sort channels by "popularity":
		// from most popular to least popular.
		if (channels[0].commentsPerHour) {
			result.channelsSortedByPopularity = channels.slice().sort((a, b) => b.commentsPerHour - a.commentsPerHour)
		}

		// If each `channel` has `category` property then group channels by category.
		if (channels[0].category) {
			result.channelsByCategory = groupChannelsByCategory(
				channels,
				dataSource.channelCategoriesOrder
			)
		}
	}

	return result
}

/**
 * Groups channels into categories.
 * @param  {object[]} channels — parsed channels.
 * @param  {string[]} [categoriesOrder] — Defines the order of categories.
 * @return {object}
 * @example
 * // Outputs:
 * // `[{
 * //   category: 'Аниме',
 * //   channels: [..., ...]
 * // }, {
 * //   category: 'Политика',
 * //   channels: [..., ...]
 * // }, ...]`.
 * groupChannelsByCategory([..., ...])
 */
function groupChannelsByCategory(
	channels: Channel[],
	categoriesOrder: DataSource['channelCategoriesOrder'] = []
) {
	const categories = []
	for (const category of categoriesOrder) {
		categories.push({
			category,
			channels: []
		})
	}
	return channels.reduce((categories, channel) => {
		let category = categories.filter(_ => _.category === channel.category)[0]
		// If the `category` isn't specified in the ordered list
		// then append it at the end.
		if (!category) {
			category = {
				category: channel.category,
				channels: []
			}
			categories.push(category)
		}
		category.channels.push(channel)
		return categories
	}, categories).filter(_ => _.channels.length > 0)
}
