import roundTimestamp, { GRANULARITY } from '../utility/roundTimestamp.js'

export function encodeDate(
	date: Date,
	{ granularity = 'seconds' }: { granularity?: keyof typeof GRANULARITY } = {}
) {
	return encodeTimestamp(date.getTime(), { granularity })
}

export function encodeTimestamp(
	timestamp: number,
	{ granularity = 'seconds' }: { granularity?: keyof typeof GRANULARITY } = {}
) {
	return roundTimestamp(timestamp, { granularity }) / GRANULARITY[granularity]
}

export function decodeDate(
	value: number,
	{ granularity = 'seconds' }: { granularity?: keyof typeof GRANULARITY } = {}
) {
	return new Date(value * GRANULARITY[granularity])
}