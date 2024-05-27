import type { Thread } from '@/types'

import React, { useCallback, useRef } from 'react'
import PropTypes from 'prop-types'

import VirtualScroller from 'virtual-scroller/react'

import SidebarSection from '../Sidebar/SidebarSection.js'
import ChannelThreadsSidebarSectionThread from './ChannelThreadsSidebarSectionThread.js'

import { usePageStateSelectorOutsideOfPage, useRoute, useMessages } from '@/hooks'

import isThreadPage from '../../utility/routes/isThreadPage.js'
import isChannelPage from '../../utility/routes/isChannelPage.js'

import './ChannelThreadsSidebarSection.css'

export default function ChannelThreadsSidebarSection({
	searchResultsQuery,
	searchResults
}: ChannelThreadsSidebarSectionProps) {
	const messages = useMessages()

	const dummyDiv = useRef()

	// const channel = usePageStateSelectorOutsideOfPage('channel', state => state.channel.channel)
	const threads = usePageStateSelectorOutsideOfPage('channel', state => state.channel.threads)

	const getInitialItemState = useCallback((thread: Thread) => ({
		hidden: thread.comments[0].hidden
	}), [])

	const getScrollableContainer = useCallback(() => {
		if (!dummyDiv.current) {
			return null
		}
		const sidebar = findParentSidebarElement(dummyDiv.current)
		if (!sidebar) {
			console.error('[ChannelThreadsSidebarSection] `.Sidebar` DOM Element not found')
			return null
		}
		// `react-simplebar` supports passing a function as `children`:
		// {({ scrollableNodeRef, contentNodeRef }) => (...)}
		// That way, the scrollable container could be get from `scrollableNodeRef.current`.
		// https://github.com/Grsmto/simplebar/issues/635
		// But in reality that doesn't work for `virtual-scroller`
		// because `ref`s are only set after the component has mounted,
		// and because it's a parent component, it always finishes mounting
		// after all of its children, and `virtual-scroller` component,
		// being a child, expects the scrollable container DOM element
		// to be available by the time its own mounting has finished
		// which is before the parent component has finished moutning.
		// So getting the DOM element directly instead.
		// return document.querySelector('#SidebarLeft > .Sidebar-scrollableList > .simplebar-content-wrapper')
		// return document.querySelector('#SidebarLeft .simplebar-content-wrapper')
		return sidebar.querySelector('.simplebar-content-wrapper') as HTMLElement
	}, [])

	const route = useRoute()
	const isChannelOrThreadPage = isChannelPage(route) || isThreadPage(route)

	if (!isChannelOrThreadPage) {
		return null
	}

	// If no `threads` list has been loaded on the channel page
	// then there's no threads list to show.
	// This could happen when the user navigates directly to a thread page URL.
	if (!threads) {
		return null
	}

	// <SidebarSection title={messages.threads.title}>

	return (
		<SidebarSection marginTop={false} marginBottom={false}>
			{/* This `<div/>` is only used to determine which sidebar is this section at. */}
			<div ref={dummyDiv}/>

			<VirtualScroller
				bypass={typeof window === 'undefined'}
				className="ChannelThreadsSidebarSection"
				getInitialItemState={getInitialItemState}
				onItemInitialRender={onItemInitialRender}
				getItemId={getItemId}
				measureItemsBatchSize={12}
				getScrollableContainer={getScrollableContainer}
				items={searchResultsQuery ? searchResults : threads}
				itemComponent={ChannelThreadsSidebarSectionThread}
			/>

			{searchResultsQuery && searchResults.length === 0 &&
				<div className="ChannelThreadsSidebarSection-nothingFound">
					{messages.noSearchResults}
				</div>
			}
		</SidebarSection>
	)
}

ChannelThreadsSidebarSection.propTypes = {
	searchResultsQuery: PropTypes.string,
	searchResults: PropTypes.arrayOf(PropTypes.object)
}

interface ChannelThreadsSidebarSectionProps {
	searchResultsQuery?: string,
	searchResults?: Thread[]
}

function getItemId(thread: Thread) {
	return thread.id
}

function onItemInitialRender(thread: Thread) {
	// Parse thread main comment content and create text preview.
	thread.comments[0].createTextPreviewForSidebar({
		charactersInLine: 35,
		maxLines: 5
	})
}

// function getScrollableContainer() {
// 	const sidebarElement = document.getElementById('SidebarLeft')
// 	if (sidebarElement) {
// 		if (sidebarElement.firstChild) {
// 			if (sidebarElement.firstChild.classList.has('Sidebar-scrollableList')) {
// 				if (sidebarElement.firstChild.firstChild) {
// 					if (sidebarElement.firstChild.firstChild.classList.has('simplebar-content-wrapper')) {
// 						return sidebarElement.firstChild.firstChild
// 					}
// 				}
// 			}
// 		}
// 	}
// }

function findParentSidebarElement(element: Element) {
	const parentElement = element.parentElement
	if (!parentElement) {
		return
	}
	if (parentElement.classList.contains('Sidebar')) {
		return parentElement
	}
	return findParentSidebarElement(parentElement)
}