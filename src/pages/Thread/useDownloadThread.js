import { useCallback, useRef } from 'react'
import { useDispatch } from 'react-redux'

import { notify } from 'webapp-frontend/src/redux/notifications'
import saveFile from 'webapp-frontend/src/utility/saveFile'

import serializeThread from '../../utility/serializeThread'

export default function useDownloadThread({
	thread,
	getCommentById
}) {
	const dispatch = useDispatch()
	// `onDownloadThread()` function parameter is only used when
	// clicking the "Download thread data" menu item of the first comment.
	// Therefore, it's not a "rendering property" in a sense that
	// it doesn't have any influence on how comments are rendered.
	// Therefore, it can be removed from `itemComponentProps`
	// memo dependencies list because the item component isn't
	// required to be rerendered when `onDownloadThread()` function changes.
	// Therefore, it can be passed as a `ref`: this way, it will
	// always be up to date while also not being a dependency.
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
	const onDownloadThread = useCallback((id) => {
		return onDownloadThreadRef.current(id)
	}, [])
	return onDownloadThread
}