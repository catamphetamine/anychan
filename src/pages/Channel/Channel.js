import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import PropTypes from 'prop-types'
import { Link, goto, wasInstantNavigation } from 'react-pages'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'

import { channelId } from '../../PropTypes'

import { getThreads } from '../../redux/data'
import { addFavoriteChannel } from '../../redux/favoriteChannels'
import { setVirtualScrollerState, setScrollPosition } from '../../redux/channel'

import { getProviderId, getProvider } from '../../provider'
import getMessages from '../../messages'
import getUrl from '../../utility/getUrl'
import { updateAttachmentThumbnailMaxSize } from '../../utility/postThumbnail'
import onThreadsFetched from '../../utility/onThreadsFetched'
import UnreadCommentWatcher from '../../utility/UnreadCommentWatcher'

import Toolbar from '../../components/Toolbar'
import Comment from '../../components/Comment/CommentWrapped'
import CommentsList from '../../components/CommentsList'
import ProviderLogo from '../../components/ProviderLogo'
import ChannelUrl from '../../components/ChannelUrl'
import canGoBackToThreadFromChannel from './canGoBackToThreadFromChannel'

import './Channel.css'

function ChannelPage() {
	const channel = useSelector(({ data }) => data.channel)
	const threads = useSelector(({ data }) => data.threads)
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const censoredWords = useSelector(({ settings }) => settings.settings.censoredWords)
	const _restoredVirtualScrollerState = useSelector(({ channel }) => channel.virtualScrollerState)
	const restoredVirtualScrollerState = wasInstantNavigation() ? _restoredVirtualScrollerState : undefined
	const _restoredScrollPosition = useSelector(({ channel }) => channel.scrollPosition)
	const restoredScrollPosition = wasInstantNavigation() ? _restoredScrollPosition : undefined
	const dispatch = useDispatch()
	const [isSearchBarShown, setSearchBarShown] = useState()
	// Looks like, due to how the whole thing works, `found.resolvedMatch`
	// initially still refers to the previous page's location, but right
	// after that it switches to this page's location.
	// This prevents `onThreadClick()` from declaring zero dependencies,
	// because it uses `currentRoute` which is `found.resolvedMatch`
	// so it does change. Therefore, a `ref` workaround is used
	// to prevent `onThreadClick()` from changing but at the same time
	// to have the latest `currentRoute` value inside.
	// The reason why `onThreadClick()` is kept constant is because
	// it's a dependency of `itemComponentProps` which shouldn't change
	// needlessly so that thread cards aren't rerendered needlessly.
	// (a minor optimization, but maybe I'm a perfectionist)
	const currentRoute = useSelector(({ found }) => found.resolvedMatch)
	const currentRouteRef = useRef()
	currentRouteRef.current = currentRoute
	const onThreadClick = useCallback(async (comment, threadId, channelId) => {
		const goBackToThreadFromChannel = canGoBackToThreadFromChannel({
			channelId,
			threadId,
			currentRoute: currentRouteRef.current
		})
		if (goBackToThreadFromChannel) {
			return dispatch(goBackToThreadFromChannel())
		}
		// The only reason the navigation is done programmatically via `goto()`
		// is because a thread card can't be a `<Link/>` because
		// "<a> cannot appear as a descendant of <a>".
		dispatch(goto(getUrl(channelId, threadId), { instantBack: true }))
	}, [])
	// Runs only once before the initial render.
	// Sets `--PostThumbnail-maxWidth` CSS variable.
	// Not using `useEffect()` because it would run after render, not before it.
	useMemo(
		() => updateAttachmentThumbnailMaxSize(threads.map(thread => thread.comments[0])),
		[threads]
	)
	const unreadCommentWatcher = useMemo(() => {
		return new UnreadCommentWatcher({ dispatch })
	}, [])
	const itemComponentProps = useMemo(() => ({
		mode: 'channel',
		hasVoting: channel.hasVoting,
		channelId: channel.id,
		threads,
		dispatch,
		locale,
		onClick: onThreadClick,
		unreadCommentWatcher
	}), [
		channel,
		threads,
		dispatch,
		locale,
		onThreadClick,
		unreadCommentWatcher
	])
	useEffect(() => {
		return () => unreadCommentWatcher.stop()
	}, [])
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
				restoredState={restoredVirtualScrollerState}
				setState={setVirtualScrollerState}
				restoredScrollPosition={restoredScrollPosition}
				setScrollPosition={setScrollPosition}
				items={threads}
				itemComponent={Thread}
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

ChannelPage.meta = ({ data: { channel }}) => ({
	title: channel && ('/' + channel.id + '/' + ' — ' + channel.title),
	description: channel && channel.description
})

ChannelPage.load = async ({ getState, dispatch, params }) => {
	const settings = getState().settings.settings
	const { channelId, threads } = await dispatch(getThreads(params.channelId, {
		censoredWords: settings.censoredWords,
		grammarCorrection: settings.grammarCorrection,
		locale: settings.locale
	}))
	onThreadsFetched(channelId, threads, { dispatch })
	if (settings.autoSuggestFavoriteChannels !== false) {
		const { channel } = getState().data
		dispatch(addFavoriteChannel({
			id: channel.id,
			title: channel.title
		}))
	}
}

function Thread({
	state,
	channelId,
	threads,
	onStateChange,
	onHeightChange,
	children: thread,
	...rest
}) {
	const onExpandContent = useCallback(() => {
		onStateChange({
			expandContent: true
		})
	}, [onStateChange])
	const comment = thread.comments[0]
	// Passing `initialExpandContent` and `onExpandContent` explicitly
	// because it doesn't use `<CommentTree/>` that passes
	// those properties automatically.
	return (
		<Comment
			key={comment.id}
			comment={comment}
			channelId={channelId}
			threadId={thread.id}
			onClickUrl={getUrl(channelId, thread.id)}
			initialExpandContent={state && state.expandContent}
			onExpandContent={onExpandContent}
			onStateChange={onStateChange}
			onRenderedContentDidChange={onHeightChange}
			{...rest}/>
	)
}

Thread.propTypes = {
	channelId: channelId.isRequired,
	threads: PropTypes.arrayOf(PropTypes.object).isRequired,
	onStateChange: PropTypes.func.isRequired,
	onHeightChange: PropTypes.func.isRequired,
	children: PropTypes.object.isRequired
}

// Using `React.memo()` so that `virtual-scroller`
// doesn't re-render items as the user scrolls.
Thread = React.memo(Thread)

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