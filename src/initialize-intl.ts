import TimeAgo from 'javascript-time-ago'

import de from 'javascript-time-ago/locale/de'
import en from 'javascript-time-ago/locale/en'
import ru from 'javascript-time-ago/locale/ru'

import '@formatjs/intl-pluralrules/polyfill.js'
import '@formatjs/intl-pluralrules/locale-data/de.js'
import '@formatjs/intl-pluralrules/locale-data/en.js'
import '@formatjs/intl-pluralrules/locale-data/ru.js'

export default function() {
	TimeAgo.addLocale(de)
	TimeAgo.addLocale(en)
	TimeAgo.addLocale(ru)
}