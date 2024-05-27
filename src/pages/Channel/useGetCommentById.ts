import type { Thread, CommentId, GetCommentById } from '@/types'

import { useRef, useMemo, useCallback } from 'react'

import createByIdIndex from '../../utility/createByIdIndex.js'

// This hook returns a `getCommentById()` function for a given channel page.
// The rationale is that it's used when marking or unmarking a thread as "own".
export default function useGetCommentById({ threads }: { threads: Thread[] }) {
	// `getCommentById()` is not a "rendering property" in a sense that
	// its value doesn't have any influence on how comments are rendered.
	// Therefore, it can be removed from `virtual-scroller` item properties object
	// memo dependencies list because there's no need to re-render the item when
	// `getCommentById()` "reference" changes.
	// Therefore, `getCommentById()` can be passed being wrapped in a `ref` object:
	// with this trick, the `ref` object reference will always be the same but the
	// `getCommentById()` function inside it will always be up-to-date.
	const getCommentByIdRef = useRef<GetCommentById>()

	getCommentByIdRef.current = useMemo(() => {
		const getThreadById = createByIdIndex(threads)
		return (commentId: CommentId) => {
			return getThreadById(commentId).comments[0]
		}
	}, [threads])

	// The returned `getCommentById()` "reference" shouldn't change
	// in order to not cause any unnecessary re-renders of `virtual-scroller` items.
	const getCommentById = useCallback<GetCommentById>((id) => {
		return getCommentByIdRef.current(id)
	}, [])

	return getCommentById
}