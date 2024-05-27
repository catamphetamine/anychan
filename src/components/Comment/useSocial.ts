import type { Social } from 'social-components'

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { showTweet } from '../../redux/twitter.js'

export default function useSocial() {
	const dispatch = useDispatch()

	const isSocialClickable = useCallback((social: Social) => {
		return social.provider === 'twitter'
	}, [])

	const onSocialClick = useCallback((social: Social) => {
		dispatch(showTweet({
			id: social.id,
			url: social.url
		}))
	}, [dispatch])

	return {
		isSocialClickable,
		onSocialClick
	}
}