/**
 * Parses "vote" API response.
 * @param  {object} response
 * @return {boolean} Returns `true` if the vote has been accepted. Returns `false` if the user has already voted for this thread or comment.
 */
export default function parseVoteResponse(response) {
	if (response.Error) {
		// "Вы уже двачевали этот пост."
		if (response.Error === -4) {
			return false
		}
		throw new Error(response.Reason)
	}
	if (response.Status !== 'OK') {
		throw new Error(response.Status)
	}
	return true
}