import { useRef, useMemo, useCallback } from 'react'

import createByIdIndex from '../../utility/createByIdIndex.js'

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
				// When a `thread` is fetched for the channel page for "with latest comments" layout,
				// the `thread` object only contains the "original comment" and some of the "latest comments".
				// Therefore, in such restrained conditions, it can only search in that limited set of comments
				// and it can't really search in all of the comments.
				// Still, some is better than none so it creates a limited list of comments it can search in.
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