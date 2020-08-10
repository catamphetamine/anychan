// Sorts tracked threads in order:
// * Threads with new replies. Own threads first. More replies first.
// * Threads with new comments. Own threads first. More comments first.
// * Threads without new comments. Latest added first.
// * Expired threads. Latest added first.
export default function sortTrackedThreads(a, b) {
	// Expired threads go last.
	if (a.expired && b.expired) {
		// // Own threads first.
		// if (a.own && !b.own) {
		// 	return -1
		// } else if (!a.own && b.own) {
		// 	return 1
		// }
		// Later added ones first.
		return b.addedAt - a.addedAt
	} else if (a.expired && !b.expired) {
		return 1
	} else if (!a.expired && b.expired) {
		return -1
	}
	// Threads without new comments go before expired threads.
	if (!a.newCommentsCount && !b.newCommentsCount) {
		// // Own threads first.
		// if (a.own && !b.own) {
		// 	return -1
		// } else if (!a.own && b.own) {
		// 	return 1
		// }
		// Later added ones first.
		return b.addedAt - a.addedAt
	} else if (a.newCommentsCount && !b.newCommentsCount) {
		return -1
	} else if (!a.newCommentsCount && b.newCommentsCount) {
		return 1
	}
	// Threads with new replies first.
	if (a.newRepliesCount && b.newRepliesCount) {
		// Own threads first.
		if (a.own && !b.own) {
			return -1
		} else if (!a.own && b.own) {
			return 1
		}
		// More new replies first.
		if (a.newRepliesCount === b.newRepliesCount) {
			return compareThreadsByNewCommentsCount(b, a)
		}
		return b.newRepliesCount - a.newRepliesCount
	} else if (a.newRepliesCount && !b.newRepliesCount) {
		return -1
	} else if (!a.newRepliesCount && b.newRepliesCount) {
		return 1
	}
	// Threads with new comments left.
	// Own threads first.
	if (a.own && !b.own) {
		return -1
	} else if (!a.own && b.own) {
		return 1
	}
	return compareThreadsByNewCommentsCount(b, a)
}

function compareThreadsByNewCommentsCount(b, a) {
	// Most "recently watched" and "active" threads first.
	// AND
	// More new comments first.
	// The rating is some sort of a "balance" between the two.
	const aTrackedAge = Date.now() - a.addedAt
	const bTrackedAge = Date.now() - b.addedAt
	let bToATrackedAgeRating = 0
	if (bTrackedAge > 0) {
		bToATrackedAgeRating = (aTrackedAge / bTrackedAge) * ageFactor(Math.min(aTrackedAge, bTrackedAge)) * 1000
	}
	const bToANewCommentsRating = b.newCommentsCount / a.newCommentsCount
	const bToARating = bToATrackedAgeRating + bToANewCommentsRating
	if (bToARating > 1) {
		return 1
	} else if (bToARating < 1) {
		return -1
	} else {
		return 0
	}
	// // More new comments first.
	// return b.newCommentsCount - a.newCommentsCount
}

// "Age factor": is `1` for intervals less than a day,
// then declines exponentially.
// For example, for two days it's `0.367`,
// for four days it's `0.049`,
// and for a week it's `0.0025`.
const DAY = 24 * 60 * 60 * 1000
function ageFactor(age) {
	if (age < DAY) {
		return 1
	}
	return Math.exp(1) * Math.exp(-age/DAY)
}