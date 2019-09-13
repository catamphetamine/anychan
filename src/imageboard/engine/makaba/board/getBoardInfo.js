export default function getBoardInfo(response) {
	const board = {
		title: response.BoardName,
		defaultAuthorName: response.default_name,
		bumpLimit: response.bump_limit,
		maxCommentLength: response.max_comment,
		maxAttachmentsSize: response.max_files_size,
		areSubjectsAllowed: response.enable_subject === 1,
		areAttachmentsAllowed: response.enable_images === 1,
		areTagsAllowed: response.enable_thread_tags === 1,
		hasVoting: response.enable_likes === 1,
		hasFlags: response.enable_flags === 1
	}
	if (response.enable_icons === 1 && response.icons) {
		board.badges = response.icons.map(({ name, num }) => ({ id: num, title: name }))
	}
	return board
}