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

import './InReplyToModal.css'

const InReplyToModalOverlayClassName = 'InReplyToModalOverlay'

export default function InReplyToModal({
	channel,
	thread,
	history,
	isOpen,
	onClose,
	onShowComment,
	onGoToComment,
	onGoBack
}) {
	const comment = history[history.length - 1]

	const dispatch = useDispatch()
	const messages = useMessages()
	const locale = useLocale()

	const onPostUrlClick = useCallback((event, post) => {
		onGoToComment(post)
		onClose()
	}, [onClose])

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
						onGoBack={onGoBack}/>
					<InReplyToModalClose
						history={history}
						onClose={onClose}/>
				</div>
				{/*
				Don't preserve comment tree state when navigating to
				the next quoted comment: `key` is used for that.
				Also, don't set HTML `id` attribute because such comment
				may already be rendered on the page: `id={null}` is used for that.
				*/}
				<CommentTree
					key={comment.id}
					id={null}
					comment={comment}
					threadId={thread.id}
					channelId={channel.id}
					locale={locale}
					dispatch={dispatch}
					onShowComment={onShowComment}
					onPostUrlClick={onPostUrlClick}
					dialogueChainStyle="side"
					mode="thread"
					compact={false}/>
			</Modal.Content>
		</Modal>
	)
}

InReplyToModal.propTypes = {
	channel: channelType.isRequired,
	thread: threadType.isRequired,
	history: PropTypes.arrayOf(commentType).isRequired,
	isOpen: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	onShowComment: PropTypes.func.isRequired,
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
	history: PropTypes.arrayOf(commentType).isRequired
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
	history: PropTypes.arrayOf(commentType).isRequired
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