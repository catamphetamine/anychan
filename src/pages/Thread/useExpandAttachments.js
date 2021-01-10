import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { setExpandAttachments } from '../../redux/thread'

export default function useExpandAttachments() {
	const dispatch = useDispatch()
	const areAttachmentsExpanded = useSelector(({ thread }) => thread.expandAttachments)
	const onSetAttachmentsExpanded = useCallback((expandAttachments) => {
		dispatch(setExpandAttachments(expandAttachments))
	}, [])
	return [
		areAttachmentsExpanded,
		onSetAttachmentsExpanded
	]
}