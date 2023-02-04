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
	const { channelView } = useSelector(state => state.settings.settings)

	const threads = useSelector(state => state.data.threads)
	const isSidebarShown = Boolean(threads)

	return (
		<Sidebar id="SidebarLeft" className={classNames('SidebarLeft', {
			'SidebarLeft--hide': !isSidebarShown
		})}>
			{threads &&
				<SidebarTopBar>
					<ChannelHeader
						alignTitle="start"
						channelView={channelView}
					/>
				</SidebarTopBar>
			}
			<ChannelThreadsSidebarSection/>
		</Sidebar>
	)
}