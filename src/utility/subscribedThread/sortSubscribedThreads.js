import getSubscribedThreadNewRepliesCount from './getSubscribedThreadNewRepliesCount.js'
import doesSubscribedThreadHaveNewComments from './doesSubscribedThreadHaveNewComments.js'

/**
 * Sorts subscribed threads in order:
 *
 * * Threads with new replies
 *   * Own threads
 *     * Non-archived non-locked threads (recently added threads first)
 *     * Locked threads (recently locked threads first)
 *     * Archived threads (recently archived threads first)
 *   * Rest
 *     * Non-archived non-locked threads (recently added threads first)
 *     * Locked threads (recently locked threads first)
 *     * Archived threads (recently archived threads first)
 *
 * * Threads with new comments
 *   * Own threads
 *     * Non-archived non-locked threads (recently added threads first)
 *     * Locked threads (recently locked threads first)
 *     * Archived threads (recently archived threads first)
 *   * Rest
 *     * Non-archived non-locked threads (recently added threads first)
 *     * Locked threads (recently locked threads first)
 *     * Archived threads (recently archived threads first)
 *
 * * Non-archived non-locked threads (recently added threads first)
 *
 * * Locked threads (recently locked threads first)
 *
 * * Archived threads (recently archived threads first)
 *
 * * Expired threads (recently expired threads first)
 *
 * The "rating" shouldn't depend, for example, on latest comment date
 * because that way the list would be constantly re-shuffled as new comments
 * are added in the subscribed threads.
 *
 * Mutates the original `subscribedThreads` argument,
 * because that's how `Array.sort()` works in javascript.
 *
 * @param  {SubscribedThreadRecord[]} subscribedThreads
 */
export default function sortSubscribedThreads(subscribedThreads, { userData }) {
	return subscribedThreads.sort((a, b) => compareSubscribedThreads(a, b, { userData }))
}

/**
 * Compares two subscribed threads.
 * @param  {SubscribedThreadRecord} a
 * @param  {SubscribedThreadRecord} b
 * @return {number} Returns a "negative" number if `a` should come before `b`. Returns a "positive" number if `a` should come after `b`. Returns `0` if the order of `a` and `b` is irrelevant.
 */
export function compareSubscribedThreads(a, b, { userData }) {
	// Sort in reverse order by thread "rating".
	return -compareSubscribedThreadsByRating(a, b, { userData })
}

/**
 * Compares two threads by "rating".
 * @param  {SubscribedThreadRecord} a
 * @param  {SubscribedThreadRecord} b
 * @return {number} Returns a "negative" number if `a.rating` < `b.rating`. Returns a "positive" number if `a.rating` > `b.rating`. Returns `0` if `a.rating` ~= `b.rating`.
 */
function compareSubscribedThreadsByRating(a, b, { userData }) {
	// First, filter out expired threads.
	if (a.expired && b.expired) {
		// // Own threads have higher rating.
		// if (a.own && !b.own) {
		// 	return 1
		// } else if (!a.own && b.own) {
		// 	return -1
		// }
		// Later "expired at" dates have higher rating.
		if (a.expiredAt && b.expiredAt) {
			return compareDates(a.expiredAt, b.expiredAt)
		}
		return compareSubscribedThreadsFinal(a, b)
	} else if (a.expired && !b.expired) {
		return -1
	} else if (!a.expired && b.expired) {
		return 1
	}

	// At this stage, all threads haven't expired and haven't been archived
	// and haven't been locked.
	// Filter out threads without new comments.

	// A basic approximation,
	// because it's not known how many new comments are there.
	// We could store comment IDs in a subscribed thread record
	// in order to calculate how many new comments are there,
	// but that doesn't seem necessary as we don't display
	// unread comments count.
	const aNewCommentsCount = doesSubscribedThreadHaveNewComments(a, { userData }) ? 1 : 0
	const bNewCommentsCount = doesSubscribedThreadHaveNewComments(b, { userData }) ? 1 : 0

	if (!aNewCommentsCount && !bNewCommentsCount) {
		return compareSubscribedThreadsNoNewComments(a, b)
	} else if (aNewCommentsCount && !bNewCommentsCount) {
		return 1
	} else if (!aNewCommentsCount && bNewCommentsCount) {
		return -1
	}

	// At this stage, all threads have new comments.
	// Filter out threads having new replies.
	const aNewRepliesCount = getSubscribedThreadNewRepliesCount(a, { userData })
	const bNewRepliesCount = getSubscribedThreadNewRepliesCount(b, { userData })
	if (aNewRepliesCount && bNewRepliesCount) {
		// Own threads have higher rating.
		if (a.own && !b.own) {
			return 1
		} else if (!a.own && b.own) {
			return -1
		}
		// If the new replies count is equal in both threads,
		// then ignore new replies count when comparing them.
		if (aNewRepliesCount === bNewRepliesCount) {
			return compareSubscribedThreadsByNewCommentsCount(a, b, aNewCommentsCount, bNewCommentsCount)
		}
		// The more new replies, the higher the rating.
		return aNewRepliesCount - bNewRepliesCount
	} else if (aNewRepliesCount && !bNewRepliesCount) {
		return 1
	} else if (!aNewRepliesCount && bNewRepliesCount) {
		return -1
	}

	// At this stage, all threads have new comments,
	// and none of those new comments are new replies.

	// Own threads have higher rating.
	if (a.own && !b.own) {
		return 1
	} else if (!a.own && b.own) {
		return -1
	}

	return compareSubscribedThreadsByNewCommentsCount(a, b, aNewCommentsCount, bNewCommentsCount) ||
		compareDates(a.addedAt, b.addedAt)
}

function compareSubscribedThreadsNoNewComments(a, b) {
	// At this stage, all threads haven't expired.
	// Filter out archived threads.
	if (a.archived && b.archived) {
		// // Own threads have higher rating.
		// if (a.own && !b.own) {
		// 	return 1
		// } else if (!a.own && b.own) {
		// 	return -1
		// }
		// Later "archived at" dates have higher rating.
		if (a.archivedAt && b.archivedAt) {
			return compareDates(a.archivedAt, b.archivedAt)
		}
	} else if (a.archived && !b.archived) {
		return -1
	} else if (!a.archived && b.archived) {
		return 1
	}

	// At this stage, all threads haven't expired and aren't archived.
	// Filter out closed threads.
	if (a.locked && b.locked) {
		// // Own threads have higher rating.
		// if (a.own && !b.own) {
		// 	return 1
		// } else if (!a.own && b.own) {
		// 	return -1
		// }
		// // Later "locked at" dates have higher rating.
		// if (a.lockedAt && b.lockedAt) {
		// 	return compareDates(a.lockedAt, b.lockedAt)
		// }
	} else if (a.locked && !b.locked) {
		return -1
	} else if (!a.locked && b.locked) {
		return 1
	}

	// // Own threads have higher rating.
	// if (a.own && !b.own) {
	// 	return 1
	// } else if (!a.own && b.own) {
	// 	return -1
	// }

	return compareSubscribedThreadsFinal(a, b)
}

function compareSubscribedThreadsFinal(a, b) {
	// Later "added at" dates have higher rating.
	return compareDates(a.addedAt, b.addedAt)
}

// Most recently "added to the list" and most "active" threads first,
// and also most new comments first.
// The resulting rating is some sort of a "balance" between the two.
//
// The comparison rating algorithm is a naive one:
// it's not necessarily that it makes any sence.
//
function compareSubscribedThreadsByNewCommentsCount(a, b, aNewCommentsCount, bNewCommentsCount) {
	// Compute a "subscribed-for period" rating:
	// the shorter a thread have been subscribed for,
	// the higher its rating is.
	let subscriptionPeriodRatingRatio = 0

	// Assume the minumum significant time interval is 5 minutes.
	const aHasBeenSubscribedFor = Math.max(5 * MINUTE, Date.now() - a.addedAt.getTime())
	const bHasBeenSubscribedFor = Math.max(5 * MINUTE, Date.now() - b.addedAt.getTime())

	// The shorter a thread has been subscribed to for,
	// the higher its rating is.
	const interval = bHasBeenSubscribedFor - aHasBeenSubscribedFor

	// Compute the "relative" time interval.
	const relativeInterval = interval / (Math.min(aHasBeenSubscribedFor, bHasBeenSubscribedFor))

	// Increase the effect of the time difference.
	subscriptionPeriodRatingRatio = 5 * relativeInterval

	// The longer both threads have been subscribed to for,
	// the less impact has their subscription period rating.
	subscriptionPeriodRatingRatio *= agingFactor(Math.min(aHasBeenSubscribedFor, bHasBeenSubscribedFor))

	// Compute a thread "activity" rating.
	// Both `aNewCommentsCount` and `bNewCommentsCount`
	// are guaranteed to be non-zero here.
	const activityRatingRatio = aNewCommentsCount / bNewCommentsCount

	const resultingRatingRatio = activityRatingRatio + subscriptionPeriodRatingRatio

	if (resultingRatingRatio > 1) {
		return 1
	} else if (resultingRatingRatio < 1) {
		return -1
	} else {
		return 0
	}

	// // More new comments first.
	// return aNewCommentsCount - bNewCommentsCount
}

// Computes an "aging factor":
// `1` for intervals less than an AGE_THRESHOLD,
// then declines exponentially.
// For example, for 2 AGE_THRESHOLDs it's `0.367`,
// for 4 AGE_THRESHOLDs it's `0.049`,
// and for 7 AGE_THRESHOLDs it's `0.0025`.
const MINUTE = 60 * 1000
const DAY = 24 * 60 * MINUTE
const AGE_THRESHOLD = DAY
function agingFactor(age) {
	if (age < AGE_THRESHOLD) {
		return 1
	}
	return Math.exp(1) * Math.exp(-age/AGE_THRESHOLD)
}

function compareDates(a, b) {
	return a.getTime() - b.getTime()
}