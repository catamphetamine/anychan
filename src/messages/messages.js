import Messages from 'frontend-lib/messages/Messages.js'

import messagesLabels from './messagesLabels.js'
import getDefaultLanguage from './getDefaultLanguage.js'

export default new Messages(messagesLabels, { defaultLanguage: getDefaultLanguage() })

if (typeof window !== 'undefined') {
	// This application exposes the messages in the form of a global variable called `LABELS`.
	// This hypothetically would allow end users to customize the messages by including
	// an "extension" javascript file on a page.
	// That script could do something like: `LABELS.ru.settings.theme.title = "Тема"`
	window.LABELS = messagesLabels
}
