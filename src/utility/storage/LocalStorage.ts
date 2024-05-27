import type { Dispatch } from 'redux'

import { LocalStorage as LocalStorage_ } from 'web-browser-storage'

import getMessages from '../../messages/getMessages.js'
import { showError } from '../../redux/notifications.js'

export default class LocalStorage<Value = any> extends LocalStorage_<Value> {
	constructor({ dispatch, getLocale }: { dispatch?: Dispatch, getLocale?: () => string } = {}) {
		super({
			onFull({ error }: { error: DOMException }) {
				if (dispatch && getLocale && getLocale()) {
					dispatch(showError(getMessages(getLocale()).storageCapacityExceeded))
				} else {
					console.error('`localStorage` capacity exceeded')
				}
			}
		})
	}
}