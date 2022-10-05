import { useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { notify } from '../../redux/notifications.js'
import saveFile from 'frontend-lib/utility/saveFile.js'

import serializeThread from '../../utility/thread/serializeThread.js'

export default function useDownloadThread({
	thread,
	getCommentById
}) {
	const dispatch = useDispatch()

	// `onDownloadThread()` function is only used when clicking
	// "Download thread data" menu item of the first comment in a thread.
	// `onDownloadThread()` property doesn't change the way a comment is rendered,
	// so it should stay the same and not trigger a re-render of the comment.
	// Use a `ref` "hack" to keep its "reference" constant.
	const onDownloadThreadRef = useRef()

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