import { isEqual } from 'lodash-es'

import getUserData from '../UserData.js'

import { createSubscribedThreadStatsRecordStubEncoded } from '../utility/subscribedThread/createSubscribedThreadStatsRecord.js'
import { subscribedThreadsIndex, subscribedThreadsState } from './collections/index.js'

export default function fixSubscribedThreadsData({ userData = getUserData(), log = () => {} }) {
	const _log = log
	log = (...args) => _log.apply(this, ['Fix subscribed threads'].concat(args))

	log('Analyze: Start')

	const subscribedThreads = userData.getSubscribedThreads()

	function getSubscribedThread(channelId, threadId) {
		return subscribedThreads.find((subscribedThread) => {
			return subscribedThread.channel.id === channelId && subscribedThread.id === threadId
		})
	}

	const subscribedThreadIdsByChannel =  getSubscribedThreadIdsByChannelMap({ userData, subscribedThreads })

	// Fix `subscribedThreadsIndex` collection.
	const fixSubscribedThreadsIndexOperation = fixSubscribedThreadsIndex({ userData, log, subscribedThreadIdsByChannel })

	// Fix `subscribedThreadsState` collection.
	const fixSubscribedThreadsStatsOperation = fixSubscribedThreadsStats({ userData, log, subscribedThreadIdsByChannel, getSubscribedThread })

	// Return a "write" operation.
	return () => {
		if (fixSubscribedThreadsIndexOperation) {
			fixSubscribedThreadsIndexOperation()
		}
		if (fixSubscribedThreadsStatsOperation) {
			fixSubscribedThreadsStatsOperation()
		}
	}
}

function getSubscribedThreadIdsByChannelMap({ subscribedThreads }) {
	const subscribedThreadIdsByChannel = {}

	for (const subscribedThread of subscribedThreads) {
		const channelId = subscribedThread.channel.id
		const threadId = subscribedThread.id

		if (!subscribedThreadIdsByChannel[channelId]) {
			subscribedThreadIdsByChannel[channelId] = []
		}

		subscribedThreadIdsByChannel[channelId].push(threadId)
	}

	return subscribedThreadIdsByChannel
}

// Fix `subscribedThreadsIndex` collection.
function fixSubscribedThreadsIndex({ userData, log, subscribedThreadIdsByChannel }) {
	log('Index: Analyze: Start')

	let changed

	const subscribedThreadIdsByChannelData = userData.getCollectionData(subscribedThreadsIndex) || {}

	if (subscribedThreadIdsByChannelData) {
		for (const channelId of Object.keys(subscribedThreadIdsByChannelData)) {
			// Remove no longer subscribed threads.
			if (!subscribedThreadIdsByChannel[channelId]) {
				log('Remove no longer subscribed threads from the index for channel', channelId)
				delete subscribedThreadIdsByChannelData[channelId]
				changed = true
				continue
			}

			// Remove no longer subscribed threads.
			// Add absent subscribed threads.
			if (!isEqual(subscribedThreadIdsByChannelData[channelId], subscribedThreadIdsByChannel[channelId])) {
				log('Fix incorrect subscribed threads index for channel', channelId)
				subscribedThreadIdsByChannelData[channelId] = subscribedThreadIdsByChannel[channelId]
				changed = true
			}
		}
	}

	// Add absent subscribed threads (for absent channels).
	for (const channelId of Object.keys(subscribedThreadIdsByChannel)) {
		if (!subscribedThreadIdsByChannelData[channelId]) {
			log('Fix incorrect subscribed threads index for channel', channelId)
			subscribedThreadIdsByChannelData[channelId] = subscribedThreadIdsByChannel[channelId]
			changed = true
		}
	}

	log('Index: Analyze: End')

	// Return a "fix" operation.
	if (changed) {
		return () => userData.replaceCollectionData(subscribedThreadsIndex, subscribedThreadIdsByChannelData)
	}
}

// Fix `subscribedThreadsState` collection.
function fixSubscribedThreadsStats({ userData, log, subscribedThreadIdsByChannel, getSubscribedThread }) {
	log('Stats: Analyze: Start')

	let changed

	let subscribedThreadsStateData = userData.getCollectionData(subscribedThreadsState) || {}

	if (subscribedThreadsStateData) {
		for (const channelId of Object.keys(subscribedThreadsStateData)) {
			// Remove no longer subscribed threads.
			if (!subscribedThreadIdsByChannel[channelId]) {
				log('Remove leftover subscribed threads stats for channel', channelId)
				delete subscribedThreadsStateData[channelId]
				changed = true
				continue
			}

			// Remove no longer subscribed threads.
			for (const threadIdString of Object.keys(subscribedThreadsStateData[channelId])) {
				if (!subscribedThreadIdsByChannel[channelId].includes(Number(threadIdString))) {
					log('Remove leftover subscribed thread stats for channel', channelId, 'for thread', Number(threadIdString))
					delete subscribedThreadsStateData[channelId][threadIdString]
					changed = true
				}
			}

			// Add absent subscribed threads.
			for (const threadId of subscribedThreadIdsByChannel[channelId]) {
				if (!subscribedThreadsStateData[channelId][String(threadId)]) {
					log('Add absent subscribed thread stats for channel', channelId, 'for thread', threadId)
					subscribedThreadsStateData[channelId][String(threadId)] = createSubscribedThreadStatsRecordStubEncoded(
						getSubscribedThread(channelId, threadId)
					)
					changed = true
				}
			}
		}
	}

	// Add absent subscribed threads (for absent channels).
	for (const channelId of Object.keys(subscribedThreadIdsByChannel)) {
		if (!subscribedThreadsStateData) {
			subscribedThreadsStateData = {}
		}
		if (!subscribedThreadsStateData[channelId]) {
			log('Add absent subscribed thread stats for channel', channelId)
			subscribedThreadsStateData[channelId] = subscribedThreadIdsByChannel[channelId].reduce(
				(all, threadId) => ({
					...all,
					[threadId]: createSubscribedThreadStatsRecordStubEncoded(
						getSubscribedThread(channelId, threadId)
					)
				}),
				{}
			)
			changed = true
		}
	}

	log('Stats: Analyze: End')

	// Return a "fix" operation.
	if (changed) {
		return () => userData.replaceCollectionData(subscribedThreadsState, subscribedThreadsStateData)
	}
}