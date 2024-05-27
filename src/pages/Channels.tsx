import type { State, PageLoadFunction, UserSettingsJson, PageMetaFunction } from '@/types'

import React, { useEffect } from 'react'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'

import ChannelsListVirtualized from '../components/ChannelsList/ChannelsListVirtualized.js'

import getChannelsCached from '../api/cached/getChannels.js'

import { setChannelsResult } from '../redux/channels.js'

import useMessages from '../hooks/useMessages.js'
import useSetting from '../hooks/useSetting.js'
// import useBackground from '../hooks/useBackground.js'

import Heading from '../components/Heading.js'

import { channelsResult as channelsResultType } from '../PropTypes.js'

import {
	ContentSections,
	ContentSection,
	ContentSectionHeader,
	ContentSectionDescription
} from 'frontend-lib/components/ContentSection.js'

import './Channels.css'

export default function ChannelsPage({
	channelsResult
}: ChannelsPageProps) {
	const {
		channels,
		channelsByCategory,
		channelsByPopularity
	} = channelsResult.allChannels

	const dispatch = useDispatch()
	// const background = useBackground()
	const messages = useMessages()

	useEffect(() => {
		dispatch(setChannelsResult(channelsResult))
	}, [])

	return (
		<section className={classNames('ChannelsPage', 'Content', 'Content--text', {
			// 'ChannelsPage--onBackground': background
		})}>
			<Heading onBackground>
				{messages.boards.title}
			</Heading>

			<ContentSection>
				<ChannelsListVirtualized
					showAllChannels
					channels={channels}
					channelsByPopularity={channelsByPopularity}
					channelsByCategory={channelsByCategory}
				/>
			</ContentSection>
		</section>
	)
}

ChannelsPage.propTypes = {
	channelsResult: channelsResultType.isRequired
}

interface ChannelsPageProps {
	channelsResult: State['channels']
}

const meta: PageMetaFunction = ({ useSelector }) => {
	const messages = useMessages({ useSelector })
	return {
		title: messages.boards.title
	}
}

ChannelsPage.meta = meta

const load: PageLoadFunction = async ({
	useSelector,
	context
}) => {
	const useSetting_ = (getter: (settings: UserSettingsJson) => any) => useSetting(getter, { useSelector })

	const locale = useSetting_(settings => settings.locale)

	return {
		props: {
			channelsResult: await getChannelsCached({
				all: true,
				forceRefresh: true,
				locale,
				userSettings: context.userSettings,
				dataSource: context.dataSource,
				multiDataSource: context.multiDataSource
			})
		}
	}
}

ChannelsPage.load = load