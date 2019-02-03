import { setChan } from './chan'

export default function() {
	// Supports `chan` URL parameter for `gh-pages` demo.
	const chan = new URL(window.location.href).searchParams.get('chan')
	if (chan) {
		setChan(chan)
	}
}