import { useMemo } from 'react'

import { updateAttachmentThumbnailMaxWidth } from '../../utility/postThumbnail'

export default function useUpdateAttachmentThumbnailMaxWidth({ threads }) {
	// Runs only once before the initial render.
	// Sets `--PostThumbnail-maxWidth` CSS variable.
	// Not using `useEffect()` because it would run after render, not before it.
	useMemo(
		() => updateAttachmentThumbnailMaxWidth(threads.map(thread => thread.comments[0])),
		[threads]
	)
}