import type { Locale } from '@/types'

import messages from './messages.js'

export default function getLanguageNames() {
	return messages.getLanguageNames() as Record<Locale, string>
}