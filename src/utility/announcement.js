import { getCookie, setCookie } from 'webapp-frontend/src/utility/cookie'

const COOKIE_NAME = 'announcementRead'

export function pollAnnouncement(url, showAnnouncement, interval) {
	function pollAnnouncement() {
		fetchAnnouncement(url, showAnnouncement).then(() => {
			setTimeout(pollAnnouncement, interval)
		})
	}
	pollAnnouncement()
}

export async function fetchAnnouncement(url, showAnnouncement) {
	try {
		const response = await fetch(url)
		// Exit if the URL returns 404 Not Found.
		if (!response.ok) {
			return
		}
		const text = await response.text()
		// Exit if the file is empty.
		if (!text) {
			return
		}
		const json = JSON.parse(text)
		// An example announcement for testing:
		// const json = {
		// 	// Date in "ISO" format.
		// 	// Could be just a date:
		// 	// date: "2019-07-02"
		// 	// or a date with time:
		// 	date: "2019-07-02T14:37",
		// 	// Announcement content (an array of strings or objects).
		// 	content: [
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
		// 	]
		// }
		// Exit if it's an empty object.
		// (if some administrators prefer not having HTTP 404 Not Found logs)
		if (Object.keys(json).length === 0 && json.constructor === Object) {
			return
		}
		validateAnnouncement(json)
		const announcementReadDate = getCookie(COOKIE_NAME)
		if (!announcementReadDate || announcementReadDate !== json.date) {
			showAnnouncement(json)
		}
	} catch (error) {
		console.error(error)
	}
}

export function hideAnnouncement(json) {
	setCookie(COOKIE_NAME, json.date)
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
		throw new Error(`Announcement "content" must be either a string or an array of strings and objects`)
	}
}