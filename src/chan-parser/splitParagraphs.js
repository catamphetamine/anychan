export default function splitParagraphs(content) {
	let paragraphs = content
	let i = 0
	while (i < content.length) {
		const split = splitParagraph(content[i])
		if (Array.isArray(split)) {
			// Initializing `paragraphs` on demains is a minor optimization
			// for cases when paragraphs likely won't be split.
			if (paragraphs === content) {
				paragraphs = paragraphs.slice(0, i)
			}
			paragraphs = paragraphs.concat(split)
		} else {
			// Initializing `paragraphs` on demains is a minor optimization
			// for cases when paragraphs likely won't be split.
			if (paragraphs !== content) {
				paragraphs.push(content[i])
			}
		}
		i++
	}
	return paragraphs
}

function splitParagraph(content) {
	const indexes = findParagraphSplit(content)
	if (!indexes) {
		return
	}
	const [one, two] = split(content, indexes, true)
	// If `content` is `["\n", "\n"]` then both
	// `one` and `two` will be `undefined`.
	if (!one && !two) {
		return
	}
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

const WHITESPACE = /^\s+$/

function findParagraphSplit(content) {
	// I can imagine some inline-level post parts not having `content`
	// being hypothetically added in some potential future (though unlikely).
	// if (!content) {
	// 	return
	// }
	let i = 0
	while (i < content.length) {
		if (typeof content[i] === 'string') {
			if (content[i] === '\n') {
				let j = i + 1
				while (j < content.length) {
					if (content[j] === '\n') {
						return [j]
					}
					if (!WHITESPACE.test(content[j])) {
						break
					}
					i++
					j++
				}
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