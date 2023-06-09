// Places `pinned` threads on top, according to their `pinnedOrder`.
// Lower `pinnedOrder` means higher in the list.
export default function sortThreadsWithPinnedOnTop(threads, sortThreads) {
	return sortThreads(threads).sort((a, b) => {
		if (a.pinned && b.pinned) {
			if (!isNaN(a.pinnedOrder) && !isNaN(b.pinnedOrder)) {
				// Lower `pinnedOrder` is at the top.
				return a.pinnedOrder - b.pinnedOrder
			}
			if (isNaN(a.pinnedOrder) && !isNaN(b.pinnedOrder)) {
				// First `b`, then `a`.
				return 1
			}
			if (isNaN(b.pinnedOrder) && !isNaN(a.pinnedOrder)) {
				// First `a`, then `b`.
				return -1
			}
			// The order is not determined, so just leave the threads' positions as is.
			return 0
		}
		// `pinned` threads go above unpinned ones.
		if (a.pinned && !b.pinned) {
			return -1
		}
		if (!a.pinned && b.pinned) {
			return 1
		}
		// Neither of the threads are pinned.
		// The order is not determined, so just leave the threads' positions as is.
		return 0
	})
}