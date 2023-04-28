import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { showTweet } from '../../redux/twitter.js'

export default function useSocial() {
	const dispatch = useDispatch()
	const isSocialClickable = useCallback((social) => {
		return social.dataSource === 'Twitter'
	}, [])
	const onSocialClick = useCallback((social) => {
		dispatch(showTweet({
			id: social.id,
			url: social.url
		}))
	}, [dispatch])
	return [
		isSocialClickable,
		onSocialClick
	]
}