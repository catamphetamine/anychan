import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import useSubscribedThreads from './useSubscribedThreads.js'
import useViewMode from './useViewMode.js'
import SubscribedThread from './SubscribedThread.js'

import useRoute from '../../hooks/useRoute.js'
import useMessages from '../../hooks/useMessages.js'
import usePageStateSelectorOutsideOfPage from '../../hooks/usePageStateSelectorOutsideOfPage.js'

import isThreadPage from '../../utility/routes/isThreadPage.js'

import TextButton from '../TextButton.js'

import './SubscribedThreads.css'

export default function SubscribedThreads({
	edit,
	maxListLength = 7
}: SubscribedThreadsProps) {
	const messages = useMessages()

	const selectedThreadChannel = usePageStateSelectorOutsideOfPage('thread', state => state.thread.channel)
	const selectedThread = usePageStateSelectorOutsideOfPage('thread', state => state.thread.thread)

	// const subscribedThreadsUpdateInProgress = useSelector(state => state.subscribedThreads.subscribedThreadsUpdateInProgress)
	// const subscribedThreadsUpdateInitial = useSelector(state => state.subscribedThreads.subscribedThreadsUpdateInitial)

	const route = useRoute()

	const {
		subscribedThreads,
		hasMoreThreads,
		hasAliveThreads,
		hasMoreAliveThreads,
		hasExpiredThreads,
		getShownSubscribedThreads
	} = useSubscribedThreads({
		maxListLength,
		// Snapshot subscribed threads list when entering edit mode,
		// so that they're not rearranged while the user is editing the list,
		// so that the user doesn't accidentally click the "delete" button
		// on a thread list item that wasn't intended to be clicked.
		snapshot: edit
	})

	const {
		viewMode,
		onShowMoreThreads,
		onShowLessThreads,
		showMoreLessButton,
		showExpiredThreadsButton
	} = useViewMode({
		hasMoreThreads,
		hasMoreAliveThreads
	})

	return (
		<section className={classNames('SubscribedThreads', {
			'SubscribedThreads--empty': subscribedThreads.length === 0
		})}>
			{subscribedThreads.length === 0 &&
				<div className="SidebarSection-text SidebarSection-text--alternative">
					{messages.subscribedThreads.empty}
				</div>
			}
			{subscribedThreads.length > 0 && !hasAliveThreads &&
				<div className="SidebarSection-text SidebarSection-text--alternative">
					{messages.subscribedThreads.allExpired}
				</div>
			}
			{subscribedThreads.length > 0 && hasAliveThreads &&
				getShownSubscribedThreads(viewMode).map((thread) => (
					<SubscribedThread
						key={`${thread.channel.id}/${thread.id}`}
						edit={edit}
						thread={thread}
						selected={isThreadPage(route) &&
							selectedThreadChannel.id === thread.channel.id &&
							selectedThread.id === thread.id}
					/>
				))
			}
			{hasMoreThreads && (hasMoreAliveThreads || viewMode === 'all') &&
				<div className="SubscribedThreads-showMoreLessContainer">
					<TextButton
						ref={showMoreLessButton}
						onClick={viewMode === 'alive-top' ? onShowMoreThreads : onShowLessThreads}
						className="SubscribedThreads-showMoreLess">
						{viewMode === 'alive-top' ? messages.subscribedThreads.showMore : messages.subscribedThreads.showLess}
					</TextButton>
				</div>
			}
			{hasExpiredThreads && (viewMode === 'alive' || (viewMode === 'alive-top' && !hasMoreAliveThreads)) &&
				<div className="SubscribedThreads-showMoreLessContainer">
					<TextButton
						ref={showExpiredThreadsButton}
						onClick={onShowMoreThreads}
						className="SubscribedThreads-showExpired">
						{messages.subscribedThreads.showExpired}
					</TextButton>
				</div>
			}
		</section>
	)
}

SubscribedThreads.propTypes = {
	edit: PropTypes.bool,
	maxListLength: PropTypes.number
}

interface SubscribedThreadsProps {
	edit?: boolean,
	maxListLength?: number
}

// // Don't re-render `<SubscribedThreads/>` on page navigation (on `route` change).
// SubscribedThreads = React.memo(SubscribedThreads)