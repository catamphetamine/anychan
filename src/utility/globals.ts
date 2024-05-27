import type UserDataCleaner from '../UserData/UserDataCleaner.js'
import type SubscribedThreadsUpdater from './SubscribedThreadsUpdater/SubscribedThreadsUpdater.js'

let userDataCleaner: UserDataCleaner
let subscribedThreadsUpdater: SubscribedThreadsUpdater

export function setUserDataCleaner(userDataCleaner_: UserDataCleaner) {
	userDataCleaner = userDataCleaner_
}

export function getUserDataCleaner() {
	return userDataCleaner
}

export function setSubscribedThreadsUpdater(subscribedThreadsUpdater_: SubscribedThreadsUpdater) {
	subscribedThreadsUpdater = subscribedThreadsUpdater_
}

export function getSubscribedThreadsUpdater() {
	return subscribedThreadsUpdater
}