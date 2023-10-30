export default class ChannelIsLockedError extends Error {
	constructor() {
		super('Channel is locked')
	}
}