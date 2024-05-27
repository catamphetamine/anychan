import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { setExpandAttachments } from '../../redux/threadPage.js'

import { usePageStateSelector } from '@/hooks'

export default function useExpandAttachments() {
	const dispatch = useDispatch()

	const areAttachmentsExpanded = usePageStateSelector('threadPage', state => state.threadPage.expandAttachments)

	const setAttachmentsExpanded = useCallback((expandAttachments: boolean) => {
		dispatch(setExpandAttachments(expandAttachments))
	}, [])

	return {
		areAttachmentsExpanded,
		setAttachmentsExpanded
	}
}