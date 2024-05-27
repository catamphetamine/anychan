import type { Mode, Comment, ThreadId } from "@/types"

export default function useCompact({
	compact,
	mode,
	comment,
	threadId
}: {
	compact: boolean,
	mode: Mode,
	comment: Comment,
	threadId: ThreadId
}) {
	if (typeof compact === 'boolean') {
		return compact
	}

	if (mode === 'thread') {
		// "Main" comment — not compact.
		// Other comments — compact.
		return comment.id !== threadId
	}

	if (mode === 'channel') {
		// "Main" comment — not compact.
		// "Latest" comments — compact.
		return comment.id !== threadId
	}

	return false
}