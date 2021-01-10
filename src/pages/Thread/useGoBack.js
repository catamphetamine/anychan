import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { goBack, canGoBackInstantly } from 'react-pages'

export default function useGoBack() {
	const dispatch = useDispatch()
	return useCallback((event) => {
		if (canGoBackInstantly()) {
			dispatch(goBack())
			event.preventDefault()
		}
	}, [dispatch])
}