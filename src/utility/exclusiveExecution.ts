import { Timer } from 'web-browser-timer'
import { LockFail, LockSuccess } from 'web-browser-tab'

import Lock from './Lock.js'

// Randomize a retry delay between different tabs
// so that multiple tabs don't start the process simultaneously.
//
// Sidenote: Some web browsers limit `setTimeout()` delay to be 1 second minimum
// for background tabs, so this delay will only be less that 1 second for a foreground tab.
//
const RETRY_DELAY_SPREAD = 300

const MAX_ATTEMPTS = 5

const TIMEOUT = 60 * 1000

const debug = (...args: any[]) => console.log(['Exclusive Execution'].concat(args))

interface Parameters {
	name: string;
	timer?: Timer;
	timeout?: number;
	condition: () => boolean;
	attemptsCount?: number;
}

export default async function exclusiveExecution(func: Function, {
	name,
	timer = new Timer(),
	timeout = TIMEOUT,
	condition,
	attemptsCount = 1
}: Parameters): Promise<void> {
	// Check if the action should be performed.
	if (!condition()) {
		return
	}

	if (attemptsCount > MAX_ATTEMPTS) {
		throw new Error(`The maximum number of attempts reached while attempting to run "${name}"`)
	}

	const retry = async (delay: number) => {
		// Randomize the wait timeout for different tabs
		// so that they don't retry all at once.
		delay += Math.random() * RETRY_DELAY_SPREAD
		await timer.waitFor(delay)
		return await exclusiveExecution(func, {
			name,
			timer,
			timeout,
			condition,
			attemptsCount: attemptsCount + 1
		})
	}

	const lock = new Lock(name + '.Exclusive-Execution.Lock', {
		timeout,
		log: debug
	})

	// Acquire a lock.
	const lockResult = await lock.acquire()

	if (lockResult instanceof LockFail) {
		return await retry(lockResult.retryAfter)
	}

	// Check if some other tab has already performed the action.
	if (!condition()) {
		return
	}

	try {
		return await func()
	} finally {
		lockResult.releaseLock()
	}
}