import type { UserDataTypeOperation } from "@/types"

export const setValue: UserDataTypeOperation = ({ encode }, previousValue, value) => {
	return encode(value)
}

export const removeValue: UserDataTypeOperation = ({}) => {
	return null
}

export const getValue: UserDataTypeOperation = ({ decode }, value) => {
	return decode(value)
}

// `value` is already encoded. No need to `encode()` it.
export const mergeWithValue: UserDataTypeOperation = ({ merge }, prevValue, value) => {
	if (prevValue !== undefined) {
		return merge(prevValue, value)
	}
	return value
}