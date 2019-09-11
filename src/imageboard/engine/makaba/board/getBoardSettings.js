export default function getBoardSettings(response) {
	return {
		maxCommentLength: response.max_comment,
		maxAttachmentsSize: response.max_files_size,
		areSubjectsAllowed: response.enable_subject === 1,
		areAttachmentsAllowed: response.enable_images === 1,
		areTagsAllowed: response.enable_thread_tags === 1,
		areBadgesAllowed: response.enable_icons === 1
	}
}