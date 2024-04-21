import React, { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { thread as threadType } from '../../PropTypes.js'

import { updatePinnedThreadsState } from '../../redux/channel.js'

import ChannelPinnedThread from './ChannelPinnedThread.js';
import ChannelPinnedThreadPreview from './ChannelPinnedThreadPreview.js';

import useTransformCommentListItemInitialState from './useTransformCommentListItemInitialState.js'

import { onCommentInitialRender, getCommentsListItemInitialState } from '../../components/CommentsList.js';

import './ChannelPinnedThreads.css'

export default function ChannelPinnedThreads({
	threads,
	threadComponentProps
}) {
	const dispatch = useDispatch()

	const pinnedThreadsState = useSelector(state => state.channel.pinnedThreadsState)

	const {
		expandedThreadIds = [],
		expandedThreadStates = {}
	} = pinnedThreadsState || {}

	const transformCommentListItemInitialState = useTransformCommentListItemInitialState({
		channelLayout: threadComponentProps.channelLayout
	})

	const onThreadPreviewClick = useCallback((thread) => {
		const newExpandedThreadIds = expandedThreadIds.concat([thread.id])

		onCommentInitialRender(thread, {
			mode: 'channel',
			getCommentById: threadComponentProps.getCommentById
		})

		dispatch(updatePinnedThreadsState({
			expandedThreadIds: newExpandedThreadIds,
			expandedThreadStates: {
				...expandedThreadStates,
				[String(thread.id)]: getCommentsListItemInitialState(thread, {
					mode: 'channel',
					// Ignore the "Hidden" status of the thread when expanding it from a preview.
					// The rationale is that if a user is expanding a thread from a preview,
					// they intend to view the thread rather than a "Hidden thread" placeholder.
					ignoreHiddenState: true,
					transformInitialItemState: transformCommentListItemInitialState
				})
			}
		}))
	}, [])

	const setExpandedThreadState = useCallback((threadId, state) => {
		dispatch(updatePinnedThreadsState({
			expandedThreadStates: {
				...expandedThreadStates,
				[String(threadId)]: state
			}
		}))
	}, [])

	if (threads.length === 0) {
		return null
	}

	return (
		<ul className="ChannelPinnedThreads">
			{threads.map((thread) => {
				const isExpanded = expandedThreadIds.includes(thread.id)
				return (
					<li key={thread.id} className={classNames('ChannelPinnedThread', {
						'ChannelPinnedThread--expanded': isExpanded,
						'ChannelPinnedThread--minimized': !isExpanded
					})}>
						{isExpanded
							? <ChannelPinnedThread
								thread={thread}
								threadComponentProps={threadComponentProps}
								state={expandedThreadStates[String(thread.id)]}
								setState={(state) => setExpandedThreadState(thread.id, state)}
							/>
							: <ChannelPinnedThreadPreview
								thread={thread}
								onClick={(event) => {
									event.preventDefault()
									onThreadPreviewClick(thread)
								}}
							/>
						}
					</li>
				)
			})}
		</ul>
	)
}

ChannelPinnedThreads.propTypes = {
	threads: PropTypes.arrayOf(threadType).isRequired,
	threadComponentProps: PropTypes.object.isRequired
}