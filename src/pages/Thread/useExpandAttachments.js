import { useState, useCallback } from 'react'

export default function useExpandAttachments({
	restoredVirtualScrollerState,
	virtualScrollerState
}) {
	const [areAttachmentsExpanded, setAttachmentsExpanded] = useState(restoredVirtualScrollerState && restoredVirtualScrollerState.expandAttachments)
	const onSetAttachmentsExpanded = useCallback((expandAttachments) => {
		if (virtualScrollerState.current) {
			virtualScrollerState.current.expandAttachments = expandAttachments
		}
		setAttachmentsExpanded(expandAttachments)
	}, [setAttachmentsExpanded])
	return [
		areAttachmentsExpanded,
		onSetAttachmentsExpanded
	]
}