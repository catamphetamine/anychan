/**
 * Looks up a localized message by a key.
 * @param  {object} messages — Localized messages.
 * @param  {string} language
 * @param  {string} key
 * @param  {object} [substitutes] — Substitutes. Example: `"Hello, {username}"` with substitutes `{ username: 'john' }`.
 * @return {string}
 */
export default function translate(messages, language, key, substitutes) {
	let message = key.split('.').reduce((messages, key) => messages[key], messages[language])
	if (!message) {
		throw new RangeError(`Message not found: ${key}`)
	}
	if (!substitutes) {
		return message
	}
	for (const key of Object.keys(substitutes)) {
		message = replaceAll(message, `{${key}}`, substitutes[key])
	}
	return message
}

function replaceAll(string, substring, substitute) {
	const replacedString = string.replace(substring, substitute)
	if (replacedString === string) {
		return string
	}
	return replaceAll(replacedString, substring, substitute)
}