import type { Messages } from '@/types'

import messages from './messages.js'

export default function getMessages(language: string): Messages {
	return messages.getMessages(language)
}