/**
 * Tests whether a string matches the pattern.
 * @param  {string} string
 * @param  {string} pattern — Pattern. Can contain an asterisk ("*"), but only at the end.
 * @param  {object} options — A character to exclude from matching an asterisk ("*").
 * @param  {string} options.asteriskExcludeCharacter — A character to exclude from matching an asterisk ("*").
 * @param  {boolean} options.asteriskOneOrMoreCharacters — If an asterisk ("*") should be treated as "one or more characters" instead of the default "zero or more characters".
 * @return {boolean}
 */
export default function matchesPattern(
	string: string,
	pattern: string,
	{
		asteriskExcludeCharacter,
		asteriskOneOrMoreCharacters
	}: {
		asteriskExcludeCharacter?: string,
		asteriskOneOrMoreCharacters?: boolean
	} = {}): boolean {
	const asteriskIndex = pattern.indexOf('*')
	if (asteriskIndex >= 0) {
		// if (asteriskIndex > 0 && pattern[asteriskIndex - 1] === ']') {
		// 	const beforeAsterisk = string.slice(0, asteriskIndex)
		// 	const bracketOpensAt = beforeAsterisk.lastIndexOf('[')
		// 	if (bracketOpensAt >= 0) {
		// 		const bracketsContents = beforeAsterisk.slice(bracketOpensAt + 1, asteriskIndex - 1)
		// 		// ...
		// 	}
		// }
		if (asteriskIndex !== pattern.length - 1) {
			if (asteriskExcludeCharacter) {
				if (pattern[asteriskIndex + 1] === asteriskExcludeCharacter) {
					const pattern1 = pattern.slice(0, asteriskIndex + 1)
					const pattern2 = pattern.slice(asteriskIndex + 1)
					const asteriskExcludeCharacterIndexInString = string.indexOf(asteriskExcludeCharacter, asteriskIndex)
					if (asteriskExcludeCharacterIndexInString < 0) {
						return false
					}
					const string1 = string.slice(0, asteriskExcludeCharacterIndexInString)
					const string2 = string.slice(asteriskExcludeCharacterIndexInString)
					return matchesPattern(string1, pattern1, { asteriskExcludeCharacter, asteriskOneOrMoreCharacters }) &&
						matchesPattern(string2, pattern2, { asteriskExcludeCharacter, asteriskOneOrMoreCharacters })
				}
			} else {
				throw new Error(`A match pattern can only contain an asterisk ("*") at the end of a segment: ${pattern}`)
			}
		}
		if (string.indexOf(pattern.slice(0, asteriskIndex)) === 0) {
			const rest = string.slice(asteriskIndex)
			if (asteriskExcludeCharacter) {
				if (rest.indexOf(asteriskExcludeCharacter) >= 0) {
					return false
				}
			}
			if (asteriskOneOrMoreCharacters) {
				if (rest.length === 0) {
					return false
				}
			}
			return true
		} else {
			return false
		}
	}
	return string === pattern
}