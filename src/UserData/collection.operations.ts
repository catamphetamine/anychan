import type { UserDataCollectionType } from '@/types'

import { getUnderlyingCollectionType } from './collection.utility.js'

import {
	setValue,
	removeValue,
	getValue,
	mergeWithValue
} from './types/value.js'

import {
	getMap,
	setMap,
	removeFromMap,
	getFromMap,
	mergeWithMap,
	setInMap
} from './types/map.js'

import {
	getList,
	setList,
	addToList,
	removeFromList,
	getFromList,
	mergeWithList,
	setInList
} from './types/list.js'

export function getOperations(type: UserDataCollectionType) {
	type = getUnderlyingCollectionType(type)

	switch (type) {
		case 'value':
			return {
				get: getValue,
				set: setValue,
				remove: removeValue,
				mergeWith: mergeWithValue
			}

		case 'map':
			return {
				get: getMap,
				getFrom: getFromMap,
				set: setMap,
				setIn: setInMap,
				removeFrom: removeFromMap,
				mergeWith: mergeWithMap
			}

		case 'list':
			return {
				get: getList,
				addTo: addToList,
				getFrom: getFromList,
				set: setList,
				setIn: setInList,
				removeFrom: removeFromList,
				mergeWith: mergeWithList
			}

		default:
			throw new Error(`Unsupported collection type: ${type}`)
	}
}

// import {
// 	addToChannelIdThreadIdCommentIds,
// 	setChannelIdThreadIdCommentIds,
// 	removeFromChannelIdThreadIdCommentIds,
// 	getFromChannelIdThreadIdCommentIds,
// 	mergeWithChannelIdThreadIdCommentIds
// } from './types/channelThreadComments'

// import {
// 	setChannelIdThreadIdCommentIdData,
// 	removeChannelIdThreadIdCommentIdData,
// 	getChannelIdThreadIdCommentIdData,
// 	mergeChannelIdThreadIdCommentIdData
// } from './types/channelThreadCommentData'

// import {
// 	setChannelIdThreadIdData,
// 	removeChannelIdThreadIdData,
// 	getChannelIdThreadIdData,
// 	mergeChannelIdThreadIdData
// } from './types/channelThreadData'

// import {
// 	setChannelIdData,
// 	removeChannelIdData,
// 	getChannelIdData,
// 	mergeChannelIdData
// } from './types/channelData'

// import {
// 	addToChannelIdThreadIds,
// 	setChannelIdThreadIds,
// 	removeFromChannelIdThreadIds,
// 	getFromChannelIdThreadIds,
// 	mergeWithChannelIdThreadIds
// } from './types/channelThread'

// // hiddenThreads: {
// //   a: [
// //     123,
// //     ...
// //   ],
// //   ...
// // }
// case 'channels-threads':
// 	return {
// 		add: addToChannelIdThreadIds,
// 		remove: removeFromChannelIdThreadIds,
// 		get: getFromChannelIdThreadIds,
// 		set: setChannelIdThreadIds,
// 		merge: mergeWithChannelIdThreadIds
// 	}
//
// // hiddenComments: {
// //   a: {
// //     '123': [
// //       124,
// //       125,
// //       ...
// //     ],
// //     ...
// //   },
// //   ...
// // }
// case 'channels-threads-comments':
// 	return {
// 		add: addToChannelIdThreadIdCommentIds,
// 		remove: removeFromChannelIdThreadIdCommentIds,
// 		get: getFromChannelIdThreadIdCommentIds,
// 		set: setChannelIdThreadIdCommentIds,
// 		merge: mergeWithChannelIdThreadIdCommentIds
// 	}
//
// // commentVotes: {
// //   a: {
// //     '123': {
// //       '123': 1,
// //       '124': -1,
// //       ...
// //     },
// //     ...
// //   },
// //   ...
// // }
// case 'channels-threads-comments-data':
// 	return {
// 		get: getChannelIdThreadIdCommentIdData,
// 		set: setChannelIdThreadIdCommentIdData,
// 		remove: removeChannelIdThreadIdCommentIdData,
// 		merge: mergeChannelIdThreadIdCommentIdData
// 	}
//
// // latestReadComments: {
// //   a: {
// //   	'124': 111, // Latest read comment id.
// //   	'356': 333,
// //   	...
// //   ],
// //   ...
// // }
// case 'channels-threads-data':
// 	return {
// 		get: getChannelIdThreadIdData,
// 		set: setChannelIdThreadIdData,
// 		remove: removeChannelIdThreadIdData,
// 		merge: mergeChannelIdThreadIdData
// 	}
//
// // {
// // 	a: 123,
// // 	b: 456,
// // 	...
// // }
// case 'channels-data':
// 	return {
// 		get: getChannelIdData,
// 		set: setChannelIdData,
// 		remove: removeChannelIdData,
// 		merge: mergeChannelIdData
// 	}
//