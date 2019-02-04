import { setChan } from './chan'

export default function() {
	// `URL` is not available in IE11.
	// Supports `chan` URL parameter for multi-chan `gh-pages` demo.
	const chan = new URL(window.location.href).searchParams.get('chan')
	if (chan) {
		setChan(chan)
	}
}