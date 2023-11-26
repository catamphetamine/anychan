import de from './messages/de.json' assert { type: 'json' }
import en from './messages/en.json' assert { type: 'json' }
import nl from './messages/nl.json' assert { type: 'json' }
import ru from './messages/ru.json' assert { type: 'json' }

import deBase from 'frontend-lib/messages/de.json' assert { type: 'json' }
import enBase from 'frontend-lib/messages/en.json' assert { type: 'json' }
import nlBase from 'frontend-lib/messages/nl.json' assert { type: 'json' }
import ruBase from 'frontend-lib/messages/ru.json' assert { type: 'json' }

import deSocial from 'social-components/messages/de.json' assert { type: 'json' }
import enSocial from 'social-components/messages/en.json' assert { type: 'json' }
import nlSocial from 'social-components/messages/nl.json' assert { type: 'json' }
import ruSocial from 'social-components/messages/ru.json' assert { type: 'json' }

import deSocialReact from 'social-components-react/messages/de.json' assert { type: 'json' }
import enSocialReact from 'social-components-react/messages/en.json' assert { type: 'json' }
import nlSocialReact from 'social-components-react/messages/nl.json' assert { type: 'json' }
import ruSocialReact from 'social-components-react/messages/ru.json' assert { type: 'json' }

import mergeMessages from 'frontend-lib/messages/mergeMessages.js'

export default {
	de: mergeMessages(de, deBase, deSocial, deSocialReact),
	en: mergeMessages(en, enBase, enSocial, enSocialReact),
	nl: mergeMessages(nl, nlBase, nlSocial, nlSocialReact),
	ru: mergeMessages(ru, ruBase, ruSocial, ruSocialReact)
}