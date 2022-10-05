import roundTimestamp, { GRANULARITY } from '../utility/roundTimestamp.js'

export function encodeDate(date, { granularity = 'seconds' } = {}) {
	return encodeTimestamp(date.getTime(), { granularity })
}

export function encodeTimestamp(timestamp, { granularity = 'seconds' } = {}) {
	return roundTimestamp(timestamp, { granularity }) / GRANULARITY[granularity]
}

export function decodeDate(value, { granularity = 'seconds' } = {}) {
	return new Date(value * GRANULARITY[granularity])
}