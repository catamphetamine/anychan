import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import ChannelsListVirtualized from '../components/ChannelsList/ChannelsListVirtualized.js'

import { getChannels } from '../redux/data.js'

import getMessages from '../messages/getMessages.js'

import useMessages from '../hooks/useMessages.js'
import useSetting from '../hooks/useSetting.js'
import useBackground from '../hooks/useBackground.js'

import './Channels.css'

export default function ChannelsPage() {
	const {
		channels,
		channelsByCategory,
		channelsByPopularity
	} = useSelector(state => state.data.allChannels)

	const background = useBackground()

	return (
		<section className={classNames('ChannelsPage', 'Content', 'Content--text', {
			'ChannelsPage--onBackground': background
		})}>
			<ChannelsListVirtualized
				showAllChannels
				channels={channels}
				channelsByPopularity={channelsByPopularity}
				channelsByCategory={channelsByCategory}
			/>
		</section>
	)
}

ChannelsPage.meta = ({ useSelector }) => {
	const messages = useMessages({ useSelector })
	return {
		title: messages.boards.title
	}
}

ChannelsPage.load = async ({
	dispatch,
	useSelector,
	context
}) => {
	const useSetting_ = (getter) => useSetting(getter, { useSelector })
	const locale = useSetting_(settings => settings.locale)

	await dispatch(getChannels({
		all: true,
		userSettings: context.userSettings,
		dataSource: context.dataSource,
		multiDataSource: context.multiDataSource,
		messages: getMessages(locale)
	}))
}