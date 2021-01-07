import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { showTweet } from '../../redux/twitter'

export default function useSocial(mode) {
	const dispatch = useDispatch()
	const isSocialClickable = useCallback((social) => {
		return social.provider === 'Twitter'
	}, [])
	const onSocialClick = useCallback((social) => {
		// Currently, thread cards are wrapped in `<Clickable/>` on channel pages.
		// This results in navigating to a thread when clicking the thread card
		// on a channel page. The same click also would trigger showing a tweet
		// has it not been disabled here explicitly.
		// It's not obvious how would a click on a `<Clickable/>` get cancelled,
		// given that it uses some not-so-trivial stuff (`onTouchStart`, `onTouchEnd`, etc).
		if (mode === 'thread') {
			dispatch(showTweet({
				id: social.id,
				url: social.url
			}))
		}
	}, [dispatch])
	return [
		isSocialClickable,
		onSocialClick
	]
}