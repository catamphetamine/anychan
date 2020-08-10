import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import TrackedThreads from './TrackedThreads'
import SidebarSection from './SidebarSection'

import getMessages from '../messages'

export default function TrackedThreadsSidebarSection() {
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const trackedThreads = useSelector(({ threadTracker }) => threadTracker.trackedThreads)
	const [editMode, setEditMode] = useState()
	if (trackedThreads.length === 0) {
		return null
	}
	return (
		<SidebarSection
			title={getMessages(locale).trackedThreads.title}
			moreLabel={getMessages(locale).actions.edit}
			onMore={setEditMode}>
			<TrackedThreads edit={editMode}/>
		</SidebarSection>
	)
}