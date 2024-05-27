export default function isObject(variable: any) {
	return typeof variable === 'object' && variable !== null
}