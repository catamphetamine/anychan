import { useMemo } from 'react'

import updateAttachmentThumbnailMaxWidth from '../../utility/post/updateAttachmentThumbnailMaxWidth.js'

export default function useUpdateAttachmentThumbnailMaxWidth({ threads }) {
	// Runs only once before the initial render of a channel/thread page.
	// Sets `--PostThumbnail-maxWidth` CSS variable.
	//
	// Using `useMemo()` here instead of `useLayoutEffect()` because
	// parent component's "effects" would run after children's.
	// Since `<VirtualScroller/>` is a child component of a channel/thread page,
	// its "effects" would run before this "effect", and so `VirtualScroller`'s
	// item height measurements that're done in its "effect" would become stale
	// because changing `--PostThumbnail-maxWidth` CSS variable changes the layout.
	//
	useMemo(
		() => {
			updateAttachmentThumbnailMaxWidth(threads.map(thread => thread.comments[0]))
		},
		[threads]
	)
}