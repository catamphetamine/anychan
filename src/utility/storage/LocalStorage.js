import { LocalStorage as LocalStorage_ } from 'web-browser-storage'

import getMessages from '../../messages/getMessages.js'
import { showError } from '../../redux/notifications.js'

export default class LocalStorage extends LocalStorage_ {
	constructor({ dispatch, getLocale } = {}) {
		super({
			onFull({ error }) {
				if (dispatch && getLocale && getLocale()) {
					dispatch(showError(getMessages(getLocale()).storageCapacityExceeded))
				} else {
					console.error('`localStorage` capacity exceeded')
				}
			}
		})
	}
}