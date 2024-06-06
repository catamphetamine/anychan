import { CommentId } from "@/types"

export default function getInReplyToIds(text: string): CommentId[] | undefined {
	if (!text) {
		return
	}
	const results = text.matchAll(/>>(\d+)/g)
	const ids = []
	for (const match of results) {
		ids.push(Number(match[1]))
	}
	if (ids.length === 0) {
		return
	}
	return ids
}
