import React from 'react'
import { useSelector } from 'react-redux'

import Boards from '../Boards'
import SidebarSection from './SidebarSection'

import getMessages from '../../messages'

export default function BoardsSidebarSection() {
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const favoriteBoards = useSelector(({ favoriteBoards }) => favoriteBoards.favoriteBoards)
	return (
		<SidebarSection title={favoriteBoards.length > 0 ? getMessages(locale).boards.moreBoards : getMessages(locale).boards.title}>
			<Boards/>
		</SidebarSection>
	)
}