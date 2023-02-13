import React from 'react'
import PropTypes from 'prop-types'

import Sidebar from '../Sidebar/Sidebar.js'

import ChannelThreadsSidebarStickyHeader from '../SidebarStickyHeaders/ChannelThreadsSidebarStickyHeader.js'

import ChannelThreadsSidebarSection from '../SidebarSections/ChannelThreadsSidebarSection.js'

import './SidebarLeft.css'

const SidebarLeft = React.forwardRef((props, ref) => {
	return (
		<Sidebar
			ref={ref}
			StickyHeader={ChannelThreadsSidebarStickyHeader}
			className="SidebarLeft">
			<ChannelThreadsSidebarSection/>
		</Sidebar>
	)
})

export default SidebarLeft