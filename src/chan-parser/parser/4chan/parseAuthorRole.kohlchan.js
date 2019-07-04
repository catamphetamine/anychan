// `kohlchan.net` doesn't have "cap codes".
export default function parseRole(name) {
	switch (name) {
		case 'Helmut':
			return 'administrator'
		case 'Moderation':
			return 'moderator'
	}
}