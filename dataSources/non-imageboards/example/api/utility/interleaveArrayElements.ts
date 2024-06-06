// https://stackoverflow.com/questions/31879576/what-is-the-most-elegant-way-to-insert-objects-between-array-elements
export default function interleaveArrayElements<E = any, S = any>(array: E[], separator: S): (E | S)[] {
	return [].concat(...array.map(element => [element, separator])).slice(0, -1)
}
