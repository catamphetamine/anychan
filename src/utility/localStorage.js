import { getChanId } from '../chan'

export function getPrefix(prefix, chanId = getChanId()) {
	return prefix === undefined ?
		'captchan.' + (chanId ? chanId + '.' : '') :
		prefix
}