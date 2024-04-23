import React, { useRef, useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { useSelectorForLocation } from 'react-pages'

import shouldMinimizeGeneratedPostLinkBlockQuotes from '../../utility/post/shouldMinimizeGeneratedPostLinkBlockQuotes.js'

import useMessages from '../../hooks/useMessages.js'
import useLocale from '../../hooks/useLocale.js'
import useBackground from '../../hooks/useBackground.js'

import InReplyToModal from '../../components/InReplyToModal.js'
import ShowPrevious from '../../components/ShowPrevious.js'

import ThreadCommentsList from './ThreadCommentsList.js'
import ThreadPageHeader from './ThreadPageHeader.js'
import ThreadCreateComment from './ThreadCreateComment.js'
import AutoUpdate from './AutoUpdate.js'
import InfoBanner from './InfoBanner.js'

import useFromIndex from './useFromIndex.js'
import useExpandAttachments from './useExpandAttachments.js'
import useThreadSubscribed from './useThreadSubscribed.js'
import useThreadNavigation from './useThreadNavigation.js'
import useSlideshow from './useSlideshow.js'
import useShowCommentOnSameThreadUrlNavigation from './useShowCommentOnSameThreadUrlNavigation.js'
import useGetCommentById from './useGetCommentById.js'
import useDownloadThread from './useDownloadThread.js'
import useUnreadCommentWatcher from './useUnreadCommentWatcher.js'
import useUpdateAttachmentThumbnailMaxWidth from './useUpdateAttachmentThumbnailMaxWidth.js'
import useGoToComment from './useGoToComment.js'
import useGoBackKeyboardControl from './useGoBackKeyboardControl.js'

import getThreadPageMeta from './Thread.meta.js'
import loadThreadPage from './Thread.load.js'

import useAutoUpdate from './useAutoUpdate.js'

import useReRenderCommentsByIds from './useReRenderCommentsByIds.js'

import GhostIcon from 'frontend-lib/icons/ghost-neutral-cross-eyes-mouth-tongue.svg'
import BoxIcon from 'frontend-lib/icons/box.svg'
import LockIcon from 'frontend-lib/icons/lock.svg'
import SinkingBoatIcon from '../../../assets/images/icons/sailing-boat-sinking.svg'

import './Thread.css'

export default function ThreadPage() {
	// Using `useSelectorForLocation()` instead of `useSelector()` here
	// as a workaround for cases when navigating from one thread
	// to another thread in order to prevent page state inconsistencies
	// while the current thread data is being updated in Redux
	// as the "next" page is being loaded.
	// https://github.com/4Catalyzer/found/issues/639#issuecomment-567084189
	// https://gitlab.com/catamphetamine/react-pages#same-route-navigation
	const channel = useSelectorForLocation(state => state.data.channel)
	const thread = useSelectorForLocation(state => state.data.thread)

	const locale = useLocale()
	const messages = useMessages()
	const background = useBackground()

	const unreadCommentWatcher = useUnreadCommentWatcher({ channel, thread })

	// "Expand attachments".
	const [areAttachmentsExpanded, setAttachmentsExpanded] = useExpandAttachments()

	// Update max attachment thumbnail width.
	useUpdateAttachmentThumbnailMaxWidth({
		comments: thread.comments
	})

	const [isThreadSubscribed, setThreadSubscribed] = useThreadSubscribed({
		thread
	})

	// First shown comment index.
	const {
		fromIndex,
		setNewFromIndex,
		setNewFromIndexPreservingScrollPosition,
		preserveScrollPositionOnPrependItems,
		isInitialFromIndex,
		initialLatestReadCommentIndex,
		initiallyShowCommentsFromTheLatestReadOne
	} = useFromIndex({
		thread,
		location
	})

	const autoUpdateElement = useRef()
	const getAutoUpdateTriggerElement = useCallback(() => autoUpdateElement.current, [])

	const autoUpdateParameters = useAutoUpdate({
		channelId: channel.id,
		threadId: thread.id,
		getTriggerElement: getAutoUpdateTriggerElement,
		autoStart: initiallyShowCommentsFromTheLatestReadOne && initialLatestReadCommentIndex === thread.comments.length - 1
	})

	// `autoUpdateParameters` are also used in "Reply" form
	// when posting a reply in a thread: `refreshThread()` function is used there.
	// But `refreshThread()` function doesn't influence the `render()` function result at all,
	// so to prevent `itemComponentProps` from needlessly changing
	// and needlessly causing the comments tree to re-render,
	// the `refreshThread()` function is passed via a "ref".
	const refreshThreadRef = useRef()
	refreshThreadRef.current = autoUpdateParameters.refreshThread

	const refreshThread = useCallback(async (refreshParameters) => {
		await refreshThreadRef.current(refreshParameters)
	}, [])

	const {
		openSlideshow
	} = useSlideshow({
		thread,
		fromIndex,
		setNewFromIndex
	})

	const shownComments = useMemo(
		() => thread.comments.slice(fromIndex),
		[thread, fromIndex]
	)

	useShowCommentOnSameThreadUrlNavigation({
		channel,
		thread,
		showComment: (commentId) => {
			const index = thread.comments.findIndex(_ => _.id === commentId)
			if (index >= 0) {
				setNewFromIndex(index)
			}
		}
	})

	const getCommentById = useGetCommentById({
		thread
	})

	const onDownloadThread = useDownloadThread({
		thread,
		getCommentById
	})

	const [
		threadNavigationHistory,
		onNavigateToComment,
		onGoBackInThreadNavigationHistory,
		isThreadHistoryModalShown,
		hideThreadHistoryModal
	] = useThreadNavigation({
		// `thread` object "reference" changes on every auto-update.
		// The `getCommentById()` function is implemented in such a way
		// that its "reference" doesn't change when `thread` object
		// "reference" changes. This is done so that `onNavigateToComment()`
		// function "reference" doesn't change too, because it's used in
		// `itemComponentProps`. Otherwise, `itemComponentProps` would change,
		// and then `<VirtualScroller/>` would re-render all comments on
		// thread auto-update (instead of updating just the comments that changed).
		getCommentById
	})

	// Returns `true` if the comment has been "previously read".
	// "Previously read" means that it has been read on the previous
	// view of this thread's page.
	const isPreviouslyRead = useCallback((commentId) => {
		// Don't mark comments as "previously read" when the user starts
		// looking through "previous comments" via "Show previous comments":
		// in that case, `isInitialFromIndex` will be `false`.
		if (initiallyShowCommentsFromTheLatestReadOne && isInitialFromIndex) {
			// Don't show the "original comment" as "previously read"
			// because it doesn't look pleasing.
			if (initialLatestReadCommentIndex === 0) {
				return false
			}
			// Because removed comments are retained during thread auto-update,
			// the initially loaded `thread` is fine for this function's logic,
			// even after the thread has been auto-updated, and there's a new
			// `thread` object with a new `comments` list.
			// And if it refreshes the reference to the `thread` object due to
			// some "dependency" change, then it'll also continue to behave correctly.
			return commentId <= thread.comments[initialLatestReadCommentIndex].id
		}
	}, [
		initiallyShowCommentsFromTheLatestReadOne,
		isInitialFromIndex,
		initialLatestReadCommentIndex
	])

	const onRequestShowCommentFromSameThread = useCallback(({
		commentId,
		fromCommentId
	}) => {
		onNavigateToComment(commentId, fromCommentId)
	}, [onNavigateToComment])

	// `renderComments()` is called whenever there's a "parent" comment
	// whose `content` did change (for example, when a YouTube video link got loaded),
	// and so such "parent" comment update should trigger a "re-render" of all comments
	// that quote this "parent" comment, because those quotes have been re-generated.
	// `renderComments(commentIds)` does that: re-renders descendant comments by their IDs.
	//
	// `renderComments(commentIds)` only works as intended when all of the `commentIds`
	// are currently rendered on the page. That might not be the case when using `virtual-scroller`.
	// But there seems to be no better solution, and in the particular case of using this
	// `renderComments(commentIds)` function for updating the replies of a comment who had
	// some of its "resource links" loaded (for example, by transforming YouTube hyperlinks
	// into embedded `video`s) it works in most of the cases because:
	// * "resource links" are loaded only the first time a comment gets rendered.
	// * The list of comments is always rendered top-to-bottom meaning that top comments
	//   always get initially rendered before any of the bottom comments.
	//
	// So even if there could be any hypothetical inconsistencies in measuring such
	// comments' heights, those cases would be extremely rare and the `virtual-scroller`
	// would restore its proper operation by simply re-measuring those comments and
	// printing a warning in the console.
	//
	const renderComments_ = useReRenderCommentsByIds({ shownComments })

	// `renderComments_()` function "reference" changes whenever a list of `shownComments` does.
	// But at the same time, `itemComponentProps` shouldn't change when not required,
	// and the case of `renderComments_()` function "reference" changing would be considered a
	// "not required" case because it doesn't affect the presentation at all.
	// To fix that, `renderComments` property is created in such a way that it doesn't ever change,
	// but at the same time `renderComments.currrent` function is always the latest `renderComments_` function.
	const renderComments = useRef()
	renderComments.current = renderComments_

	// `getThread()` is used when automatically subscribing to the thread when posting a comment in it.
	// See `useSubmitCommentOrThread()` hook for more info.
	//
	// `getThread` function reference shouldn't change between `thread` refreshes
	// in order for `itemComponentProps` reference to not change between `thread` refreshes.
	// Otherwise, `virtual-scroller` would re-render all visible items on thread refresh.
	//
	// In order to keep `getThread` reference the same while the `thread` object reference changes,
	// it is implemented using `useRef()` and `useCallback()` "hack".
	//
	const threadRef = useRef()
	threadRef.current = thread
	const getThread = useCallback(() => threadRef.current, [])

	const itemComponentProps = useMemo(() => ({
		getCommentById,
		getComponentProps() {
			return {
				getCommentById,
				mode: 'thread',
				channelId: channel.id,
				// Old cached board objects don't have a `.features` sub-object.
				// (Before early 2023).
				hasVoting: channel.features && channel.features.votes,
				channelIsNotSafeForWork: channel.notSafeForWork,
				canReply: true,
				// `thread.expired: true` flag is set on thread page by `<AutoUpdate/>`
				// when a thread expires during auto-update.
				threadExpired: thread.expired,
				threadIsArchived: thread.archived,
				threadIsLocked: thread.locked,
				threadIsTrimming: thread.trimming,
				threadId: thread.id,
				getThread,
				locale,
				messages,
				unreadCommentWatcher,
				expandGeneratedPostLinkBlockQuotes: !shouldMinimizeGeneratedPostLinkBlockQuotes(),
				expandAttachments: areAttachmentsExpanded,
				onRequestShowCommentFromSameThread,
				isPreviouslyRead,
				onDownloadThread,
				refreshThread,
				renderComments: renderComments.current,
				postDateLinkUpdatePageUrlToPostUrlOnClick: true,
				postDateLinkNavigateToPostUrlOnClick: false
			}
		}
	}), [
		// The dependencies list should be such that
		// comments aren't re-rendered when they don't need to.
		channel,
		getThread,
		thread.expired,
		thread.archived,
		thread.locked,
		thread.trimming,
		thread.id,
		areAttachmentsExpanded,
		getCommentById,
		isPreviouslyRead,
		onDownloadThread,
		locale,
		messages,
		unreadCommentWatcher,
		onNavigateToComment,
		refreshThread
	])

	// Go "back" to thread page on "Backspace".
	useGoBackKeyboardControl({ channelId: channel.id })

	const onGoToComment = useGoToComment({
		thread,
		setNewFromIndex
	})

	const onShowAll = useCallback(() => {
		setNewFromIndex(0)
	}, [
		setNewFromIndex
	])

	return (
		<section className={classNames('ThreadPage', 'Content', {
			'ThreadPage--onBackground': background
		})}>
			<ThreadPageHeader
				channel={channel}
				thread={thread}
				openSlideshow={openSlideshow}
				getCommentById={getCommentById}
				isThreadSubscribed={isThreadSubscribed}
				setThreadSubscribed={setThreadSubscribed}
				isSearchBarShown={false}
				setSearchBarShown={() => {}}
				areAttachmentsExpanded={areAttachmentsExpanded}
				setAttachmentsExpanded={setAttachmentsExpanded}
			/>

			{/* `.ThreadPage-aboveComments` is used to restore the default
			    `pointer-events: auto` behavior. */}
			<div className="ThreadPage-aboveComments">
				{fromIndex > 0 &&
					<ShowPrevious
						fromIndex={fromIndex}
						setFromIndex={setNewFromIndexPreservingScrollPosition}
						items={thread.comments}
						onShowAll={onShowAll}
					/>
				}
			</div>

			<div className="ThreadPage-commentsListContainer">
				<ThreadCommentsList
					thread={thread}
					shownComments={shownComments}
					itemComponentProps={itemComponentProps}
					getCommentById={getCommentById}
					preserveScrollPositionOnPrependItems={preserveScrollPositionOnPrependItems}
					className={classNames('ThreadPage-comments', {
						// 'ThreadPage-comments--fromTheStart': fromIndex === 0
					})}
				/>

				{/*noNewComments &&
					<p className="ThreadPage-noNewComments">
						{messages.noNewComments}
					</p>
				*/}

				<div className="ThreadPage-createCommentSpacer"/>

				<ThreadCreateComment
					getThread={getThread}
					channelId={channel.id}
					channelIsNotSafeForWork={channel.notSafeForWork}
					threadId={thread.id}
					refreshThread={refreshThread}
				/>
			</div>

			<div className="ThreadPage-belowCommentsWithEmptySpaceOnTheLeftSide">
				<div className="ThreadPage-belowCommentsWithEmptySpaceOnTheLeftSide-emptySpace"/>
				<div className="ThreadPage-belowCommentsWithEmptySpaceOnTheLeftSide-content">
					{!(thread.locked || thread.expired) &&
						<React.Fragment>
							<AutoUpdate
								ref={autoUpdateElement}
								{...autoUpdateParameters}
							/>
							{/*<PostForm autoFocus placement="page" onSubmit={onSubmitReply}/>*/}
							{thread.bumpLimitReached &&
								<InfoBanner
									Icon={SinkingBoatIcon}>
									{messages.threadBumpLimitReached}
								</InfoBanner>
							}
						</React.Fragment>
					}
					{thread.archived &&
						<InfoBanner
							Icon={BoxIcon}>
							{messages.threadIsArchived}
						</InfoBanner>
					}
					{!thread.archived && thread.locked &&
						<InfoBanner
							Icon={LockIcon}>
							{messages.threadIsLocked}
						</InfoBanner>
					}
					{thread.expired &&
						<InfoBanner
							Icon={GhostIcon}>
							{messages.threadExpired}
						</InfoBanner>
					}
				</div>
			</div>

			{/* `.ThreadPage-belowComments` is used to restore the default
			    `pointer-events: auto` behavior. */}
			<div className="ThreadPage-belowComments">
			</div>

			{threadNavigationHistory.length > 0 &&
				<InReplyToModal
					channel={channel}
					thread={thread}
					isOpen={isThreadHistoryModalShown}
					onClose={hideThreadHistoryModal}
					onGoBack={onGoBackInThreadNavigationHistory}
					history={threadNavigationHistory}
					onRequestShowCommentFromSameThread={onRequestShowCommentFromSameThread}
					onGoToComment={onGoToComment}
				/>
			}
		</section>
	)
}

ThreadPage.meta = getThreadPageMeta

ThreadPage.load = async ({
	useSelector,
	dispatch,
	location,
	params,
	context,
	navigationContext
}) => {
	await loadThreadPage({
		useSelector,
		dispatch,
		location,
		params,
		userData: context.userData,
		userSettings: context.userSettings,
		dataSource: context.dataSource,
		navigationContext
	})
}