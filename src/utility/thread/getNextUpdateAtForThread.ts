import type { DataPollingRate } from '@/types'

import getConfiguration from '../../getConfiguration.js'

const REFRESH_ERROR_UPDATE_DELAY = 60 * 1000

// Calculates time to next update for thread auto update process.
// Returns a `number`.
export default function getNextUpdateAtForThread(prevUpdateAt: number, {
	refreshErrorDate,
	refreshErrorCount,
	...options
}: {
	refreshErrorDate?: Date,
	refreshErrorCount?: number,
	latestCommentDate: Date,
	beforeLatestCommentDate?: Date,
	backgroundMode?: boolean
}): number {
	if (refreshErrorCount) {
		const usualNextUpdateAt = getNextUpdateAtForThread(prevUpdateAt, options)
		const certainErrorsCount = Math.min(refreshErrorCount - 1, 10)
		return Math.max(
			usualNextUpdateAt,
			refreshErrorDate.getTime() + certainErrorsCount * certainErrorsCount * certainErrorsCount * REFRESH_ERROR_UPDATE_DELAY
		)
	}

	const {
		latestCommentDate,
		beforeLatestCommentDate,
		backgroundMode
	} = options

	// Get time to next update based on the latest comment's date:
	// if there're recent comments in the thread then update it often,
	// if there're no recent comments in the thread then update it rarely.
	const nextUpdateAtBasedOnLatestComment = getNextUpdateAtForIdleTime(
		prevUpdateAt,
		prevUpdateAt - latestCommentDate.getTime(),
		backgroundMode ? THREAD_UPDATE_INTERVALS_IN_BACKGROUND_MODE : THREAD_UPDATE_INTERVALS
	)

	if (!backgroundMode) {
		// Also look at the comment before the latest one:
		// if that comment has been left recently then it means that there're
		// at least two comments in this thread that have been left recently.
		// That could be an active ongoing conversation between two users.
		// Such threads get auto-updated a bit more often, since there's a real-time dialogue.
		if (beforeLatestCommentDate) {
			const conversationIdleTime = prevUpdateAt - beforeLatestCommentDate.getTime()
			const realtimeConversationMaxIdleTime = ONGOING_CONVERSATION_UPDATE_INTERVALS[ONGOING_CONVERSATION_UPDATE_INTERVALS.length - 1].maxIdleTime

			// If there is an active real-time conversation then update the thread more often.
			if (conversationIdleTime <= realtimeConversationMaxIdleTime) {
				// How often — that depends on the recentness of the last two comments in the thread.
				const nextUpdateAtForRealtimeConversation = getNextUpdateAtForIdleTime(
					prevUpdateAt,
					conversationIdleTime,
					ONGOING_CONVERSATION_UPDATE_INTERVALS
				)

				// From several intervals to next thread update, choose the shortest one.
				return Math.min(
					nextUpdateAtBasedOnLatestComment,
					nextUpdateAtForRealtimeConversation
				)
			}
		}
	}

	return nextUpdateAtBasedOnLatestComment
}

// Returns next thread update timestamp based on the thread's "idle time".
function getNextUpdateAtForIdleTime(prevUpdateAt: number, idleTime: number, updateIntervals: UpdateInterval[]) {
	// `idleTime` could be `< 0` if the server's or the client's clock is off.
	return prevUpdateAt + getUpdateIntervalForIdleTime(idleTime, updateIntervals)
}

const second = 1000
const minute = 60 * second
const hour = 60 * minute
const day = 24 * hour

const THREAD_UPDATE_INTERVALS_SLOW = [
	{ maxIdleTime:   2 * minute, updateInterval:   1 * minute },
	{ maxIdleTime:   5 * minute, updateInterval: 2.5 * minute },
	{ maxIdleTime:  10 * minute, updateInterval:   5 * minute },
	{ maxIdleTime:  15 * minute, updateInterval:  10 * minute },
	{ maxIdleTime:  30 * minute, updateInterval:  15 * minute },
	{ maxIdleTime:   1 * hour,   updateInterval:  30 * minute },
	{ maxIdleTime:   3 * hour,   updateInterval:   1 * hour   },
	{ maxIdleTime:   6 * hour,   updateInterval:   2 * hour   },
	{ maxIdleTime:  12 * hour,   updateInterval:   4 * hour   },
	{ maxIdleTime:   1 * day,    updateInterval:   8 * hour   },
	{ maxIdleTime:   7 * day,    updateInterval:  16 * hour   },
	{                            updateInterval:   1 * day    }
]

const THREAD_UPDATE_INTERVALS_NORMAL = [
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

const THREAD_UPDATE_INTERVALS = getThreadUpdateIntervals(getConfiguration().dataPollingRate)

// The minimum update interval for "background" mode is "1 minute".
const THREAD_UPDATE_INTERVALS_IN_BACKGROUND_MODE = THREAD_UPDATE_INTERVALS.filter(
	interval => interval.updateInterval >= 1 * minute
)

const ONGOING_CONVERSATION_UPDATE_INTERVALS_SLOW = [
	{ maxIdleTime:   1 * minute, updateInterval: 15 * second },
	{ maxIdleTime:   2 * minute, updateInterval: 20 * second },
	{ maxIdleTime:   5 * minute, updateInterval: 25 * second }
]

const ONGOING_CONVERSATION_UPDATE_INTERVALS_NORMAL = [
	{ maxIdleTime:   1 * minute, updateInterval: 12 * second },
	{ maxIdleTime:   2 * minute, updateInterval: 15 * second },
	{ maxIdleTime:   5 * minute, updateInterval: 25 * second }
]

interface UpdateInterval {
	maxIdleTime?: number;
	updateInterval: number;
}

const ONGOING_CONVERSATION_UPDATE_INTERVALS = getOngoingConversationUpdateIntervals(getConfiguration().dataPollingRate)

/**
 * Returns thread update interval based on its "idle" time.
 * @param  {number} idleTime — How long (in milliseconds) there haven't been any new comments in the thread.
 * @return {number}
 */
function getUpdateIntervalForIdleTime(idleTime: number, UPDATE_INTERVALS: UpdateInterval[]) {
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

function getThreadUpdateIntervals(dataPollingRate: DataPollingRate) {
	switch (dataPollingRate) {
		case 'normal':
			return THREAD_UPDATE_INTERVALS_NORMAL
		case 'slow':
			return THREAD_UPDATE_INTERVALS_SLOW
		default:
			throw new Error(`Unknown "dataPollingRate": "${dataPollingRate}"`)
	}
}

function getOngoingConversationUpdateIntervals(dataPollingRate: DataPollingRate) {
	switch (dataPollingRate) {
		case 'normal':
			return ONGOING_CONVERSATION_UPDATE_INTERVALS_NORMAL
		case 'slow':
			return ONGOING_CONVERSATION_UPDATE_INTERVALS_SLOW
		default:
			throw new Error(`Unknown "dataPollingRate": "${dataPollingRate}"`)
	}
}

function getThreadUpdateIntervalsInBackgroundMode(dataPollingRate: DataPollingRate) {
	switch (dataPollingRate) {
		case 'normal':
			return getThreadUpdateIntervals('slow')
		case 'slow':
			return getThreadUpdateIntervals('slow')
		default:
			throw new Error(`Unknown "dataPollingRate": "${dataPollingRate}"`)
	}
}