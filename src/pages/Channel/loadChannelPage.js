import { getThreads } from '../../redux/data'
import { resetState } from '../../redux/channel'
import { addFavoriteChannel } from '../../redux/favoriteChannels'

import onThreadsFetched from '../../utility/onThreadsFetched'

export default async function loadChannelPage({
	getState,
	dispatch,
	params: {
		channelId
	}
}) {
	const {
		censoredWords,
		grammarCorrection,
		locale,
		autoSuggestFavoriteChannels
	} = getState().settings.settings
	const { threads } = await dispatch(getThreads(channelId, {
		censoredWords,
		grammarCorrection,
		locale
	}))
	onThreadsFetched(channelId, threads, { dispatch })
	if (autoSuggestFavoriteChannels !== false) {
		const { channel } = getState().data
		dispatch(addFavoriteChannel({
			id: channel.id,
			title: channel.title
		}))
	}
	// Reset a potentially previously set "instant back" state.
	dispatch(resetState())
}