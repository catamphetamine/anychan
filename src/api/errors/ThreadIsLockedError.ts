export class ThreadIsLockedError extends Error {
	constructor() {
		super('Thread is locked')
	}
}