export const GRANULARITY = {
	seconds: 1000,
	minutes: 60 * 1000,
	hours: 60 * 60 * 1000,
	days: 24 * 60 * 60 * 1000
}

export default function roundTimestamp(timestamp, { granularity = 'seconds' } = {}) {
	return Math.floor(timestamp / GRANULARITY[granularity]) * GRANULARITY[granularity]
}