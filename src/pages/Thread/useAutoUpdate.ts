import type { Channel, Thread, RefreshParameters } from '@/types'

import { useRef, useEffect, useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'
import useIsMounted from 'frontend-lib/hooks/useIsMounted.js'

import useSelector from '../../hooks/useSelector.js'
import useLocale from '../../hooks/useLocale.js'
import useMessages from '../../hooks/useMessages.js'
import useUserData from '../../hooks/useUserData.js'
import useSetting from '../../hooks/useSetting.js'
import useSettings from '../../hooks/useSettings.js'
import useDataSource from '../../hooks/useDataSource.js'
import usePageStateSelector from '../../hooks/usePageStateSelector.js'

import getThread from '../../utility/thread/getThread.js'

import {
	markCurrentThreadAsExpired,
	resetAutoUpdateNewCommentsIndication
} from '../../redux/thread.js'

import getNextUpdateAtForThread from '../../utility/thread/getNextUpdateAtForThread.js'
import onThreadFetched from '../../utility/thread/onThreadFetched.js'
import onThreadExpired from '../../utility/thread/onThreadExpired.js'
import useOriginalDomain from '@/hooks/useOriginalDomain.js'

const THREAD_FETCH_REQUESTED_BY = 'auto-update'
const CONCURRENT_THREAD_UPDATE_WAIT_INTERVAL = 500

interface Parameters {
	channelId: Channel['id'];
	threadId: Thread['id'];
	getTriggerElement: () => Element;
	autoStart: boolean;
}

// Thread page "auto-update" feature:
//
// * Replaces `thread` object on every refresh.
//   That's just to trigger a re-render of the thread page
//
// * Replaces `comment` objects when those get new replies.
//   That's just to trigger a re-render of the relevant comment elements
//   to update their replies count number, and, in case their replies are
//   currently expanded, to re-render the tree of their replies.
//
export default function useAutoUpdate({
	channelId,
	threadId,
	getTriggerElement,
	autoStart
}: Parameters) {
	const isMounted = useIsMounted()

	const thread = usePageStateSelector('thread', state => state.thread.thread)
	const threadIsBeingRefreshed = usePageStateSelector('thread', state => state.thread.threadIsBeingRefreshed)
	const threadBeingFetched = usePageStateSelector('thread', state => state.thread.threadBeingFetched)
	const threadFetchedAt = usePageStateSelector('thread', state => state.thread.threadFetchedAt)
	const threadFetchedBy = usePageStateSelector('thread', state => state.thread.threadFetchedBy)

	const isAnyoneFetchingOrRefreshingSomeThread = threadBeingFetched || threadIsBeingRefreshed

	const isAnyoneRefreshingThisThread = (
		threadIsBeingRefreshed &&
		thread &&
		thread.id === threadId &&
		thread.channelId === channelId
	)

	const isAnyoneFetchingThisThread = (
		threadBeingFetched &&
		threadBeingFetched.channelId === channelId &&
		threadBeingFetched.threadId === threadId
	)

	const isAnyoneFetchingOrRefreshingThisThread = isAnyoneRefreshingThisThread || isAnyoneFetchingThisThread

	// const isAnyoneFetchingOrRefreshingAnotherThread = isAnyoneFetchingOrRefreshingSomeThread && !isAnyoneFetchingOrRefreshingThisThread

	const isStarted = useRef<boolean>()
	const isUpdating = useRef<boolean>()
	const latestKnownThreadObject = useRef(thread)

	const triggerElementScrolledToObserver = useRef<IntersectionObserver>()
	const autoUpdateTimer = useRef<number>()
	const autoUpdateSecondsLeftTimer = useRef<number>()
	const concurrentThreadUpdateWaitTimer = useRef<number>()

	const getNextUpdateAt = useCallback((prevUpdateAt: number) => {
		const latestComment = thread.comments[thread.comments.length - 1]
		let beforeLatestComment
		if (thread.comments.length > 1) {
			beforeLatestComment = thread.comments[thread.comments.length - 2]
		}
		return getNextUpdateAtForThread(prevUpdateAt, {
			latestCommentDate: latestComment.createdAt,
			beforeLatestCommentDate: beforeLatestComment && beforeLatestComment.createdAt
		})
	}, [
		thread
	])

	// `_isUpdating` variable is currently not used anywhere.
	// Instead, `isUpdating.current` is used.
	// Therefore, `setUpdating()` function is only used to trigger a re-render.
	const [_isUpdating, setUpdating] = useState<boolean>(isUpdating.current)
	const [isExpired, setExpired] = useState<boolean>(thread && thread.expired)
	const [isLocked, setLocked] = useState<boolean>(thread && thread.locked)
	const [isError, setErrored] = useState<boolean>(false)
	const [nextUpdateAt, setNextUpdateAt] = useState<number>()
	const [secondsLeft, setSecondsLeft] = useState<number>()

	// The auto-update function can't call `refreshThread()` function directly
	// to avoid a "circular dependency", so it's worked around using an "effect".
	const [refreshThreadOnTimeRequest, setRefreshThreadOnTimeRequest] = useState<{}>()

	// The auto-update function is updated on every re-render.
	// `refreshThread()` function is returned to the "outside world"
	// where there're no guarantees on how it might get called:
	// maybe in a callback, maybe in a `setTimeout()`, maybe after an `await`.
	// In all those cases, it would've been potentially stale, so instead of
	// returning the `refreshThread()` function directly, it is exposed via a
	// "request thread update" function.
	const [refreshThreadOnDemandRequest, setRefreshThreadOnDemandRequest] = useState<{ refreshParameters: RefreshParameters }>()

	const channels = useSelector(state => state.channels.channels)

	const censoredWords = useSetting(settings => settings.censoredWords)
	const grammarCorrection = useSetting(settings => settings.grammarCorrection)

	const userData = useUserData()
	const userSettings = useSettings()
	const dataSource = useDataSource()
	const dispatch = useDispatch()
	const messages = useMessages()
	const locale = useLocale()
	const originalDomain = useOriginalDomain()

	useEffectSkipMount(() => {
		// Whenever the thread is re-fetched.
		if (latestKnownThreadObject.current !== thread) {
			log('has detected that thread has been re-fetched')
			// Check if the thread was re-fetched externally.
			if (threadFetchedBy !== THREAD_FETCH_REQUESTED_BY) {
				log('thread has been fetched by someone else')
				// If the auto-update process hasn't been started yet,
				// it doesn't care if the thread was re-fetched externally.
				// If the auto-update process has ended, same thing.
				// So only handle the cases when the auto-update process is running.
				if (isStarted.current) {
					// If the "auto-update" process is already running, don't intervene:
					// it will re-run `scheduleNextUpdate()` by itself at the end.
					log('thread has been fetched by someone else - recalculate next refresh time')
					if (!isUpdating.current) {
						// Re-run `scheduleNextUpdate()` function.
						scheduleNextUpdate(threadFetchedAt)
					}
				}
			}
			latestKnownThreadObject.current = thread
		}
	}, [thread])

	const updateSecondsLeft = useCallback((nextUpdateAt: number) => {
		const secondsLeftResult = getSecondsLeft(nextUpdateAt - Date.now())
		if (secondsLeftResult) {
			const { secondsLeft, timeToNextSecondsLeft } = secondsLeftResult
			setSecondsLeft(secondsLeft)
			if (timeToNextSecondsLeft) {
				autoUpdateSecondsLeftTimer.current = setTimeout(
					() => {
						updateSecondsLeft(nextUpdateAt)
					},
					timeToNextSecondsLeft
				)
			}
		}
	}, [
		setSecondsLeft
	])

	const scheduleNextUpdate = useCallback((prevUpdateAt: number) => {
		log('refresh - schedule')

		const nextUpdateAt = getNextUpdateAt(prevUpdateAt)
		const nextUpdateIn = Math.max(nextUpdateAt - Date.now(), 0)

		// Just a precaution against `setTimeout()` entering an infinite cycle.
		// In case someone tampers with the code in some future.
		// Normally, `nextUpdateAt` number is always returned.
		if (isNaN(nextUpdateAt)) {
			throw new Error('Auto-Update next update time unknown')
		}

		log('refresh - scheduled in', Math.round(nextUpdateIn / 1000), 'sec')

		clearTimeout(autoUpdateSecondsLeftTimer.current)
		clearTimeout(autoUpdateTimer.current)

		autoUpdateTimer.current = setTimeout(() => {
			log('auto-update timer triggered')
			if (!isMounted()) {
				log('not mounted — exit')
				return
			}
			// Using a "set state" function here instead of calling `refreshThread()` directly
			// works around a "circular dependency" between `refreshThread()` and `scheduleNextUpdate()`.
			// Otherwise, it wouldn't be clear how to declare these two functions using `useCallback()` hooks
			// because one would require another.
			setRefreshThreadOnTimeRequest({})
		}, nextUpdateIn)

		setNextUpdateAt(nextUpdateAt)
		updateSecondsLeft(nextUpdateAt)
	}, [
		getNextUpdateAt,
		setNextUpdateAt,
		updateSecondsLeft,
		setRefreshThreadOnTimeRequest,
		isMounted
	])

	const activateTriggerElement = useCallback(() => {
		log('auto-update start on-scroll-to trigger element - activate')
		if (!isMounted()) {
			log('auto-update start on-scroll-to trigger element — not activated because the parent component is unmounted')
			return
		}
		// There could be no trigger element rendered at all.
		// For example, when navigating to a "locked" thread,
		// no "auto update on-scroll-to trigger element" is rendered
		// because there'll be no new comments due to the thread being locked.
		// Analogous, a thread could become "locked" during the process of auto-update
		// so this function should check for the trigger element's existence
		// in order to be "safe" to call.
		if (!getTriggerElement()) {
			log('auto-update start on-scroll-to trigger element — not found')
			return
		}
		// Can't really happen. Added this `if` only because TypeScript showed an error.
		if (!triggerElementScrolledToObserver.current) {
			log('[not possible] auto-update start on-scroll-to trigger element scrolled-to observer — not found')
			return
		}
		// Will start thread auto update when the element becomes visible on screen.
		triggerElementScrolledToObserver.current.observe(getTriggerElement())
	}, [
		getTriggerElement,
		isMounted
	])

	const deactivateTriggerElement = useCallback((element: Element) => {
		log('auto-update start on-scroll-to trigger element - deactivate')
		if (!element) {
			log('auto-update start on-scroll-to trigger element — not found')
			return
		}
		// No longer track the visibility of the auto update "trigger element".
		triggerElementScrolledToObserver.current.unobserve(element)
		// // Could use `.unobserve()` instead of `.disconnect()`, but because
		// // in React 17, effect cleanup functions run "asynchronously",
		// // `node.current` is `null` by the time this function is called
		// // from the cleanup function returned from `useEffect()`.
		// // https://github.com/facebook/react/issues/20555
		// // https://reactjs.org/blog/2020/08/10/react-v17-rc.html#potential-issues
		// // So, using `.disconnect()` seems a simpler way.
		// // Could still use `.unobserve()`, in which case `node.current`
		// // would have to be replaced by an "element" attribute here.
		// triggerElementScrolledToObserver.current.disconnect()
	}, [])

	// `thread` object reference changes every time the thread is refreshed.
	// When there're new comments, the old `thread` object doesn't know about
	// those because a new `thread` object is created with the new comments.
	// `startAutoUpdate()` function is used in a callback of `IntersectionObserver`,
	// and that is configured once when the observer instance is created,
	// meaning that `startAutoUpdate()` function reference can't change,
	// so it shouldn't declare any "dependencies" when declared via `useCallback()`.
	// But, `startAutoUpdate()` function depends on `scheduleNextUpdate()`,
	// and `scheduleNextUpdate()` depends on the latest `thread.comments`.
	// So how could `startAutoUpdate()` be written in such a way that it always
	// has the latest reference to the up-to-date `scheduleNextUpdate()` function?
	// The workaround is using `useRef()` and then `scheduleNextUpdate.current()`.
	const scheduleNextUpdateRef = useRef<() => void>()
	scheduleNextUpdateRef.current = () => scheduleNextUpdate(threadFetchedAt)

	// `startAutoUpdate()` dependencies list is empty
	// because it's used in `useEffect()`, so it should be a constant.
	const startAutoUpdate = useCallback(() => {
		if (isStarted.current) {
			log('auto-update process has already been started')
			return
		}
		isStarted.current = true
		log('start auto-update process')
		// The `<AutoUpdate/>` element is visible:
		// schedule a thread update, and "unobserve" the `<AutoUpdate/>` element.
		scheduleNextUpdateRef.current()
		// If there were any more "entries", then don't process them.
		// Could there be any? I didn't check.
		// I guess, an "entry" is something like an "obervation event",
		// in which case there could be more.
	}, [])

	// `stopAutoUpdate()` dependencies list is empty
	// because it's used in `useEffect()`, so it should be a constant.
	const stopAutoUpdate = useCallback(() => {
		if (!isStarted.current) {
			log('auto-update process has already been stopped')
			return
		}
		log('stop auto-update process')
		isStarted.current = false
		clearTimeout(autoUpdateTimer.current)
		clearTimeout(autoUpdateSecondsLeftTimer.current)
		clearTimeout(concurrentThreadUpdateWaitTimer.current)
	}, [])

	const onThreadHasExpired = useCallback(() => {
		log('thread expired')
		// If Auto-Update is running, stop it.
		if (isStarted.current) {
			stopAutoUpdate()
		}
		if (isMounted()) {
			// Clear the expired thread from user data.
			setExpired(true)
		}
		dispatch(markCurrentThreadAsExpired())
		onThreadExpired(
			thread.channelId,
			thread.id,
			{ dispatch, userData }
		)
	}, [
		stopAutoUpdate,
		isMounted,
		thread,
		userData,
		dispatch
	])

	// `refreshThread()` function is called by:
	//
	// * The code in this file recursively in a cycle,
	//   if it has been started and hasn't been stopped.
	//
	// * On demand by the code in this file.
	//   For example, when the user clicks on the `<AutoUpdate/>` element,
	//   or when the auto-update process has just started.
	//
	// * On demand by any other external code.
	//   For example, by `<PostForm/>`
	//   after a new comment has been sent to the thread..
	//
	// Therefore, when making any assumptions, `refreshThread()` code
	// should assume any of those two cases.
	//
	// Also, there's no point in writing this function using `useCallback()`
	// because it's not passed as a property anywhere.
	//
	const refreshThread = (refreshParameters: RefreshParameters) => {
		log('refreshing thread')

		// If the user is currently navigating to another thread,
		// performing a refresh of the currently displayed thread
		// would overwrite the navigate-to thread's data in Redux state
		// resulting in a weird effect: the URL would point to the new page
		// but the content would be from the old page. Not to mention any possible bugs.
		//
		// To work around that, the refresh thread request gets delayed
		// until the navigate-to thread's data has been loaded,
		// and then it checks whether the new thread data is in Redux state:
		// * If it is, it means that the user has navigated to a different thread
		//   so this pending "refresh thread" call should be dismissed.
		// * If it isn't and the "old" thread data is still in Redux state
		//   then it means that the navigate-to thread couldn't be loaded for some reason
		//   and the user is still on the "old" thread page, so the pending
		//   "refresh thread" call should be executed.
		//
		if (isAnyoneFetchingOrRefreshingSomeThread) {
			log('concurrent thread fetch or refresh detected — wait')
			clearTimeout(concurrentThreadUpdateWaitTimer.current)
			concurrentThreadUpdateWaitTimer.current = setTimeout(
				() => {
					refreshThread(refreshParameters)
				},
				CONCURRENT_THREAD_UPDATE_WAIT_INTERVAL
			)
			if (refreshParameters && refreshParameters.onRefreshDelayed) {
				refreshParameters.onRefreshDelayed(CONCURRENT_THREAD_UPDATE_WAIT_INTERVAL)
			}
			return
		}

		const isStillThatThreadPage = thread && thread.id === threadId && thread.channelId === channelId
		if (!isStillThatThreadPage) {
			log('no longer at that thread page — won\'t refresh that thread')
			if (isStarted.current) {
				stopAutoUpdate()
			}
			if (refreshParameters && refreshParameters.onRefreshCancelled) {
				refreshParameters.onRefreshCancelled()
			}
			return
		}

		clearTimeout(autoUpdateTimer.current)
		clearTimeout(autoUpdateSecondsLeftTimer.current)

		// Refreshs the thread.
		// Returns a `resultCode: string`.
		const updateThread = async () => {
			try {
				const previousLatestComment = thread.comments[thread.comments.length - 1]

				const { thread: updatedThread } = await getThread(
					thread.channelId,
					thread.id,
					{
						requestedBy: THREAD_FETCH_REQUESTED_BY,
						userData,
						userSettings,
						dataSource,
						censoredWords,
						grammarCorrection,
						locale,
						messages,
						originalDomain,
						channels,
						dispatch,
						threadBeforeRefresh: thread,
						purpose: 'threadPageRefresh'
					}
				)

				latestKnownThreadObject.current = updatedThread

				onThreadFetched(updatedThread, { dispatch, userData })

				if (refreshParameters && refreshParameters.onRefreshFinished) {
					refreshParameters.onRefreshFinished(updatedThread)
				}

				// When thread becomes "archived", it also automatically becomes "locked",
				// so there's no need to check for `updatedThread.archived`
				// after checking for `updatedThread.locked`.
				if (updatedThread.locked) {
					log('thread has been locked — stop auto-update')
					stopAutoUpdate()
					if (isMounted()) {
						setLocked(true)
					}
					return 'LOCKED'
				}

				const latestComment = updatedThread.comments[updatedThread.comments.length - 1]
				if (latestComment.id === previousLatestComment.id) {
					log('thread has no new comments')
					// If Auto-Update is running, schedule a next update.
					if (isStarted.current) {
						scheduleNextUpdate(Date.now())
					}
					return 'NO_NEW_COMMENTS'
				} else {
					log('thread has new comments')
					// If Auto-Update is running, schedule a next update.
					if (isStarted.current) {
						stopAutoUpdate()
						activateTriggerElement()
					}
					return 'NEW_COMMENTS'
				}
			} catch (error) {
				if (error.status === 404) {
					onThreadHasExpired()
					return 'EXPIRED'
				} else {
					log('thread refresh error')
					console.error(error)
					// If Auto-Update is running, schedule a next update.
					if (isStarted.current) {
						scheduleNextUpdate(Date.now())
					}
					throw error
				}
			}
		}

		const run = async () => {
			try {
				isUpdating.current = true
				setUpdating(true)
				setSecondsLeft(undefined)
				setErrored(false)
				await updateThread()
			} catch (error) {
				if (isMounted()) {
					setErrored(true)
				}
			} finally {
				isUpdating.current = false
				if (isMounted()) {
					setUpdating(false)
				}
			}
		}

		run()
	}

	useEffectSkipMount(() => {
		// If the user clicks the `<AutoUpdate/>` button
		// several times in quick succession, this check
		// will prevent it from needlessly running several
		// "refresh" processes simultaneously.
		if (!isUpdating.current) {
			// Even though normally `refreshThreadOnDemandRequest` can't be `undefined`,
			// it can be `undefined` when developing the application locally during React hot-reload on code changes.
			// So the condition `refreshThreadOnDemandRequest &&` was added here so that the page doesn't break.
			refreshThread(refreshThreadOnDemandRequest && refreshThreadOnDemandRequest.refreshParameters)
		}
	}, [
		refreshThreadOnDemandRequest,
		refreshThreadOnTimeRequest
	])

	const refreshThreadOnDemand = useCallback(async (refreshParameters: RefreshParameters) => {
		// This code doesn't directly call `await refreshThread()`.
		// The reason is that `refreshThread` function is created during render.
		// That means that that function's "reference" is updated on every re-render.
		// The `refreshThreadOnDemand()` function is returned to the outside world
		// from this hook, and after that there're no guarantees on how it will be used:
		// it might get called in a callback or in a `setTimeout()`, or after some `await`,
		// and if that happens, the `refreshThreadOnDemand()` function reference they have
		// previously obtained is no longer guaranteed to not be stale, and stale would mean
		// incorrect behavior. For that reason, to make the returned `refreshThreadOnDemand()`
		// function safe to use, it calls the `refreshThread()` function asynchronously,
		// by triggering an "effect".
		// For same reason, `refreshThreadOnDemand()` function declared via `useCallback()`
		// shouldn't have any dependencies.
		setRefreshThreadOnDemandRequest({ refreshParameters })
	}, [])

	useEffect(() => {
		// Every modern browser except Internet Explorer supports `IntersectionObserver`s.
		// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
		// https://caniuse.com/#search=IntersectionObserver
		triggerElementScrolledToObserver.current = new IntersectionObserver((entries, observer) => {
			// "one entry per observed element".
			// https://web.dev/resize-observer/
			// `entry.target === element`.
			const entry = entries[0]
			if (entry.isIntersecting) {
				log('auto-update start on-scroll-to trigger element - triggered: either is visible on screen or is not far from the current scroll position')
				deactivateTriggerElement(entry.target)
				startAutoUpdate()
			}
		}, {
			// "rootMargin" option is incorrectly named.
			// In reality, it's "root area expansion".
			// Values order: top, right, bottom, left.
			rootMargin: `0px 0px ${window.innerHeight}px 0px`
		})
		if (autoStart) {
			log('auto-start')
			startAutoUpdate()
		} else {
			activateTriggerElement()
		}
		// The cleanup function should deactivate the "on-scroll-to" trigger element.
		// In React 17, effect cleanup functions run "asynchronously", so
		// `node.current` is `null` by the time the cleanup function is called.
		// https://github.com/facebook/react/issues/20555
		// https://reactjs.org/blog/2020/08/10/react-v17-rc.html#potential-issues
		// One workaround: using `useLayoutEffect()` instead of `useEffect()`.
		// Another workaround: snapshot `const element = node.current`.
		const element = getTriggerElement()
		return () => {
			deactivateTriggerElement(element)
			stopAutoUpdate()
		}
	}, [])

	useEffect(() => {
		return () => {
			dispatch(resetAutoUpdateNewCommentsIndication())
		}
	}, [])

	return {
		refreshThread: refreshThreadOnDemand,
		isAnyoneRefreshingThread: isAnyoneFetchingOrRefreshingThisThread,
		isThreadExpired: isExpired,
		isThreadLocked: isLocked,
		isAutoUpdateError: isError,
		nextUpdateAt,
		secondsLeftUntilNextUpdate: secondsLeft
	}
}

const SECONDS_LEFT_STEPS = [
	{
		maxTime: 30 * 1000,
		value: 30
	},
	{
		maxTime: 20 * 1000,
		value: 20
	},
	{
		maxTime: 15 * 1000,
		value: 15
	},
	{
		maxTime: 10 * 1000,
		value: 10
	},
	{
		maxTime: 5 * 1000,
		value: 5
	}
]

// Rounds the `interval` to one of the `SECONDS_LEFT_STEPS`.
// The largest of the `SECONDS_LEFT_STEPS` applies.
function getSecondsLeft(interval: number) {
	let i = SECONDS_LEFT_STEPS.length - 1
	while (i >= 0) {
		const step = SECONDS_LEFT_STEPS[i]
		if (interval <= step.maxTime) {
			const nextStep = SECONDS_LEFT_STEPS[i + 1]
			return {
				secondsLeft: step.value,
				timeToNextSecondsLeft: nextStep ? interval - nextStep.maxTime : undefined
			}
		}
		i--
	}
	return {
		timeToNextSecondsLeft: interval - SECONDS_LEFT_STEPS[0].maxTime
	}
}

const DEBUG = false
function log(...args: any[]) {
	if (DEBUG) {
		console.log.apply(console, ['[auto-update]'].concat(args))
	}
}