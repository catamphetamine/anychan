import type { Content } from 'social-components'

export interface Announcement {
  // Announcement date, in UTC+0 time zone, in "ISO" format:
	//
  // Example: "<year>-<month>-<day>T<hours>:<minutes>:<seconds>.<milliseconds>Z"
	//
  "date": "2012-12-21T00:00:00.000Z",

	// Announcement content.
	// https://gitlab.com/catamphetamine/social-components/blob/master/docs/Post/PostContent.md
	content: Content;

	// Whether this announcement is marked as "read" by the user.
	read?: boolean;
}