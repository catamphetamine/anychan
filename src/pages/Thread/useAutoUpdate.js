import { useRef, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { refreshThread as refreshThreadAction, currentThreadExpired } from '../../redux/chan'
import { threadExpired } from '../../redux/threadTracker'
import getTimeToNextThreadUpdate from '../../utility/getTimeToNextThreadUpdate'

export default function useAutoUpdate({
	node,
	setNextUpdateAt,
	setUpdating,
	setExpired,
	setError,
	soonInterval,
	setUpdateSoon
}) {
	const isMounted = useRef()
	const scrolledToObserver = useRef()
	const autoUpdateTimer = useRef()
	const autoUpdateSoonTimer = useRef()
	const thread = useSelector(({ chan }) => chan.thread)
	const threadRefreshedAt = useSelector(({ chan }) => chan.threadRefreshedAt)
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const censoredWords = useSelector(({ settings }) => settings.settings.censoredWords)
	const dispatch = useDispatch()
	let refreshThread
	const scheduleNextUpdate = (updatedAt = threadRefreshedAt) => {
		const latestComment = thread.comments[thread.comments.length - 1]
		const nextUpdateIn = getTimeToNextThreadUpdate(updatedAt, latestComment.createdAt)
		setNextUpdateAt(Date.now() + nextUpdateIn)
		if (nextUpdateIn > soonInterval * 1000) {
			autoUpdateSoonTimer.current = setTimeout(() => setUpdateSoon(true), nextUpdateIn - soonInterval * 1000)
		} else {
			setUpdateSoon(true)
		}
		autoUpdateTimer.current = setTimeout(refreshThread, nextUpdateIn)
	}
	refreshThread = async () => {
		clearTimeout(autoUpdateTimer.current)
		clearTimeout(autoUpdateSoonTimer.current)
		setUpdateSoon(false)
		setUpdating(true)
		try {
			console.log('Refreshing thread')
			const previousLatestComment = thread.comments[thread.comments.length - 1]
			const updatedThread = await dispatch(refreshThreadAction(thread, {
				censoredWords,
				locale
			}))
			if (!isMounted.current) {
				return
			}
			const latestComment = updatedThread.comments[updatedThread.comments.length - 1]
			if (latestComment.id === previousLatestComment.id) {
				console.log('No new comments. Schedule next refresh.')
				scheduleNextUpdate(Date.now())
			} else {
				console.log('New comments. Next refresh not scheduled: observe element instead.')
				// Will schedule thread auto update when it becomes visible on screen.
				scrolledToObserver.current.observe(node.current)
			}
		} catch (error) {
			if (error.status === 404) {
				console.log('Thread expired')
				if (isMounted.current) {
					// Clear the expired thread from user data.
					setExpired(true)
				}
				dispatch(currentThreadExpired())
			} else {
				if (isMounted.current) {
					// Set
					setError(true)
				}
				throw error
			}
		} finally {
			if (isMounted.current) {
				setUpdating(false)
			}
		}
	}
	// , [
	// 	thread,
	// 	scheduleUpdate,
	// 	setUpdating,
	// 	setExpired,
	// 	setError,
	// 	dispatch,
	// 	censoredWords,
	// 	locale
	// ])
	// `thread` changes every time it's refreshed.
	// When a thread is refreshed, and there're new comments,
	// `IntersectionObserver` is re-activated, but it would still
	// have the reference to the old `refreshThread()`,
	// and `refreshThread()` depends on `thread.comments` ids,
	// as well as a lot of other things like `locale`, `censoredWords`, etc.
	// To work around that, `scheduleNextUpdateRef` is used,
	// that always has the reference to the latest `refreshThread()`.
	const scheduleNextUpdateRef = useRef()
	scheduleNextUpdateRef.current = scheduleNextUpdate
	useEffect(() => {
		isMounted.current = true
		function onScrolledTo(entries, observer) {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					console.log('Activated <AutoUpdate/>')
					// The `<AutoUpdate/>` element is visible:
					// schedule a thread update, and "unobserve" the `<AutoUpdate/>` element.
					scheduleNextUpdateRef.current()
					// No longer track the visibility of the "auto update" element.
					observer.unobserve(element)
					// If there were any more "entries", then don't process them.
					// Could there be any? I didn't check.
					// I guess, an "entry" is something like an "obervation event",
					// in which case there could be more.
					return
				}
			}
		}
		// Every modern browser except Internet Explorer supports `IntersectionObserver`s.
		// https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
		// https://caniuse.com/#search=IntersectionObserver
		scrolledToObserver.current = new IntersectionObserver(onScrolledTo)
		scrolledToObserver.current.observe(node.current)
		// Sometimes `node.current` is `undefined`
		// in the returned function for some reason.
		// Maybe it's because the component is unmounted
		// or something like that.
		// Maybe it's no longer the case.
		const element = node.current
		return () => {
			isMounted.current = false
			scrolledToObserver.current.unobserve(element)
			clearTimeout(autoUpdateTimer.current)
			clearTimeout(autoUpdateSoonTimer.current)
		}
	}, [])
	return [
		refreshThread
	]
}