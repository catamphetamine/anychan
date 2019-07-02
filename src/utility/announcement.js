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
		const json = await response.json()
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