export default function parseAuthor(name, { defaultAuthorName }) {
	if (name === defaultAuthorName) {
		return
	}
	return name
}