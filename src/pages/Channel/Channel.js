import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-pages'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import {
	setVirtualScrollerState,
	setScrollPosition
} from '../../redux/channel'

import { getProviderId, getProvider } from '../../provider'
import getMessages from '../../messages'

import Toolbar from '../../components/Toolbar'
import CommentsList from '../../components/CommentsList'
import ProviderLogo from '../../components/ProviderLogo'
import ChannelUrl from '../../components/ChannelUrl'

import ChannelThread from './ChannelThread'

import useUnreadCommentWatcher from './useUnreadCommentWatcher'
import useUpdateAttachmentThumbnailMaxWidth from './useUpdateAttachmentThumbnailMaxWidth'
import useOnThreadClick from './useOnThreadClick'

import getChannelPageMeta from './getChannelPageMeta'
import loadChannelPage from './loadChannelPage'

import './Channel.css'

function ChannelPage() {
	const channel = useSelector(({ data }) => data.channel)
	const threads = useSelector(({ data }) => data.threads)
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const censoredWords = useSelector(({ settings }) => settings.settings.censoredWords)
	const initialVirtualScrollerState = useSelector(({ channel }) => channel.virtualScrollerState)
	const initialScrollPosition = useSelector(({ channel }) => channel.scrollPosition)

	const dispatch = useDispatch()

	// Update max attachment thumbnail width.
	useUpdateAttachmentThumbnailMaxWidth({ threads })

	const [isSearchBarShown, setSearchBarShown] = useState()

	const onThreadClick = useOnThreadClick()

	const unreadCommentWatcher = useUnreadCommentWatcher()

	const itemComponentProps = useMemo(() => ({
		mode: 'channel',
		hasVoting: channel.hasVoting,
		channelId: channel.id,
		dispatch,
		locale,
		onClick: onThreadClick,
		unreadCommentWatcher
	}), [
		channel,
		dispatch,
		locale,
		onThreadClick,
		unreadCommentWatcher
	])

	return (
		<section className="ChannelPage Content">
			<header className="ChannelPage-header">
				<h1 className="ChannelPage-heading">
					<Link
						to="/"
						title={getProvider().title}
						className="ChannelPage-headingLogoLink">
						<ProviderLogo
							className="ChannelPage-headingLogo"/>
					</Link>
					<ChannelUrl
						channelId={channel.id}
						className="ChannelPage-headingId"/>
					{channel.title}
					<ProviderLogo
						className="ChannelPage-headingLogo ChannelPage-headingLogo--spaceEquivalent"/>
				</h1>
				<Toolbar
					mode="channel"
					dispatch={dispatch}
					locale={locale}
					isSearchBarShown={isSearchBarShown}
					setSearchBarShown={setSearchBarShown}
					className="ChannelPage-menu"/>
			</header>
			{getProviderId() === '2ch' && channel.id === 'd' &&
				<p className="ChannelPage-apiChannelEmptyNoteTwoProvidernel">
					Данный раздел пуст из-за бага в <a href={`https://2ch.hk/${channel.id}/catalog.json`} target="_blank">API Двача</a>.
					<br/>
					<a href={`https://2ch.hk/${channel.id}`} target="_blank">Перейти на Двач</a>.
				</p>
			}
			<CommentsList
				mode="channel"
				initialState={initialVirtualScrollerState}
				setState={setVirtualScrollerState}
				initialScrollPosition={initialScrollPosition}
				setScrollPosition={setScrollPosition}
				items={threads}
				itemComponent={ChannelThread}
				itemComponentProps={itemComponentProps}
				className="ChannelPage-threads"/>
		</section>
	)
	// className="ChannelPage-threads no-margin-collapse"
}

// ChannelPage.propTypes = {
// 	channel: PropTypes.string.isRequired,
// 	threads: PropTypes.arrayOf(PropTypes.object).isRequired,
// 	locale: PropTypes.string.isRequired,
// 	censoredWords: PropTypes.arrayOf(PropTypes.object),
// 	virtualScrollerState: PropTypes.object,
// 	dispatch: PropTypes.func.isRequired
// }

ChannelPage.meta = getChannelPageMeta
ChannelPage.load = loadChannelPage

// This is a workaround for cases when navigating from one channel
// to another channel in order to prevent page state inconsistencies
// while the current channel data is being updated in Redux
// as the "next" page is being loaded.
// https://github.com/4Catalyzer/found/issues/639#issuecomment-567650811
// https://gitlab.com/catamphetamine/react-pages#same-route-navigation
export default function ChannelPageWrapper() {
	const channelId = useSelector(({ data }) => data.channel.id)
	return <ChannelPage key={channelId}/>
}
ChannelPageWrapper.meta = ChannelPage.meta
ChannelPageWrapper.load = ChannelPage.load