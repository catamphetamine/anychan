import type { UserDataCollection } from '@/types'

// Stores a list of IDs of the hidden threads in a channel.
//
// Users can hide certain threads from being shown on a channel page.
// For example, if their "opening comments" are offensive.
//
// Example: `hiddenThreads/a = [123]`.
//
export const hiddenThreads: UserDataCollection = {
	name: 'hiddenThreads',
	shortName: '😷',

	type: 'channels-threads',

	methods: {
		addHiddenThread: 'addTo',
		isThreadHidden: 'getFrom',
		removeHiddenThread: 'removeFrom'
	}
}