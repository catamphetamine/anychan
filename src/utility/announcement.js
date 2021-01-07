import UserData from '../UserData/UserData'

// Randomize announcement refresh delay between different tabs
// so that multiple tabs don't start refreshing it simultaneously.
const RANDOMIZE_REFRESH_INTERVAL = 5 * 60 * 1000

const REFRESH_LOCK_TIMEOUT = 60 * 1000

export function startPollingAnnouncement(url, showAnnouncement, interval) {
	function pollAnnouncement() {
		// Schedule refresh of the announcement.
		const latestRefreshedAt = UserData.getAnnouncementRefreshedAt()
		let refreshDelay = 0
		if (latestRefreshedAt) {
			refreshDelay = Math.max(0, (latestRefreshedAt + interval) - Date.now())
		}
		if (refreshDelay > 0) {
			// Randomize announcement refresh delay between different tabs
			// so that multiple tabs don't start refreshing it simultaneously.
			refreshDelay += Math.random() * RANDOMIZE_REFRESH_INTERVAL
			return setTimeout(pollAnnouncement, refreshDelay)
		}
		// Refresh the announcement.
		let delay = 0
		const lockedUntil = UserData.getAnnouncementRefreshLockedUntil()
		if (lockedUntil) {
			delay = Math.max(0, Date.now() - lockedUntil)
		}
		if (delay > 0) {
			// Randomize announcement refresh delay between different tabs
			// so that multiple tabs don't start refreshing it simultaneously.
			delay += Math.random() * RANDOMIZE_REFRESH_INTERVAL
			return setTimeout(pollAnnouncement, delay)
		}
		// Set the "lock" on refreshing the announcement.
		const announcementRefreshLockedUntil = Date.now() + REFRESH_LOCK_TIMEOUT
		UserData.setAnnouncementRefreshLockedUntil(announcementRefreshLockedUntil)
		fetchAnnouncement(url).then((announcement) => {
			// Check if still holds the "lock".
			if (UserData.getAnnouncementRefreshLockedUntil() === announcementRefreshLockedUntil) {
				// Release the "lock".
				UserData.removeAnnouncementRefreshLockedUntil()
				if (announcement !== undefined) {
					// Update "Refreshed At" timestamp.
					UserData.setAnnouncementRefreshedAt(Date.now())
					// `announcement` can be `null` meaning "no announcement".
					if (announcement !== null) {
						const prevAnnouncement = UserData.getAnnouncement()
						if (!prevAnnouncement || prevAnnouncement.date !== announcement.date) {
							UserData.setAnnouncement(announcement)
							showAnnouncement(announcement)
						}
					}
				}
			}
			setTimeout(pollAnnouncement, interval)
		})
	}
	pollAnnouncement()
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

export function getAnnouncement() {
	return UserData.getAnnouncement()
}

export function markAnnouncementAsRead() {
	UserData.setAnnouncement({
		...UserData.getAnnouncement(),
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