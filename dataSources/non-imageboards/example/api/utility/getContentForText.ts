import type { ContentBlock } from '@/types'

export default function getContentForText(text: string): ContentBlock[] | undefined {
	if (!text) {
		return
	}
	const paragraphs = text.split(/\n\n+/g)
	return paragraphs.map((paragraphText) => {
		const lines = paragraphText.split('\n')
		return interleave(lines, '\n')
	})
}

// https://stackoverflow.com/questions/31879576/what-is-the-most-elegant-way-to-insert-objects-between-array-elements
function interleave<T = any>(array: T[], separator: T): T[] {
	return [].concat(...array.map(element => [element, separator])).slice(0, -1)
}
