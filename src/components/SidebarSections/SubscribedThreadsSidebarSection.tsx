import React, { useState } from 'react'
import { useSelector } from '@/hooks'

import SubscribedThreads from '../SubscribedThreads/SubscribedThreads.js'
import SidebarSection from '../Sidebar/SidebarSection.js'

import useMessages from '../../hooks/useMessages.js'

export default function SubscribedThreadsSidebarSection() {
	const messages = useMessages()

	const subscribedThreads = useSelector(state => state.subscribedThreads.subscribedThreads)

	const [editMode, setEditMode] = useState<boolean>()

	if (subscribedThreads.length === 0) {
		return null
	}

	return (
		<SidebarSection
			title={messages.subscribedThreads.title}
			moreLabel={messages.actions.edit}
			onMore={setEditMode}>
			<SubscribedThreads edit={editMode}/>
		</SidebarSection>
	)
}