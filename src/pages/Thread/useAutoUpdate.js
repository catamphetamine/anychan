import { useRef, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import useIsMounted from 'frontend-lib/hooks/useIsMounted.js'

import useLocale from '../../hooks/useLocale.js'
import useUserData from '../../hooks/useUserData.js'
import useSettings from '../../hooks/useSettings.js'
import useDataSource from '../../hooks/useDataSource.js'

import getThread from '../../utility/thread/getThread.js'

import {
	markCurrentThreadAsExpired,
	resetAutoUpdateNewCommentsIndication
} from '../../redux/data.js'

import getNextUpdateAtForThread from '../../utility/thread/getNextUpdateAtForThread.js'
import onThreadFetched from '../../utility/thread/onThreadFetched.js'
import onThreadExpired from '../../utility/thread/onThreadExpired.js'

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
	node,
	setNextUpdateAt,
	setSecondsLeft,
	setUpdating,
	setExpired,
	setLocked,
	setError,
	autoStart
}) {
	const isMounted = useIsMounted()

	const isStarted = useRef()
	const isUpdating = useRef()
	const scrolledToObserver = useRef()
	const autoUpdateTimer = useRef()
	const autoUpdateSecondsLeftTimer = useRef()

	const thread = useSelector(state => state.data.thread)
	const threadRefreshedAt = useSelector(state => state.data.threadRefreshedAt)

	const censoredWords = useSelector(state => state.settings.settings.censoredWords)
	const grammarCorrection = useSelector(state => state.settings.settings.grammarCorrection)

	const userData = useUserData()
	const userSettings = useSettings()
	const dataSource = useDataSource()
	const dispatch = useDispatch()
	const locale = useLocale()

	let refreshThread
	const scheduleNextUpdate = (prevUpdateAt) => {
		log('refresh - schedule')
		const latestComment = thread.comments[thread.comments.length - 1]
		let beforeLatestComment
		if (thread.comments.length > 1) {
			beforeLatestComment = thread.comments[thread.comments.length - 2]
		}
		const nextUpdateAt = getNextUpdateAtForThread(prevUpdateAt, {
			latestCommentDate: latestComment.createdAt,
			beforeLatestCommentDate: beforeLatestComment && beforeLatestComment.createdAt
		})
		const nextUpdateIn = nextUpdateAt - Date.now()
		setNextUpdateAt(nextUpdateAt)
		function updateSecondsLeft() {
			const secondsLeftResult = getSecondsLeft(nextUpdateAt - Date.now())
			if (secondsLeftResult) {
				setSecondsLeft(secondsLeftResult.secondsLeft)
				if (secondsLeftResult.timeToNextSecondsLeft) {
					autoUpdateSecondsLeftTimer.current = setTimeout(
						updateSecondsLeft,
						secondsLeftResult.timeToNextSecondsLeft
					)
				}
			}
		}
		updateSecondsLeft()
		autoUpdateTimer.current = setTimeout(refreshThread, nextUpdateIn)
	}

	const activateTriggerElement = () => {
		log('trigger element - activate')
		// Will start thread auto update when the element becomes visible on screen.
		scrolledToObserver.current.observe(node.current)
	}

	const deactivateTriggerElement = (element) => {
		log('trigger element - deactivate')
		// No longer track the visibility of the auto update "trigger element".
		scrolledToObserver.current.unobserve(element)
		// // Could use `.unobserve()` instead of `.disconnect()`, but because
		// // in React 17, effect cleanup functions run "asynchronously",
		// // `node.current` is `null` by the time this function is called
		// // from the cleanup function returned from `useEffect()`.
		// // https://github.com/facebook/react/issues/20555
		// // https://reactjs.org/blog/2020/08/10/react-v17-rc.html#potential-issues
		// // So, using `.disconnect()` seems a simpler way.
		// // Could still use `.unobserve()`, in which case `node.current`
		// // would have to be replaced by an "element" attribute here.
		// scrolledToObserver.current.disconnect()
	}

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
	const scheduleNextUpdateRef = useRef()
	scheduleNextUpdateRef.current = () => scheduleNextUpdate(threadRefreshedAt)

	// `startAutoUpdate()` dependencies list is empty
	// because it's used in `useEffect()`, so it should be a constant.
	const startAutoUpdate = useCallback(() => {
		isStarted.current = true
		log('start')
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
		isStarted.current = false
		log('stop')
		clearTimeout(autoUpdateTimer.current)
		clearTimeout(autoUpdateSecondsLeftTimer.current)
	}, [])

	const onThreadHasExpired = useCallback(() => {
		log('thread expired')
		stopAutoUpdate()
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
		dispatch,
		userData,
		stopAutoUpdate,
		thread
	])

	refreshThread = async () => {
		// If the user clicks the `<AutoUpdate/>` button
		// several times in quick succession, this flag
		// will prevent it from needlessly double-refreshing.
		if (isUpdating.current) {
			return
		}
		isUpdating.current = true
		clearTimeout(autoUpdateTimer.current)
		clearTimeout(autoUpdateSecondsLeftTimer.current)
		setUpdating(true)
		setSecondsLeft(undefined)
		try {
			log('refreshing thread')
			const previousLatestComment = thread.comments[thread.comments.length - 1]
			const updatedThread = await getThread({ thread }, {
				censoredWords,
				grammarCorrection,
				locale
			}, {
				dispatch,
				userData,
				userSettings,
				dataSource,
				action: 'refreshThreadInState'
			})
			onThreadFetched(updatedThread, { dispatch, userData })
			if (!isStarted.current) {
				log('has already been stopped - exit')
				return
			}
			if (!isMounted()) {
				stopAutoUpdate()
				return
			}
			if (updatedThread.locked) {
				log('thread is locked')
				stopAutoUpdate()
				setLocked(true)
				return
			}
			if (updatedThread.archived) {
				log('thread is archived')
				onThreadHasExpired()
				return
			}
			setError(false)
			const latestComment = updatedThread.comments[updatedThread.comments.length - 1]
			if (latestComment.id === previousLatestComment.id) {
				log('no new comments')
				scheduleNextUpdate(Date.now())
			} else {
				log('has new comments')
				stopAutoUpdate()
				activateTriggerElement()
			}
		} catch (error) {
			if (error.status === 404) {
				onThreadHasExpired()
			} else {
				log('error')
				console.error(error)
				if (isMounted()) {
					scheduleNextUpdate(Date.now())
					setError(true)
				} else {
					stopAutoUpdate()
				}
			}
		} finally {
			isUpdating.current = false
			if (isMounted()) {
				setUpdating(false)
			}
		}
	}

	useEffect(() => {
		// Every modern browser except Internet Explorer supports `IntersectionObserver`s.
		// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
		// https://caniuse.com/#search=IntersectionObserver
		scrolledToObserver.current = new IntersectionObserver((entries, observer) => {
			// "one entry per observed element".
			// https://web.dev/resize-observer/
			// `entry.target === element`.
			const entry = entries[0]
			if (entry.isIntersecting) {
				if (!isStarted.current) {
					log('trigger element - triggered')
					deactivateTriggerElement(entry.target)
					startAutoUpdate()
				}
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
		// In React 17, effect cleanup functions run "asynchronously", so
		// `node.current` is `null` by the time the cleanup function is called.
		// https://github.com/facebook/react/issues/20555
		// https://reactjs.org/blog/2020/08/10/react-v17-rc.html#potential-issues
		// One workaround: using `useLayoutEffect()` instead of `useEffect()`.
		// Another workaround: snapshot `const element = node.current`.
		const element = node.current
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

	return [
		refreshThread
	]
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
function getSecondsLeft(interval) {
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
function log(...args) {
	if (DEBUG) {
		console.log.apply(console, ['[auto-update]'].concat(args))
	}
}