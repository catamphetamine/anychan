import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import VirtualScroller from 'virtual-scroller/react'

import SidebarSection from '../Sidebar/SidebarSection.js'
import SidebarThread from './SidebarThread.js'

import useMessages from '../../hooks/useMessages.js'

import './ChannelThreadsSidebarSection.css'

export default function ChannelThreadsSidebarSection() {
	const messages = useMessages()

	// const channel = useSelector(state => state.data.channel)
	const threads = useSelector(state => state.data.threads)
	const { channelView } = useSelector(state => state.channel)

	const getInitialItemState = useCallback((thread) => ({
		hidden: thread.comments[0].hidden
	}), [])

	const getScrollableContainer = useCallback(() => {
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
		return document.querySelector('#SidebarLeft .simplebar-content-wrapper')
	}, [])

	if (!threads) {
		return
	}

	// <SidebarSection title={messages.threads.title}>

	return (
		<SidebarSection>
			<VirtualScroller
				key={channelView}
				bypass={typeof window === 'undefined'}
				className="SidebarThreads"
				getInitialItemState={getInitialItemState}
				onItemInitialRender={onItemInitialRender}
				getItemId={getItemId}
				measureItemsBatchSize={12}
				getScrollableContainer={getScrollableContainer}
				items={threads}
				itemComponent={SidebarThread}
			/>
		</SidebarSection>
	)
}

function getItemId(thread) {
	return thread.id
}

function onItemInitialRender(thread) {
	// Parse thread main comment content and create text preview.
	thread.comments[0].createTextPreview()
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