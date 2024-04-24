import type { TypedUseSelectorHook } from 'react-redux';

import type { Messages } from '../types/index.js'

import getMessages from '../messages/getMessages.js'
import useLocale from './useLocale.js'

export default function useMessages({ useSelector }: { useSelector?: TypedUseSelectorHook<any> } = {}) {
	const locale = useLocale({ useSelector })
	return getMessages(locale) as Messages
}