import { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { addFavoriteChannel, removeFavoriteChannel } from '../../redux/favoriteChannels.js'

import useUserData from '../../hooks/useUserData.js'

/**
 * Same concept as `useState()` but for a channel's "favorite" status.
 * @param  {object} options.channel
 * @return {Array} Returns `[isFavorite, setFavorite]`
 */
export default function useFavoriteChannel({
	channel
}) {
	const userData = useUserData()
	const dispatch = useDispatch()

	const favoriteChannels = useSelector(state => state.favoriteChannels.favoriteChannels)

	const isFavoriteChannel = useMemo(() => {
		return userData.isFavoriteChannel(channel)
	}, [
		channel,
		favoriteChannels
	])

	const setFavoriteChannel = useCallback((isFavoriteChannel) => {
		if (isFavoriteChannel) {
			dispatch(addFavoriteChannel({ channel, userData }))
		} else {
			dispatch(removeFavoriteChannel({ channel, userData }))
		}
	}, [
		channel
	])

	return [
		isFavoriteChannel,
		setFavoriteChannel
	]
}