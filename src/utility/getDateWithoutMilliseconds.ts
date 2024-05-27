import roundTimestamp from './roundTimestamp.js'

export default function getDateWithoutMilliseconds(date: Date) {
	return new Date(roundTimestamp(date.getTime(), { granularity: 'seconds' }))
}