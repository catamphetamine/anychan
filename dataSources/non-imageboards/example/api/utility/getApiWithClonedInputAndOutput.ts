import type { DataSource } from '@/types'

import { cloneDeep } from 'lodash-es'

// "Deeply" clones the API's input and output.
//
// The reason is that the "example" data source doesn't use any HTTP and operates on the data
// that sits in the same memory as the application's data, which could result in the application
// "polluting" the API's data if not cloned before being returned.
//
// The application does "pollute" `thread` objects when it calls `addThreadProps()` function
// that mutates the `thread` object and its `comments` too.
//
// Also, when the application performs an "auto-update" procedure, it applies the new updates
// over the old `thread` object, so it does mutate the `thread` object there too.
//
export default function getApiWithClonedInputAndOutput(api: DataSource['api']) {
	// @ts-expect-error
	const clonedApi: typeof api = {}
	for (const key of Object.keys(api) as Array<keyof typeof api>) {
		clonedApi[key] = (...args: any[]) => {
			return api[key].apply(this, cloneDeep(args)).then(
				(result: any) => cloneDeep(result)
			)
		}
	}
	return clonedApi
}