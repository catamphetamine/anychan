import type { Thread, GetCommentById } from '@/types'

import { useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { notify } from '../../redux/notifications.js'

import serializeThread from '../../utility/thread/serializeThread.js'
import saveFile from 'frontend-lib/utility/saveFile.js'

import useMessages from '@/hooks/useMessages.js'

export default function useDownloadThread({
	thread,
	getCommentById
}: {
	thread: Thread,
	getCommentById: GetCommentById
}) {
	const dispatch = useDispatch()
	const messages = useMessages()

	// `onDownloadThread()` function is only used when clicking
	// "Download thread data" menu item of the first comment in a thread.
	// `onDownloadThread()` property doesn't change the way a comment is rendered,
	// so it should stay the same and not trigger a re-render of the comment.
	// Use a `ref` "hack" to keep its "reference" constant.
	const onDownloadThreadRef = useRef<() => Promise<void>>()

	onDownloadThreadRef.current = useCallback(async () => {
		try {
			const threadData = await serializeThread(thread, { getCommentById })
			saveFile(threadData, `${thread.channelId} — ${thread.title}.json`)
		} catch (error) {
			dispatch(notify(messages.error))
			console.error(error)
			throw error
		}
	}, [
		thread,
		getCommentById
	])

	const onDownloadThread = useCallback(() => {
		return onDownloadThreadRef.current()
	}, [])

	return onDownloadThread
}