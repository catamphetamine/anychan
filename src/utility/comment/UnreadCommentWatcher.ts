import type { UserData, Channel, Thread, Comment, Mode } from '@/types'
import type { Dispatch } from 'redux'

import onCommentRead from './onCommentRead.js'

export default class UnreadCommentWatcher {
	private parameters: {
		dispatch: Dispatch;
		userData: UserData;
		channel: Channel;
		getThread: () => Thread;
	}

	private observer: IntersectionObserver

	private pendingWatchedElements: Element[]

	constructor(parameters: {
		dispatch: Dispatch,
		userData: UserData,
		channel: Channel,
		getThread: () => Thread
	}) {
		this.parameters = parameters
		this.pendingWatchedElements = []
	}

	start() {
		const {
			dispatch,
			getThread,
			channel,
			userData
		} = this.parameters

		// Every modern browser except Internet Explorer supports `IntersectionObserver`s.
		// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
		// https://caniuse.com/#search=IntersectionObserver
		this.observer = new IntersectionObserver(this.createIntersectionHandler({ dispatch, getThread, channel, userData }), {
			// "rootMargin" option is incorrectly named.
			// In reality, it's "root area expansion".
			// Values order: top, right, bottom, left.
			rootMargin: '0px 0px 0px 0px'
		})

		if (this.pendingWatchedElements.length > 0) {
			for (const pendingWatchedElement of this.pendingWatchedElements) {
				this.watch(pendingWatchedElement)
			}
			this.pendingWatchedElements = []
		}
	}

	stop() {
		if (!this.observer) {
			console.error('`UnreadCommentWatcher` has already been stopped')
			return
		}
		this.observer.disconnect()
		this.observer = undefined
	}

	createIntersectionHandler({
		dispatch,
		userData,
		channel,
		getThread,
	}: {
		dispatch: Dispatch,
		userData: UserData,
		channel: Channel,
		getThread: () => Thread
	}) {
		// Uses `dispatch`.
		return (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					const element = entry.target
					// Added `instanceof` here to work around TypeScript error:
					// "Property 'dataset' does not exists on type 'Element'".
					if (element instanceof HTMLElement) {
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

						// Fixes TypeScript error.
						if (!(mode === 'channel' || mode === 'thread')) {
							throw new Error(`Expected \`mode\` to be either "channel" or "thread"`)
						}

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
		userData,
		channel,
		getThread
	}: {
		mode: Mode,
		channelId: Channel['id'],
		threadId: Thread['id'],
		commentId: Comment['id'],
		commentIndex: number,
		dispatch: Dispatch,
		userData: UserData,
		channel: Channel,
		getThread: () => Thread
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

	watch(element: Element) {
		if (!this.observer) {
			this.pendingWatchedElements.push(element)
			// The watcher has been stopped.
			return () => {
				const isStillPendingToBeWatched = this.pendingWatchedElements.includes(element)
				if (isStillPendingToBeWatched) {
					this.pendingWatchedElements = this.pendingWatchedElements.filter(_ => _ !== element)
				} else {
					this.unwatch(element)
				}
			}
		}
		this.observer.observe(element)
		return () => {
			this.unwatch(element)
		}
	}

	unwatch(element: Element) {
		// `UnreadCommentWatcher` instance is usually created in React components
		// in a `useMemo()` hook, and then it gets `.start()`-ed and `.stop()`-ped
		// in a `useEffect()` hook.
		// Suppose an `unreadCommentWatcher` has been `.start()`-ed and then
		// the `.watch()` method gets called on some Elements.
		// After that, the React subtree gets unmounted (for example, during navigation)
		// and React "effects" are being cleaned up.
		// In that case, parent "effects" will cle cleaned up before child ones.
		// So by the time a child calls `.unwatch()` as part of their effects clean-up,
		// the parent has already called `.stop()` which has set `this.observer` to `undefined`.
		// Hence the `if (this.observer)` check.
		// An example of a parent-child relationship would be
		// `useUnreadCommentWatcher()` hook and `<CommentReadStatusWatcher/>` child element.
		if (this.observer) {
			this.observer.unobserve(element)
		}
	}
}

export function isCommentRead(
	channelId: Channel['id'],
	threadId: Thread['id'],
	commentId: Comment['id'],
	{ userData }: { userData: UserData }
) {
	const latestReadCommentId = userData.getLatestReadCommentId(channelId, threadId)
	if (latestReadCommentId) {
		// Latest read comment may have been deleted by a moderator.
		return latestReadCommentId >= commentId
	}
}

export function isThreadSeen(
	channelId: Channel['id'],
	threadId: Thread['id'],
	{ userData }: { userData: UserData }
) {
	const latestSeenThreadId = userData.getLatestSeenThreadId(channelId)
	return latestSeenThreadId && latestSeenThreadId >= threadId
}