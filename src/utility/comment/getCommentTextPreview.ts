import type { Comment, Messages } from '../../types/index.js'

import { trimText } from 'social-components/text'

import getCommentText from './getCommentText.js'

interface Parameters {
	messages: Messages;
	characterLimit?: number;
	decreaseCharacterLimitBy?: number;
	charactersInLine?: number;
	maxLines?: number;
}

/**
 * Generates a text preview of a comment.
 * Text preview could be used for `<meta description/>`.
 * It could also be used when generating thread preview in a sidebar.
 * @param {object} comment
 * @param {object} [options]
 * @param {object} [options.messages] — An object containing localized labels. See the readme of `social-components` for more info.
 * @param {number} [options.characterLimit] — Max characters count.
 * @param {number} [options.decreaseCharacterLimitBy] — Max characters count (pre-defined or calculated) will be decreased by this value, if specified.
 * @param {number} [options.charactersInLine] — Line width in characters.
 * @param {number} [options.maxLines] — Max lines of text.
 * @return {string} [preview]
 */
export default function getCommentTextPreview(comment: Comment, {
	messages,
	characterLimit,
	decreaseCharacterLimitBy,
	charactersInLine,
	maxLines
}: Parameters | undefined) {
	if (!characterLimit) {
		if (maxLines && charactersInLine) {
			characterLimit = maxLines * charactersInLine
		}
	}

	if (!characterLimit) {
		throw new Error('Character limit not set')
	}

	if (decreaseCharacterLimitBy) {
		characterLimit -= decreaseCharacterLimitBy
	}

	const textPreview = getCommentText(comment, {
		messages,
		// A "soft" limit on the resulting text length.
		// "Soft" means that the resulting text may exceed the limit.
		softLimit: characterLimit
	})

	if (textPreview) {
		return trimText(textPreview, characterLimit, {
			minFitFactor: 0.5,
			maxFitFactor: 1.0,
			getCharactersCountPenaltyForLineBreak: ({ textBefore }) => {
				if (textBefore.length < charactersInLine) {
					return charactersInLine - textBefore.length
				}
				return charactersInLine / 2
			}
		})
	}
}
