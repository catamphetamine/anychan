export function setValue({ encode }, previousValue, value) {
	return encode(value)
}

export function removeValue({}) {
	return null
}

export function getValue({ decode }, value) {
	return decode(value)
}

// `value` is already encoded. No need to `encode()` it.
export function mergeWithValue({ merge }, prevValue, value) {
	if (prevValue !== undefined) {
		return merge(prevValue, value)
	}
	return value
}