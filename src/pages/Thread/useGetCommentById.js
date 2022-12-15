import { useRef, useMemo, useCallback } from 'react'

import createByIdIndex from '../../utility/createByIdIndex.js'

export default function useGetCommentById({
	thread
}) {
	// `getCommentById()` function parameter is only used when
	// calling `comment.onContentChange()` function.
	// Therefore, it's not a "rendering property" in a sense that
	// it doesn't have any influence on how comments are rendered.
	// Therefore, it can be removed from `itemComponentProps`
	// memo dependencies list because the item component isn't
	// required to be rerendered when `getCommentById()` function changes.
	// Therefore, it can be passed as a `ref`: this way, it will
	// always be up to date while also not being a dependency.
	const getCommentByIdRef = useRef()

	getCommentByIdRef.current = useMemo(() => {
		return createByIdIndex(
			thread.latestComments
				? thread.latestComments.concat(thread.comments)
				: thread.comments
		)
	}, [thread.comments])

	// `getCommentById` reference shouldn't change, otherwise
	// `onItemInitialRender` property of `<VirtualScroller/>` would change too,
	// and `<VirtualScroller/>` doesn't support handling changes of such properties.
	const getCommentById = useCallback((id) => {
		return getCommentByIdRef.current(id)
	}, [])

	return getCommentById
}