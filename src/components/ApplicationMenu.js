import React from 'react'
import PropTypes from 'prop-types'

import Menu from './Menu'

import FeedIconOutline from 'webapp-frontend/assets/images/icons/menu/feed-outline.svg'
import FeedIconFill from 'webapp-frontend/assets/images/icons/menu/feed-fill.svg'

import SearchIconOutline from 'webapp-frontend/assets/images/icons/menu/search-outline.svg'
import SearchIconFill from 'webapp-frontend/assets/images/icons/menu/search-fill.svg'

import AddIconOutline from 'webapp-frontend/assets/images/icons/menu/add-outline.svg'
import AddIconFill from 'webapp-frontend/assets/images/icons/menu/add-fill.svg'

import MessageIconOutline from 'webapp-frontend/assets/images/icons/menu/message-outline.svg'
import MessageIconFill from 'webapp-frontend/assets/images/icons/menu/message-fill.svg'

import PersonIconOutline from 'webapp-frontend/assets/images/icons/menu/person-outline.svg'
import PersonIconFill from 'webapp-frontend/assets/images/icons/menu/person-fill.svg'

import SettingsIconOutline from 'webapp-frontend/assets/images/icons/menu/settings-outline.svg'
import SettingsIconFill from 'webapp-frontend/assets/images/icons/menu/settings-fill.svg'

import './ApplicationMenu.css'

export default class ApplicationMenu extends React.Component {
	static propTypes = {
		footer: PropTypes.bool
	}

	render() {
		const { footer } = this.props
		return (
			<Menu className="application-menu">
				{footer ? MENU_ITEMS_FOOTER : MENU_ITEMS}
			</Menu>
		)
	}
}

// const MENU_ITEMS = [{
// 	// title: 'Feed',
// 	link: '/feed',
// 	outlineIcon: FeedIconOutline,
// 	fillIcon: FeedIconFill
// }, {
// 	// title: 'Discover',
// 	link: '/discover',
// 	outlineIcon: SearchIconOutline,
// 	fillIcon: SearchIconFill
// }, {
// 	// title: 'Post',
// 	link: '/post',
// 	outlineIcon: AddIconOutline,
// 	fillIcon: AddIconFill
// }, {
// 	// title: 'Messages',
// 	link: '/messages',
// 	outlineIcon: MessageIconOutline,
// 	fillIcon: MessageIconFill
// }, {
// 	// title: 'Account',
// 	link: '/profile',
// 	outlineIcon: PersonIconOutline,
// 	fillIcon: PersonIconFill
// }]

const MENU_ITEMS = [{
	// title: 'Account',
	link: '/settings',
	outlineIcon: SettingsIconOutline,
	fillIcon: SettingsIconFill
}]

const MENU_ITEMS_FOOTER = [{
	link: '/',
	outlineIcon: FeedIconOutline,
	fillIcon: FeedIconFill
},
...MENU_ITEMS]