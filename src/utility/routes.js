import { useCallback } from 'react'
import { goBack, canGoBackInstantly } from 'react-pages'
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
	const _isThreadLocation = useSelector(({ found }) => isThreadLocation(found.resolvedMatch))
	const canGoBack = _isThreadLocation && window._previousRoute && isBoardLocation(window._previousRoute) && canGoBackInstantly()
	const dispatch = useDispatch()
	const onGoBack = useCallback(() => dispatch(goBack()), [dispatch])
	return [canGoBack, onGoBack]
}