import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { useSelector } from 'react-redux'

import Sidebar from '../Sidebar/Sidebar.js'
import SidebarTopBar from '../Sidebar/SidebarTopBar.js'

import ChannelHeader from '../ChannelHeader/ChannelHeader.js'

import ChannelThreadsSidebarSection from './ChannelThreadsSidebarSection.js'

import './SidebarLeft.css'

export default function SidebarLeft() {
	const threads = useSelector(state => state.data.threads)

	const isSidebarShown = Boolean(threads)

	// The `id` attribute is used in `document.getElementById('SidebarLeft')`
	// in `ChannelThreadsSidebarSection.js`.

	return (
		<Sidebar
			id="SidebarLeft"
			StickyHeader={StickyHeader}
			className={classNames('SidebarLeft', {
				'SidebarLeft--hide': !isSidebarShown
			})}>
			<ChannelThreadsSidebarSection/>
		</Sidebar>
	)
}

function StickyHeader() {
	const threads = useSelector(state => state.data.threads)
	const { channelView } = useSelector(state => state.settings.settings)

	if (!threads) {
		return null
	}

	return (
		<SidebarTopBar>
			<ChannelHeader
				alignTitle="start"
				channelView={channelView}
			/>
		</SidebarTopBar>
	)
}