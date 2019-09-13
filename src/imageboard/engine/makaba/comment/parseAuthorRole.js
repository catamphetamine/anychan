export default function parseAuthorRole(tripCode) {
	switch (tripCode) {
		case '!!%adm%!!':
			return 'administrator'
		case '!!%mod%!!':
			return 'moderator'
		default:
			// Users can have their own trip codes.
			// Example: "!!5pvF7WEJc."
	}
}