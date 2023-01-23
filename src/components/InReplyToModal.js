import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'react-responsive-ui'
import classNames from 'classnames'

import Button from 'frontend-lib/components/Button.js'

import CloseIcon from 'frontend-lib/icons/close.svg'
import LeftArrow from 'frontend-lib/icons/left-arrow-minimal.svg'

import CommentTree from '../components/CommentTree.js'

import {
	comment as commentType,
	thread as threadType,
	channel as channelType
} from '../PropTypes.js'

import useMessages from '../hooks/useMessages.js'
import useLocale from '../hooks/useLocale.js'

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
}) {
	const historyEntry = history[history.length - 1]

	const comment = getCommentFromHistoryEntry(historyEntry)

	const dispatch = useDispatch()
	const messages = useMessages()
	const locale = useLocale()

	const onPostUrlClick = useCallback((event, post) => {
		onGoToComment(post)
		onClose()
	}, [onClose])

	const { initialState, setState } = useCommentTreeStateCache({
		historyEntry
	})

	const getCommentById = useGetCommentById({ thread })

	const channelId = channel.id

	const getComponentProps = useCallback(() => {
		return {
			// Don't set HTML `id` attribute on the comment DOM Element
			// because such comment element may already be rendered on the page
			// outside of the modal. To avoid setting an `id` attribute on the
			// comment DOM Element, `id={null}` property is passed.
			id: null,
			threadId: thread.id,
			channelId,
			locale,
			dispatch,
			onRequestShowCommentFromSameThread,
			onPostUrlClick,
			getCommentById,
			mode: 'thread',
			// Don't render `<Post/>` elements in "compact" mode.
			// That means a bit larger margins/paddings.
			compact: false
		}
	}, [
		thread,
		channelId,
		locale,
		dispatch,
		onRequestShowCommentFromSameThread,
		onPostUrlClick,
		getCommentById
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

				{/*
				Added `key` property so that the `<CommentTree/>` resets any possible
				internal state when the comment being shown changes.
				*/}
				<CommentTree
					key={comment.id}
					comment={comment}
					getComponentProps={getComponentProps}
					initialState={initialState}
					setState={setState}
					dialogueTraceStyle="side"
					postDateLinkUpdatePageUrlToPostUrlOnClick={true}
					postDateLinkNavigateToPostUrlOnClick={false}
				/>
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

function InReplyToModalBack({
	onClose,
	onGoBack,
	history
}) {
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
				{!isInitial &&
					<span className="InReplyToModalBackCounter">
						{history.length - 1}
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

function InReplyToModalClose({
	onClose,
	history
}) {
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

export const InReplyToModalCloseTimeout = 150

export function InReplyToModalScrollToTopAndFocus() {
	const modalScrollable = document.querySelector('.' + InReplyToModalOverlayClassName)
	if (modalScrollable) {
		modalScrollable.scrollTo(0, 0)
		// Focus the modal body, because otherwise the focus would be lost
		// and would move to `<body/>` because the link that has been clicked
		// is no longer rendered.
		// If the focus wasn't restored, closing the modal on Escape wouldn't work.
		modalScrollable.firstChild.focus()
	}
}

function useCommentTreeStateCache({ historyEntry }) {
	const setState = useCallback((state) => {
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

function getCommentFromHistoryEntry({ comment }) {
	return comment
}

function getCommentTreeStateFromHistoryEntry({ state }) {
	return state
}

function updateCommentTreeStateInHistoryEntry(entry, state) {
	entry.state = state
}