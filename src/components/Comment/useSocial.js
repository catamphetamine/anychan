import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { showTweet } from '../../redux/twitter'

export default function useSocial() {
	const dispatch = useDispatch()
	const isSocialClickable = useCallback((social) => {
		return social.provider === 'Twitter'
	}, [])
	const onSocialClick = useCallback((social) => {
		dispatch(showTweet(social.id))
	}, [dispatch])
	return [
		isSocialClickable,
		onSocialClick
	]
}