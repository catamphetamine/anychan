import React, { useCallback, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import ChannelHeaderToolbar from './ChannelHeaderToolbar.js'
import ChannelThreadHeaderChannel from '../../components/ChannelThreadHeaderChannel.js'
import ChannelThreadHeaderSource, { ChannelThreadHeaderSourcePlaceholder } from '../../components/ChannelThreadHeaderSource.js'
import SearchInput from '../SearchInput.js'

import { thread as threadType } from '../../PropTypes.js'

import useOnChannelLinkClick from '../useOnChannelLinkClick.js'

import './ChannelHeader.css'

export default function ChannelHeader({
	alignTitle,

	threads,
	onSearchResults,
	searchQuery,
	onSearchQueryChange,

	// `channelLayout` / `channelSorting` should be cached at the initial render
	// on the `Channel` page and then passed as a property into this component.
	//
	// Otherwise, if `channelLayout` / `channelSorting` was read from its latest value
	// from `state.settings`, it could result in an incorrect behavior of `<VirtualScroller/>`
	// when navigating "Back" to the `Channel` page.
	//
	// In that case, the cached threads-list-item sizes that would be read from the cached
	// `<VirtualScroller/>` state would correspond to the old `channelLayout` / `channelSorting` —
	// the one that was selected when the user was still on the `Channel` page — while the user might
	// have changed the selected `channelLayout` / `channelSorting` to some other value in some other
	// web browser tab since the channel page has initially been rendered.
	//
	// And when the user would navigate "Back" to the `Channel` page, it would attempt to render
	// the list of threads using the cached `<VirtualScroller/>` item heights that had been measured
	// for a different `channelLayout` / `channelSorting` parameter, and, therefore, for a different
	// list of thread.
	//
	// So, after "Back" navigation, the `Channel` page should be restored exactly to the state
	// it was before navigating from it, and that "exact" state would include the
	// `channelLayout` / `channelSorting` setting value, and that's why the original
	// `channelLayout` / `channelSorting` gets saved in Redux
	// in `state.channel` state object rather than just read from `state.settings`.
	//
	channelLayout,
	channelSorting,

	canChangeChannelLayout,
	canChangeChannelSorting,

	onChannelViewWillChange,
	onChannelViewDidChange,

	className
}) {
	const searchInput = useRef()
	const searchButtonRef = useRef()

	const [showSearchInput, setShowSearchInput] = useState(Boolean(searchQuery))

	const onSearchClick = useCallback(() => {
		setShowSearchInput(!showSearchInput)
		if (showSearchInput) {
			onSearchQueryChange()
		} else {
			searchInput.current.focus()
		}
	}, [
		showSearchInput
	])

	const onSearchInputEscapeKeyDownWhenEmpty = useCallback(() => {
		setShowSearchInput(false)
		searchButtonRef.current.focus()
	}, [])

	const onSearchInputBlurWhenEmpty = useCallback(() => {
		setShowSearchInput(false)
	}, [])

	const channel = useSelector(state => state.data.channel)

	const getThreadTextSingleLineLowerCase = useCallback((thread) => {
		return thread.comments[0].getContentTextWithTitleSingleLineLowerCase()
	}, [])

	const onChannelLinkClick = useOnChannelLinkClick({
		channelId: channel.id
	})

	const toolbar = (
		<ChannelHeaderToolbar
			searchButtonRef={searchButtonRef}
			search={Boolean(onSearchQueryChange)}
			onSearchClick={onSearchClick}
			canChangeChannelLayout={canChangeChannelLayout}
			canChangeChannelSorting={canChangeChannelSorting}
			channelLayout={channelLayout}
			channelSorting={channelSorting}
		/>
	)

	return (
		<header className={classNames('ChannelHeader', className)}>
			{alignTitle === 'center' &&
				React.cloneElement(toolbar, {
					className: 'ChannelHeader-toolbarSizePlaceholder'
				})
			}
			<h1 className={classNames('ChannelHeader-heading', {
				'ChannelHeader-heading--alignContentCenter': alignTitle === 'center'
			})}>
				<ChannelThreadHeaderSource/>
				<ChannelThreadHeaderChannel
					channel={channel}
					showTitle
					onClick={onChannelLinkClick}
				/>
				<ChannelThreadHeaderSourcePlaceholder/>
			</h1>
			{toolbar}
			{onSearchQueryChange &&
				<SearchInput
					ref={searchInput}
					value={searchQuery}
					onChange={onSearchQueryChange}
					items={threads}
					getItemTextLowerCase={getThreadTextSingleLineLowerCase}
					onResults={onSearchResults}
					onEscapeKeyDownWhenEmpty={onSearchInputEscapeKeyDownWhenEmpty}
					onBlurWhenEmpty={onSearchInputBlurWhenEmpty}
					className={classNames('ChannelHeader-search', {
						// Hiding the `<SearchInput/>` via CSS instead of via javascript
						// because this way focus management is less prone to not working:
						// mobile web browsers are fine with manually calling `.focus()`
						// on an `<input/>` field when it's called immediately after
						// handling a user interaction `event`.
						// (which is gonna be a click on the search button).
						'ChannelHeader-search--hidden': !showSearchInput
					})}
					inputClassName="ChannelHeader-searchInput"
				/>
			}
		</header>
	)
}

ChannelHeader.propTypes = {
	threads: PropTypes.arrayOf(threadType),
	onSearchResults: PropTypes.func,
	searchQuery: PropTypes.string,
	onSearchQueryChange: PropTypes.func,
	alignTitle: PropTypes.oneOf(['start', 'center']).isRequired,
	channelLayout: PropTypes.oneOf([
		'threadsList',
		'threadsListWithLatestComments',
		'threadsTiles'
	]).isRequired,
	channelSorting: PropTypes.oneOf([
		'default',
		'popular'
	]).isRequired,
	canChangeChannelLayout: PropTypes.bool,
	canChangeChannelSorting: PropTypes.bool,
	onChannelViewWillChange: PropTypes.func,
	onChannelViewDidChange: PropTypes.func,
	className: PropTypes.string
}