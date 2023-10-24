/**
 * Returns a list of channels.
 * @param  {object} options.http — `react-pages` `http` utility.
 * @param  {boolean} options.all — If set to `true`, then the "full" list of channels is returned. Some imageboards support creating "user boards", and, for example, `8ch.net` had about 20,000 of such "user boards".
 * @return {object} Returns `{ [channels], [channelsByPopularity], [channelsByCategory], [allChannels: { channels, [channelsByPopularity], [channelsByCategory] }], [hasMoreChannels] }`. If a data source doesn't differentiate between a "short" list of channels and a "long" list of channels then both `channels` and `allChannels` are returned and are the same. Otherwise, either `channels` and `hasMoreChannels: true` or `allChannels: { channels }` are returned. Along with `channels` (or `allChannels.channels`), `channelsByPopularity` and `channelsByCategory` could also be returned (if the data source provides those).
 */
export default async function getChannels({
	all,
	http,
	userSettings,
	dataSource,
	messages
}) {
	const {
		channels,
		hasMoreChannels
	} = await dataSource.api.getChannels({
		all,
		http,
		userSettings,
		messages
	})

	// Mark hidden channels.
	if (!all) {
		markHiddenChannels(channels, { dataSource })
	}

	const result = getChannelsResult(channels, { dataSource })
	if (!hasMoreChannels) {
		return {
			...result,
			allChannels: result
		}
	}

	if (all) {
		return {
			allChannels: result
		}
	}

	return {
		...result,
		hasMoreChannels: true
	}
}

export function getChannelsExample(dataSourceId) {
	switch (dataSourceId) {
		case '2ch':
			return [{
				id: 'a',
				title: 'Аниме'
			}]
	}
}

/**
 * Returns the list(s) of channels.
 * @param  {object} options.http — `react-pages` `http` utility.
 * @param  {boolean} options.all — If set to `true`, then the "full" list of channels is returned. Some imageboards support creating "user boards", and, for example, `8ch.net` had about 20,000 of such "user boards".
 * @return {object} `{ channels, [channelsByPopularity], [channelsByCategory] }`. Along with `channels` (or `allChannels.channels`), `channelsByPopularity` and `channelsByCategory` could also be returned (if the data source provides those).
 */
function getChannelsResult(channels, { dataSource }) {
	const result = {
		channels
	}
	if (channels[0].commentsPerHour) {
		result.channelsByPopularity = channels.slice().sort((a, b) => b.commentsPerHour - a.commentsPerHour)
	}
	if (channels[0].category) {
		result.channelsByCategory = groupChannelsByCategory(
			channels.filter(channel => !channel.isHidden),
			dataSource.contentCategories
		)
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
function groupChannelsByCategory(channels, categoriesOrder = []) {
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

function markHiddenChannels(channels, { dataSource }) {
	const contentCategoryUnspecified = dataSource.contentCategoryUnspecified
	if (contentCategoryUnspecified) {
		for (const channel of channels) {
			if (channel.category === contentCategoryUnspecified) {
				// Special case for `2ch.hk`'s `/int/` board which happens to be
				// in the ignored category but shouldn't be hidden.
				if (dataSource.id === '2ch' && channel.id === 'int') {
					continue
				}
				channel.isHidden = true
			}
		}
	}
}