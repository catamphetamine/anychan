import type { SubscribedThread, SubscribedThreadState, UserData, Dispatch } from "@/types"
import type SubscribedThreadsUpdater from '../SubscribedThreadsUpdater/SubscribedThreadsUpdater.js'

import addSubscribedThread from './addSubscribedThread.js'

// `restoreSubscribedThread()` function is called in cases when a user accidentally
// unsubscribes from a thread by clicking the "x" button, and then clicks "Undo",
// which restores the subscribed thread record.
export default function restoreSubscribedThread({
	subscribedThread,
	subscribedThreadState,
	dispatch,
	userData,
	subscribedThreadsUpdater
}: {
	subscribedThread: SubscribedThread,
	subscribedThreadState: SubscribedThreadState,
	dispatch: Dispatch,
	userData: UserData,
	subscribedThreadsUpdater?: SubscribedThreadsUpdater
}) {
	addSubscribedThread({
		subscribedThread,
		subscribedThreadState,
		dispatch,
		userData,
		subscribedThreadsUpdater
	})
}