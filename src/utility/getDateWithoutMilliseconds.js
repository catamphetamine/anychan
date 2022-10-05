import roundTimestamp from './roundTimestamp.js'

export default function getDateWithoutMilliseconds(date) {
	return new Date(roundTimestamp(date.getTime(), { granularity: 'seconds' }))
}