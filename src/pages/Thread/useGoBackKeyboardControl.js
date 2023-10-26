import { useEffect, useCallback } from 'react'

import { isKeyCombination } from 'web-browser-input'

import useGoBackFromThreadToChannel from '../../components/useGoBackFromThreadToChannel.js'

export default function useGoBackKeyboardControl({ channelId }) {
	const goBack = useGoBackFromThreadToChannel({ channelId })

	const onKeyDown = useCallback((event) => {
		if (isKeyCombination(event, ['Backspace'])) {
			const elementType = event.target.tagName.toLowerCase()
			if (elementType !== 'input' && elementType !== 'textarea') {
				if (!window._isNavigationInProgress) {
					event.preventDefault()
					return goBack()
				}
			}
		}
	}, [])

	useEffect(() => {
		document.addEventListener('keydown', onKeyDown)
		return () => {
			document.removeEventListener('keydown', onKeyDown)
		}
	}, [])
}