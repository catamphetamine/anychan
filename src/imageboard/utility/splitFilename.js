/**
 * Splits a filename into file title and file extension
 * @param  {string} filename
 * @return {string[]} `[title, extension]`.
 */
export default function splitFilename(filename) {
	const dotIndex = filename.lastIndexOf('.')
	if (dotIndex > 0 || dotIndex < filename.length - 1) {
		return [
			filename.slice(0, dotIndex),
			filename.slice(dotIndex)
		]
	}
	return [filename, undefined]
}