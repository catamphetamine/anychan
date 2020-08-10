import { useCallback } from 'react'
import { goBack, canGoBackInstantly, goto } from 'react-pages'
import { useDispatch, useSelector } from 'react-redux'

export function isBoardLocation(route) {
	return route.params.board !== undefined && route.params.thread === undefined
}

export function isThreadLocation(route) {
	return route.params.thread !== undefined
}

export function isContentSectionsContent(route) {
	return isBoardLocation(route) ||
		isThreadLocation(route) ||
		route.location.pathname === '/settings'
}

export function isBoardsLocation(route) {
	return route.location.pathname === '/boards'
}

export function useCanGoBackFromThreadToBoard() {
	const currentRoute = useSelector(({ found }) => found.resolvedMatch)
	const _isThreadLocation = useSelector(({ found }) => isThreadLocation(found.resolvedMatch))
	const dispatch = useDispatch()
	const onGoBackInstantly = useCallback(() => dispatch(goBack()), [dispatch])
	const onGoBackByNavigation = useCallback(() => {
		const board = currentRoute.params.board
		dispatch(goto(`/${board}`, { instantBack: true }))
	}, [
		dispatch,
		currentRoute
	])
	if (_isThreadLocation) {
		const previousRoute = window._previousRoute
		const _canGoBackInstantly = _isThreadLocation && previousRoute && isBoardLocation(previousRoute) && canGoBackInstantly()
		if (_canGoBackInstantly) {
			return [true, onGoBackInstantly]
		}
		return [true, onGoBackByNavigation]
	}
	return [false]
}