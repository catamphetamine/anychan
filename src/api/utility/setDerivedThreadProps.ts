import { Thread, ThreadFromDataSource } from "@/types";

export default function setDerivedThreadProps(thread: ThreadFromDataSource) {
	// Added this assignment to fix TypeScript error.
	const thread_ = thread as Thread

	// The attachments count in comments of the thread.
	// Doesn't include the attachments in the Original Post of the thread.
	thread_.commentAttachmentsCount = thread.attachmentsCount - (thread.comments[0].attachments ? thread.comments[0].attachments.length : 0)
}