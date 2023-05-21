// "Context" contains various stuff related to the current user session:
//
// * userData
// * userSettings
// * dataSource
// * dataSourceAlias
// * multiDataSource

let context

export function setContext(context_) {
	if (typeof window === 'undefined') {
		throw new Error('Context can only be set on client side, not on server side. Otherwise, it will be shared between different users.')
	}
	context = context_
}

export function getContext() {
	return context
}