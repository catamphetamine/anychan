import type { Attachment } from '@/types'

import getFileInfo from 'frontend-lib/utility/file/getFileInfo.js'
import getFileDataUrl from 'frontend-lib/utility/file/getFileDataUrl.js'

// Throws a weird error when running `yarn test`:
// "Exception during run: Error: Cannot find package '@catamphetamine/id3js' imported from c:\dev\frontend-lib\utility\file\getAudioFileInfoFromId3Tags.js"
// import getAudioFileInfoFromId3Tags from 'frontend-lib/utility/file/getAudioFileInfoFromId3Tags.js'

import getAudioFileInfoFromId3Tags from './getAudioFileInfoFromId3Tags.js'

export default async function getAttachmentForFile(file: File | Blob): Promise<Attachment> {
	const [type, subtype] = file.type.split('/')
	switch (type) {
		case 'image':
			const imageInfo = await getFileInfo(file)
			return {
				type: 'picture',
				picture: {
					type: imageInfo.type,
					size: imageInfo.size,
					width: imageInfo.width,
					height: imageInfo.height,
					url: imageInfo.url
				}
			}
		case 'video':
			const videoInfo = await getFileInfo(file)
			return {
				type: 'video',
				video: {
					type: videoInfo.type,
					size: videoInfo.size,
					width: videoInfo.width,
					height: videoInfo.height,
					url: videoInfo.url,
					duration: videoInfo.duration,
					picture: {
						type: videoInfo.picture.type,
						width: videoInfo.picture.width,
						height: videoInfo.picture.height,
						url: videoInfo.picture.url
					}
				}
			}
		case 'audio':
			const audioInfo = await getFileInfo(file)
			const audioId3Tags = await getAudioFileInfoFromId3Tags(file)
			// Get audio title.
			let title
			if (audioId3Tags.title) {
				title = audioId3Tags.title
				if (audioId3Tags.artist) {
					title = audioId3Tags.artist + ' — ' + audioId3Tags.title
				}
			}
			// Return audio attachment.
			return {
				type: 'audio',
				audio: {
					title,
					type: audioInfo.type,
					size: audioInfo.size,
					url: audioInfo.url,
					duration: audioInfo.duration
				}
			}
		default:
			const fileDataUrl = await getFileDataUrl(file)
			return {
				type: 'file',
				file: {
					name: file instanceof File ? file.name : undefined,
					type: file.type,
					size: file.size,
					url: fileDataUrl
				}
			}
	}
}