import { fromFile, getImageDataUrl } from '@catamphetamine/id3js/browser'

export default async function getAudioFileInfoFromId3Tags(file: File | Blob) {
	try {
		const tags = await fromFile(file)
		tags.imageDataUrl = await getImageDataUrl(tags)
		return tags
	} catch (error) {
		// They say it might crash on some *.mp3 files
		// https://github.com/43081j/id3/pull/19
		// Catch the error so that it doesn't crash the app
		// because ID3 tags aren't essential to the app's operation.
		console.error(error)
		return {
			title: null,
			album: null,
			artist: null,
			year: null
		}
	}
}