export default function getTimeToNextThreadUpdate(latestUpdatedAt, latestCommentDate, beforeLatestCommentDate) {
	const timeToNextUpdateBasedOnLatestComment = getNextThreadUpdateTimestamp(
		latestUpdatedAt,
		latestCommentDate,
		THREAD_UPDATE_INTERVALS
	) - Date.now()
	if (beforeLatestCommentDate) {
		const conversationIdleTime = latestUpdatedAt - getTimestamp(beforeLatestCommentDate)
		const maxConversationIdleTime = CONVERSATION_UPDATE_INTERVALS[CONVERSATION_UPDATE_INTERVALS.length - 1].maxIdleTime
		if (conversationIdleTime <= maxConversationIdleTime) {
			const timeToNextUpdateBasedOnLatestConversation = getNextThreadUpdateTimestamp(
				latestUpdatedAt,
				beforeLatestCommentDate,
				CONVERSATION_UPDATE_INTERVALS
			) - Date.now()
			return Math.min(
				timeToNextUpdateBasedOnLatestComment,
				timeToNextUpdateBasedOnLatestConversation
			)
		}
	}
	return timeToNextUpdateBasedOnLatestComment
}

function getNextThreadUpdateTimestamp(latestUpdatedAt, latestCommentDate, UPDATE_INTERVALS) {
	// Could be `< 0` if the server's or the client's time's off.
	const idleTime = latestUpdatedAt - getTimestamp(latestCommentDate)
	return latestUpdatedAt + getThreadUpdateInterval(idleTime, UPDATE_INTERVALS)
}

const second = 1000
const minute = 60 * second
const hour = 60 * minute
const day = 24 * hour

const THREAD_UPDATE_INTERVALS = [
	{ maxIdleTime:   2 * minute, updateInterval: 30 * second },
	{ maxIdleTime:   5 * minute, updateInterval: 45 * second },
	{ maxIdleTime:  10 * minute, updateInterval:  1 * minute },
	{ maxIdleTime:  15 * minute, updateInterval:  2 * minute },
	{ maxIdleTime:  30 * minute, updateInterval:  3 * minute },
	{ maxIdleTime:   1 * hour,   updateInterval:  5 * minute },
	{ maxIdleTime:   3 * hour,   updateInterval: 10 * minute },
	{ maxIdleTime:   6 * hour,   updateInterval: 20 * minute },
	{ maxIdleTime:  12 * hour,   updateInterval: 25 * minute },
	{ maxIdleTime:   1 * day,    updateInterval: 30 * minute },
	{ maxIdleTime:   7 * day,    updateInterval:  1 * hour   },
	{ maxIdleTime:  14 * day,    updateInterval:  3 * hour   },
	{ maxIdleTime:  30 * day,    updateInterval: 12 * hour   },
	{                            updateInterval:  1 * day    }
]

const CONVERSATION_UPDATE_INTERVALS = [
	{ maxIdleTime:   1 * minute, updateInterval: 12 * second },
	{ maxIdleTime:   2 * minute, updateInterval: 15 * second },
	{ maxIdleTime:   5 * minute, updateInterval: 25 * second }
]

/**
 * Returns thread update interval based on its "idle" time.
 * @param  {number} idleTime — How long (in milliseconds) there haven't been any new comments in the thread.
 * @return {number}
 */
function getThreadUpdateInterval(idleTime, UPDATE_INTERVALS) {
	var i = 0
	while (i < UPDATE_INTERVALS.length) {
		const { maxIdleTime, updateInterval } = UPDATE_INTERVALS[i]
		// The last interval doesn't have `maxIdleTime`.
		if (i === UPDATE_INTERVALS.length - 1) {
			return updateInterval
		}
		if (idleTime <= maxIdleTime) {
			return updateInterval
		}
		i++
	}
}

function getTimestamp(dateOrTimestamp) {
	return typeof dateOrTimestamp === 'number' ? dateOrTimestamp : dateOrTimestamp.getTime()
}