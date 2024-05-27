export const GRANULARITY = {
	seconds: 1000,
	minutes: 60 * 1000,
	hours: 60 * 60 * 1000,
	days: 24 * 60 * 60 * 1000
} as const

export default function roundTimestamp(
	timestamp: number,
	{ granularity = 'seconds' }: { granularity?: keyof typeof GRANULARITY } = {}
) {
	return Math.floor(timestamp / GRANULARITY[granularity]) * GRANULARITY[granularity]
}