export default function reportError(error: Error) {
	if (typeof window !== 'undefined') {
		setTimeout(() => {
			throw error
		}, 0)
	} else {
		console.error(error)
	}
}