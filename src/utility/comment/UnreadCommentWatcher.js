import getUserData from '../../UserData.js'
import { latestReadComments } from '../../UserData/collections/index.js'
import onCommentRead from '../../utility/comment/onCommentRead.js'

export default class UnreadCommentWatcher {
	constructor({
		dispatch,
		getThread,
		channel,
		userData = getUserData(),
		hitBoxContraction
	}) {
		// Every modern browser except Internet Explorer supports `IntersectionObserver`s.
		// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
		// https://caniuse.com/#search=IntersectionObserver
		this.observer = new IntersectionObserver(this.createIntersectionHandler({ dispatch, getThread, channel, userData }), {
			// "rootMargin" option is incorrectly named.
			// In reality, it's "root area expansion".
			// Values order: top, right, bottom, left.
			rootMargin: '0px 0px 0px 0px'
		})
	}

	createIntersectionHandler({ dispatch, getThread, channel, userData }) {
		// Uses `dispatch`.
		return (entries, observer) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					const element = entry.target
					const mode = element.dataset.mode
					const channelId = element.dataset.channelId
					const threadId = Number(element.dataset.threadId)
					const commentId = Number(element.dataset.commentId)
					const commentIndex = Number(element.dataset.commentIndex)
					// const threadIsTrimming = element.dataset.threadIsTrimming === 'true'
					// const threadIsArchived = element.dataset.threadIsArchived === 'true'
					// const commentCreatedAt = parseInt(element.dataset.commentCreatedAt)
					// const commentUpdatedAt = parseInt(element.dataset.commentUpdatedAt)
					// const threadUpdatedAt = element.dataset.threadUpdatedAt && parseInt(element.dataset.threadUpdatedAt)
					this.onCommentVisible({
						mode,
						channelId,
						threadId,
						commentId,
						commentIndex,
						// threadIsTrimming,
						// threadIsArchived,
						dispatch,
						getThread,
						channel,
						userData
					})
					// No longer track the visibility of this comment.
					this.unwatch(element)
				}
			}
		}
	}

	onCommentVisible({
		mode,
		channelId,
		threadId,
		commentId,
		commentIndex,
		// threadIsTrimming,
		// threadIsArchived,
		dispatch,
		getThread,
		channel,
		userData
	}) {
		if (mode === 'thread') {
			// An extra `!isCommentRead()` check is added here,
			// so that it doesn't accidentally overwrite a later
			// "latest read comment id" if it's already written there.
			// (in case of some hypothetical "race condition", etc)
			// Because this function is triggered by an `IntersectionObserver`,
			// it's not clear whether those event callbacks are executed in any
			// particular order.
			if (!isCommentRead(channelId, threadId, commentId, { userData })) {
				onCommentRead({
					channelId,
					threadId,
					commentId,
					commentIndex,
					channel,
					thread: getThread(),
					userData,
					dispatch
				})
			}
		}

		// An extra `!isThreadSeen()` check is added here,
		// so that it doesn't accidentally overwrite a later
		// "latest seen thread id" if it's already written there.
		// (in case of some hypothetical "race condition", etc)
		// Because this function is triggered by an `IntersectionObserver`,
		// it's not clear whether those event callbacks are executed in any
		// particular order.
		if (mode === 'channel' || mode === 'thread') {
			if (!isThreadSeen(channelId, threadId, { userData })) {
				// Sets the latest seen thread id.
				userData.setLatestSeenThreadId(channelId, threadId)
			}
		}
	}

	watch(element) {
		if (!this.observer) {
			// The watcher has been stopped.
			return () => {}
		}
		this.observer.observe(element)
		return () => this.unwatch(element)
	}

	unwatch(element) {
		// If child components are unwatched in `componentWillUnmount()`,
		// then it happens after `componentWillUnmount()` of their parent
		// has been called, and if `UnreadCommentWatcher` was stopped in
		// `componentWillUnmount()` of their parent, then `this.observer`
		// is `undefined` at this stage.
		if (this.observer) {
			this.observer.unobserve(element)
		}
	}

	stop() {
		this.observer.disconnect()
		this.observer = undefined
	}
}

export function isCommentRead(channelId, threadId, commentId, { userData }) {
	const latestReadCommentId = userData.getLatestReadCommentId(channelId, threadId)
	if (latestReadCommentId) {
		// Latest read comment may have been deleted by a moderator.
		return latestReadCommentId >= commentId
	}
}

export function isThreadSeen(channelId, threadId, { userData }) {
	const latestSeenThreadId = userData.getLatestSeenThreadId(channelId)
	return latestSeenThreadId && latestSeenThreadId >= threadId
}