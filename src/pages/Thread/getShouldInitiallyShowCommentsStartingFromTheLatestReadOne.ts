export default function getShouldInitiallyShowCommentsStartingFromTheLatestReadOne({
	requestedCommentIndex,
	initialLatestReadCommentIndex
}: {
	requestedCommentIndex?: number,
	initialLatestReadCommentIndex?: number
}) {
	return requestedCommentIndex === undefined && initialLatestReadCommentIndex !== undefined
}