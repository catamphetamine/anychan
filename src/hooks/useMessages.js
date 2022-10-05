import getMessages from '../messages/index.js'
import useLocale from './useLocale.js'

export default function useMessages() {
	const locale = useLocale()
	return getMessages(locale)
}