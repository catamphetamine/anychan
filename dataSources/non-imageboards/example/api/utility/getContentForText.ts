import type { ContentBlock } from '@/types'

import interleaveArrayElements from './interleaveArrayElements.js'

export default function getContentForText(text: string): ContentBlock[] | undefined {
	if (!text) {
		return
	}
	const paragraphs = text.split(/\n\n+/g)
	return paragraphs.map((paragraphText) => {
		const lines = paragraphText.split('\n')
		return interleaveArrayElements(lines, '\n')
	})
}