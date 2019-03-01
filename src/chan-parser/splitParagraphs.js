export default function splitParagraphs(content) {
	// Up to this point the comment is supposed to be a single-paragraph one.
	const split = splitParagraph(content[0])
	if (Array.isArray(split)) {
		return split
	}
	return content
}

function splitParagraph(content) {
	const indexes = findParagraphSplit(content)
	if (!indexes) {
		return
	}
	const [one, two] = split(content, indexes, true)
	if (!one) {
		return splitParagraph(two) || [two]
	}
	if (!two) {
		return [one]
	}
	const furtherSplit = splitParagraph(two)
	if (furtherSplit) {
		return [
			one,
			...furtherSplit
		]
	}
	return [one, two]
}

function findParagraphSplit(content) {
	let i = 0
	while (i < content.length) {
		if (typeof content[i] === 'string') {
			if (i > 0 && content[i] === '\n' && content[i - 1] === '\n' ) {
				return [i]
			}
		}
		else {
			const indexes = findParagraphSplit(content[i].content)
			if (indexes) {
				return [i].concat(indexes)
			}
		}
		i++
	}
}

function split(content, indexes, isRoot) {
	let left = []
	let right = []
	let i = 0
	while (i < content.length) {
		if (i === indexes[0]) {
			if (typeof content[i] === 'string') {
				// Remove the first "\n".
				left.pop()
				// Don't add the second "\n".
				// left.push(content[i])
				// // Don't add the subsequent "\n"s (if any).
				// while (i + 1 < content.length && content[i + 1] === '\n') {
				// 	i++
				// }
			} else {
				const [one, two] = split(content[i].content, indexes.slice(1))
				if (one) {
					left.push({
						...content[i],
						content: one
					})
				}
				if (two) {
					right.push({
						...content[i],
						content: two
					})
				}
			}
		} else if (i < indexes[0]) {
			left.push(content[i])
		} else {
			right.push(content[i])
		}
		i++
	}
	return [normalize(left, isRoot), normalize(right, isRoot)]
}

function normalize(content, isRoot) {
	if (content.length === 0) {
		return
	}
	if (!isRoot) {
		if (content.length === 1 && typeof content[0] === 'string') {
			return content[0]
		}
	}
	return content
}