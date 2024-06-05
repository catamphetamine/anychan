import type { Thread, GetCommentById } from '@/types'

import { useRef, useMemo, useCallback } from 'react'

import createGetCommentByIdIndex from '../../utility/thread/createGetCommentById.js'

// This hook returns a `getCommentById()` function for a given `thread` object.
//
// What's the point of having this hook? There're two.
//
// * The first point is that on a thread page, `thread.comments` array reference does get changed periodically
//   as the thread is being automatically refreshed, so in order for the `getCommentById()`
//   function to stay relevant, it should be updated to search in the new (updated)
//   `thread.comments` array rather than in the old one.
//
//   The `thread.comments` array does change on auto-refresh because it doesn't "mutate"
//   the original `thread.comments` array but rather creates a new one.
//
// * The second point is that when viewing a channel page in "with latest comments" layout,
//   some of those "latest comments" may reference each other. With the default `getCommentById()`
//   function, it wouldn't search in those `thread.latestComments` so when those "latest comments"
//   referenced each other, it wouldn't detect and automatically expand those links.
//   When using a "custom" (non-default) `getCommentById()` function returned from this hook,
//   that issue is fixed.
//
export default function useGetCommentById({ thread }: { thread: Thread }) {
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
		return createGetCommentByIdIndex(thread)
	}, [thread.comments])

	// The returned `getCommentById()` "reference" shouldn't change
	// in order to not cause any unnecessary re-renders of `virtual-scroller` items.
	const getCommentById = useCallback<GetCommentById>((id) => {
		return getCommentByIdRef.current(id)
	}, [])

	return getCommentById
}