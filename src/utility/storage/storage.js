import { LocalStorage as LocalStorage_, MemoryStorage } from 'web-browser-storage'

import isLocalStorageAvailable from './isLocalStorageAvailable.js'
import { delayedDispatch } from '../dispatch.js'
import { getDefaultLanguage } from '../settings/settingsDefaults.js'
import getMessages from '../../messages/index.js'
import { showError } from '../../redux/notifications.js'

let getLocale

class LocalStorage extends LocalStorage_ {
	constructor() {
		super({
			onFull({ error }) {
				const locale = getLocale && getLocale() || getDefaultLanguage()
				delayedDispatch(showError(getMessages(locale).storageCapacityExceeded))
			}
		})
	}
}

export default isLocalStorageAvailable() ? new LocalStorage() : new MemoryStorage()

export function setLocaleSource(getLocale_) {
	getLocale = getLocale_
}