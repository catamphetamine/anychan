import Messages from 'frontend-lib/messages/Messages.js'

import messagesLabels from './messagesLabels.js'
import getDefaultLanguage from './getDefaultLanguage.js'

export default new Messages(messagesLabels, { defaultLanguage: getDefaultLanguage() })