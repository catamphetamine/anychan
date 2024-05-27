import type { UserDataCollection } from '@/types'

// The latest known list of live (non-archived, non-expired) threads in a channel.
//
// Example: `threads/a = [123, 125, 130, ...]`.
//
export const threads: UserDataCollection = {
	name: 'threads',
	shortName: '📖',

	type: 'channels-threads'
}