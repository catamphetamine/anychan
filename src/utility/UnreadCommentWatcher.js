import { readComment } from '../redux/data'

import UserData from '../UserData/UserData'
import onUserDataChange from '../UserData/onUserDataChange'

export default class UnreadCommentWatcher {
	constructor({ dispatch, hitBoxContraction }) {
		// Every modern browser except Internet Explorer supports `IntersectionObserver`s.
		// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
		// https://caniuse.com/#search=IntersectionObserver
		this.observer = new IntersectionObserver(this.createIntersectionHandler({ dispatch }), {
			// "rootMargin" option is incorrectly named.
			// In reality, it's "root area expansion".
			// Values order: top, right, bottom, left.
			rootMargin: '0px 0px 0px 0px'
		})
	}

	createIntersectionHandler({ dispatch }) {
		// Uses `dispatch`.
		return (entries, observer) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					const element = entry.target
					const mode = element.dataset.mode
					const channelId = element.dataset.channelId
					const threadId = parseInt(element.dataset.threadId)
					const commentId = parseInt(element.dataset.commentId)
					const commentIndex = parseInt(element.dataset.commentIndex)
					// const commentCreatedAt = parseInt(element.dataset.commentCreatedAt)
					// const commentUpdatedAt = parseInt(element.dataset.commentUpdatedAt)
					// const threadUpdatedAt = element.dataset.threadUpdatedAt && parseInt(element.dataset.threadUpdatedAt)
					this.onCommentVisible({
						mode,
						channelId,
						threadId,
						commentId,
						commentIndex,
						dispatch
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
		dispatch
	}) {
		// If some later comment has already been marked as read
		// then don't overwrite it in the "latest read comment id",
		// hence the `!isCommentRead()` check.
		// Some later comment could have been marked as read,
		// for example, if a user somehow managed to scroll to bottom
		// without scrolling through previous comments.
		// Or maybe the user already read some later comment
		// in another tab.
		if (mode === 'thread') {
			if (!isCommentRead(channelId, threadId, commentId)) {
				// Sets the latest read comment id.
				UserData.addLatestReadComments(channelId, threadId, {
					id: commentId,
					i: commentIndex,
					// createdAt: commentCreatedAt,
					// updatedAt: commentUpdatedAt,
					// threadUpdatedAt: threadUpdatedAt
				})
				// Since the user is already viewing this thread, the "new comments"
				// counter for this thread won't be shown in the  Sidebar,
				// because that would create unnecessary visual "noise".
				// So there's no need to update such counter here.
				// // Update "new comments" counter for this thread in tracked threads
				// // list in Sidebar.
				// if (UserData.isTrackedThread(channelId, threadId)) {
				// 	onUserDataChange(UserData.prefix + 'latestReadComments', dispatch)
				// }
				// Mark the comment as "read".
				// console.log('Comment read:', commentId, 'from', '/' + channelId + '/' + threadId)
				dispatch(readComment({
					channelId,
					threadId,
					commentId,
					commentIndex
				}))
			}
		}
		// The same extra `!isThreadSeen()` condition is added for threads here,
		// so that the "latest seen thread id" is not overwritten if a later
		// thread has already been "seen" somehow.
		// Mark the thread as seen both in "channel" mode and "thread" mode.
		if (mode === 'channel' || mode === 'thread') {
			if (!isThreadSeen(channelId, threadId)) {
				// Sets the latest seen thread id.
				UserData.addLatestSeenThreads(channelId, threadId)
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

export function isCommentRead(channelId, threadId, commentId) {
	const latestReadCommentInfo = UserData.getLatestReadComment(channelId, threadId)
	if (latestReadCommentInfo) {
		return latestReadCommentInfo.id >= commentId
	}
}

export function isThreadSeen(channelId, threadId) {
	const latestSeenThreadId = UserData.getLatestSeenThread(channelId)
	return latestSeenThreadId && latestSeenThreadId >= threadId
}