import type { CommentId, Channel, Thread, Comment, ThreadNavigationHistory, CommentTreeItemState } from '@/types'

import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

// @ts-expect-error
import { Modal } from 'react-responsive-ui'

import Button from 'frontend-lib/components/Button.js'

import CloseIcon from 'frontend-lib/icons/close.svg'
import LeftArrow from 'frontend-lib/icons/left-arrow-minimal.svg'

import CommentTreeBranch from './CommentTreeBranch.js'

import {
	comment as commentType,
	thread as threadType,
	channel as channelType
} from '../PropTypes.js'

import useLocale from '../hooks/useLocale.js'
import useMessages from '../hooks/useMessages.js'

import useGetCommentById from '../pages/Thread/useGetCommentById.js'

import './InReplyToModal.css'

const InReplyToModalOverlayClassName = 'InReplyToModalOverlay'

export default function InReplyToModal({
	channel,
	thread,
	history,
	isOpen,
	onClose,
	onRequestShowCommentFromSameThread,
	onGoToComment,
	onGoBack
}: InReplyToModalProps) {
	const historyEntry = history[history.length - 1]

	const comment = getCommentFromHistoryEntry(historyEntry)

	const locale = useLocale()
	const messages = useMessages()

	const onPostUrlClick = useCallback((event: Event, post: Comment) => {
		onGoToComment(post)
		onClose()
	}, [onClose])

	const { initialState, setState } = useCommentTreeStateCache({
		historyEntry
	})

	const getCommentById = useGetCommentById({ thread })

	const channelId = channel.id

	const getThread = useCallback(() => thread, [thread])

	const getComponentProps = useCallback(() => {
		return {
			// Don't set HTML `id` attribute on the comment DOM Element
			// because such comment element may already be rendered on the page
			// outside of the modal. To avoid setting an `id` attribute on the
			// comment DOM Element, `id={null}` property is passed.
			id: null,
			getThread,
			threadId: thread.id,
			channelId,
			onRequestShowCommentFromSameThread,
			onPostUrlClick,
			mode: 'thread',
			locale,
			messages,
			// Don't render `<Post/>` elements in "compact" mode.
			// That means a bit larger margins/paddings.
			compact: false,
			// Deactivate the hyperlink on post date.
			postDateLinkUpdatePageUrlToPostUrlOnClick: true,
			postDateLinkNavigateToPostUrlOnClick: false
		}
	}, [
		thread,
		getThread,
		channelId,
		onRequestShowCommentFromSameThread,
		onPostUrlClick,
		locale,
		messages
	])

	// `overlayClassName` is used in `Thread.js`
	// to get `document.querySelector('.InReplyToModalOverlay')`.
	// // `shouldReturnFocusAfterClose` is `false` because otherwise
	// // it would focus on the `post-link` after the modal is closed
	// // and that could sometimes result in scroll position jumping.
	return (
		<Modal
			isOpen={isOpen}
			close={onClose}
			aria-label={messages.inReplyTo}
			closeLabel={messages.actions.close}
			closeTimeout={InReplyToModalCloseTimeout}
			className="InReplyToModal"
			overlayClassName={InReplyToModalOverlayClassName}>

			<Modal.Content>
				{/*
				<div className="InReplyToModalHeader">
					<InReplyToModalBack
						history={history}
						onClose={onClose}
						onGoBack={onGoBack}
					/>
					<InReplyToModalClose
						history={history}
						onClose={onClose}
					/>
				</div>
				*/}

				{/*
				Added `key` property so that the `<CommentTree/>` resets any possible
				internal state when the comment being shown changes.
				*/}
				<CommentTreeBranch
					key={comment.id}
					comment={comment}
					getComponentProps={getComponentProps}
					initialState={initialState}
					setState={setState}
					dialogueTraceStyle="sideways"
					getCommentById={getCommentById}
				/>

				<div className="InReplyToModal-actions">
					<InReplyToModalBack
						history={history}
						onClose={onClose}
						onGoBack={onGoBack}
					/>

					<Button
						className="InReplyToModalClose"
						onClick={onClose}>
						<span className="InReplyToModalCloseText">
							{messages.actions.close}
						</span>
					</Button>
				</div>
			</Modal.Content>
		</Modal>
	)
}

const historyEntryType = PropTypes.shape({
	comment: commentType.isRequired,
	state: PropTypes.object
})

InReplyToModal.propTypes = {
	channel: channelType.isRequired,
	thread: threadType.isRequired,
	history: PropTypes.arrayOf(historyEntryType).isRequired,
	isOpen: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	onRequestShowCommentFromSameThread: PropTypes.func.isRequired,
	onGoToComment: PropTypes.func
}

interface InReplyToModalProps {
	channel: Channel,
	thread: Thread,
	history: ThreadNavigationHistory,
	isOpen?: boolean,
	onClose: () => void,
	onRequestShowCommentFromSameThread: (parameters: {
		commentId: CommentId,
		fromCommentId: CommentId
	}) => void,
	onGoToComment: (comment: Comment) => void,
	onGoBack: () => void
}

function InReplyToModalBack({
	onClose,
	onGoBack,
	history
}: InReplyToModalBackProps) {
	const messages = useMessages()

	const isInitial = history.length === 2
	if (isInitial) {
		return null
	}

	return (
		<Button
			onClick={isInitial ? onClose : onGoBack}
			className="InReplyToModalBack">
			<LeftArrow className="InReplyToModalBackIcon"/>
			<span className="InReplyToModalBackText">
				{!isInitial && history.length > 3 &&
					<span className="InReplyToModalBackCounter">
						{history.length - 2}
					</span>
				}
				{messages.actions.back}
			</span>
		</Button>
	)
}

InReplyToModalBack.propTypes = {
	onClose: PropTypes.func.isRequired,
	onGoBack: PropTypes.func.isRequired,
	history: PropTypes.arrayOf(historyEntryType).isRequired
}

interface InReplyToModalBackProps {
	onClose: () => void,
	onGoBack: () => void,
	history: ThreadNavigationHistory
}

function InReplyToModalClose({
	onClose,
	history
}: InReplyToModalCloseProps) {
	const messages = useMessages()

	const isInitial = history.length === 2
	if (!isInitial) {
		return null
	}

	return (
		<Button
			onClick={onClose}
			className="InReplyToModalClose">
			<CloseIcon className="InReplyToModalCloseIcon"/>
			<span className="InReplyToModalCloseText">
				{messages.actions.close}
			</span>
		</Button>
	)
}

InReplyToModalClose.propTypes = {
	onClose: PropTypes.func.isRequired,
	history: PropTypes.arrayOf(historyEntryType).isRequired
}

interface InReplyToModalCloseProps {
	onClose: () => void,
	history: ThreadNavigationHistory
}

export const InReplyToModalCloseTimeout = 150

export function InReplyToModalScrollToTopAndFocus() {
	const modalScrollable = document.querySelector('.' + InReplyToModalOverlayClassName)
	if (modalScrollable) {
		modalScrollable.scrollTo(0, 0);
		// Focus the modal body, because otherwise the focus would be lost
		// and would move to `<body/>` because the link that has been clicked
		// is no longer rendered.
		// If the focus wasn't restored, closing the modal on Escape wouldn't work.
		(modalScrollable.firstChild as HTMLElement).focus()
	}
}

function useCommentTreeStateCache({ historyEntry }: { historyEntry: ThreadNavigationHistory[number] }) {
	const setState = useCallback((state: CommentTreeItemState) => {
		updateCommentTreeStateInHistoryEntry(historyEntry, state)
	}, [historyEntry])

	const getState = useCallback(() => {
		return getCommentTreeStateFromHistoryEntry(historyEntry)
	}, [historyEntry])

	const initialState = useMemo(() => getState(), [])

	return {
		// state: getState(),
		initialState,
		setState
	}
}

function getCommentFromHistoryEntry({ comment }: { comment: Comment }) {
	return comment
}

function getCommentTreeStateFromHistoryEntry({ state }: ThreadNavigationHistory[number]) {
	return state
}

function updateCommentTreeStateInHistoryEntry(entry: ThreadNavigationHistory[number], state: ThreadNavigationHistory[number]['state']) {
	entry.state = state
}