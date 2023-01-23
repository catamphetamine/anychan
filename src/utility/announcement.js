import getUserData from '../UserData.js'
import Lock from './Lock.js'

import { Timer } from 'web-browser-timer'

// Randomize announcement refresh delay between different tabs
// so that multiple tabs don't start refreshing it simultaneously.
const RETRY_DELAY_MAX = 10 * 60 * 1000

// The initial refresh delay will be randomized between different tabs
// so that multiple tabs don't start refreshing it simultaneously.
const START_DELAY_MAX = 2 * 1000

// How long could a refresh process go on for.
const TIMEOUT = 60 * 1000

const debug = (...args) => console.log(['Announcement Refresh'].concat(args))

const lock = new Lock('Announcement.Refresh.Lock', {
	debug,
	timeout: TIMEOUT
})

const timer = new Timer()

export function startPollingAnnouncement(url, showAnnouncement, refreshInterval, {
	userData = getUserData()
} = {}) {
	function retryAfter(delay) {
		// Randomize announcement refresh delay between different tabs
		// so that multiple tabs don't start refreshing it simultaneously.
		delay += Math.random() * RETRY_DELAY_MAX
		return timer.schedule(pollAnnouncement, delay)
	}

	async function pollAnnouncement() {
		// Schedule refresh of the announcement.
		const latestRefreshedAt = userData.getAnnouncementRefreshedAt()
		let nextRefreshDelay = 0
		if (latestRefreshedAt) {
			nextRefreshDelay = Math.max(0, (latestRefreshedAt + refreshInterval) - timer.now())
		}

		// If the time to refresh the announcement hasn't come yet,
		// then schedule a retry.
		if (nextRefreshDelay > 0) {
			return retryAfter(nextRefreshDelay)
		}

		// Acquire a lock.
		const {
			hasLockTimedOut,
			getRetryDelayAfterLockTimedOut,
			releaseLock,
			retryAfter: retryDelay
		} = await lock.acquire()

		if (retryDelay) {
			return retryAfter(retryDelay)
		}

		// Fetch the announcement.
		const announcement = await fetchAnnouncement(url)

		// Check if the "lock" has timed out.
		if (hasLockTimedOut()) {
			return retryAfter(getRetryDelayAfterLockTimedOut())
		}

		// `announcement` could be `undefined`, for example,
		// in case of a "404 Not Found" error.
		if (announcement === undefined) {
			// Release the "lock".
			releaseLock()
			// Retry later.
			return retryAfter(refreshInterval)
		}

		// Update "Refreshed At" timestamp.
		userData.setAnnouncementRefreshedAt(timer.now())

		// Release the "lock".
		releaseLock()

		// `announcement.json` content can be `null` meaning "no announcement".
		// For example, if an admin of a web server doesn't want to see "404 Not Found"
		// errors in the logs for `announcement.json`, they might create one with contents: `null`.
		if (announcement !== null) {
			// Because `announcement` data comes from an external source — `announcement.json` — 
			// don't "trust" its contents. Copy over only the expected properties.
			onAnnouncement({
				date: announcement.date,
				content: announcement.content
			}, { userData })
		}

		// Schedule next refresh.
		retryAfter(refreshInterval)
	}

	// Randomize announcement refresh delay between different tabs
	// so that multiple tabs don't start refreshing it simultaneously.
	setTimeout(pollAnnouncement, Math.random() * START_DELAY_MAX)
}

function onAnnouncement(announcement, { userData }) {
	// If the announcement has changed, save and show the new announcement.
	const prevAnnouncement = userData.getAnnouncement()
	if (!prevAnnouncement || prevAnnouncement.date !== announcement.date) {
		try {
			userData.setAnnouncement(announcement)
			showAnnouncement(announcement)
		} catch (error) {
			console.error(error)
		}
	}
}

/**
 * Fetches announcement JSON from the `url`.
 * @param  {string} url — Announcement JSON URL.
 * @return {object} [announcement] Returns the announcement. Returns `null` if the announcement is empty. Returns `undefined` if there was an error.
 */
export async function fetchAnnouncement(url) {
	try {
		const response = await fetch(url)
		// Exit if the URL returns 404 Not Found.
		if (!response.ok) {
			return
		}
		const text = await response.text()
		// // Exit if the file is empty.
		// if (!text) {
		// 	return
		// }
		const json = JSON.parse(text)
		// An example announcement for testing:
		// const json = {
		// 	// Date in "ISO" format.
		// 	// Could be just a date:
		// 	// date: "2019-07-02"
		// 	// or a date with time:
		// 	"date": "2019-07-02T14:37",
		// 	// Announcement content.
		// 	// https://gitlab.com/catamphetamine/social-components/blob/master/docs/Post/PostContent.md
		// 	"content": [[
		// 		"4chan is now owned and led by ",
		// 		{
		// 			"type": "link",
		// 			"url": "https://twitter.com/hiroyuki_ni",
		// 			"content": "Hiroyuki Nishimura"
		// 		},
		// 		", the founder of the largest anonymous BBS in Japan, 2channel. Read the full announcement on the ",
		// 		{
		// 			"type": "link",
		// 			"url": "https://www.4chan.org/4channews.php",
		// 			"content": "4chan News page"
		// 		},
		// 		"."
		// 	]]
		// }
		// Exit if it's an empty object.
		// (if some administrators prefer not having HTTP 404 Not Found logs)
		if (Object.keys(json).length === 0 && json.constructor === Object) {
			return null
		}
		validateAnnouncement(json)
		return json
	} catch (error) {
		console.error(error)
	}
}

export function markAnnouncementAsRead({ userData = getUserData() } = {}) {
	userData.setAnnouncement({
		...userData.getAnnouncement(),
		read: true
	})
}

function validateAnnouncement(json) {
	if (typeof json.date !== 'string') {
		throw new Error(`Announcement "date" must be a string`)
	}
	// Check that the `date` is in ISO format.
	// Otherwise `new Date()` returns "Invalid Date".
	if (isNaN(new Date(json.date).getTime())) {
		throw new Error(`Announcement "date" must be in ISO format. Examples: "2019-07-02", "2019-07-02T14:37".`)
	}
	if (typeof json.content !== 'string' && !Array.isArray(json.content)) {
		throw new Error(`Announcement "content" must be of type PostContent. https://gitlab.com/catamphetamine/social-components/blob/master/docs/Post/PostContent.md`)
	}
}

function getLockedUntil() {
	return localStorage.get(LOCKED_UNTIL_STORAGE_KEY)
}

function setLockedUntil(timestamp) {
	localStorage.set(LOCKED_UNTIL_STORAGE_KEY, timestamp)
}

function releaseTheLock() {
	localStorage.delete(LOCKED_UNTIL_STORAGE_KEY)
}