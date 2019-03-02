/**
 * Returns an object with reason if the comment doesn't pass the filter.
 * @param  {string} comment — Comment HTML
 * @param  {object} filters — Compiled filters
 * @return {object} [reason] `{ name }`
 */
export default function filter(comment, filters) {
	for (const filter of filters) {
		if (filter.test(comment)) {
			return {
				name: filter.name
			}
		}
	}
}