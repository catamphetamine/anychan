import onUserDataExternalChange from './onUserDataExternalChange.js'

export default function addUserDataExternalChangeListener({
	dispatch,
	userData
}) {
	// Listen to `UserData` changes coming from other browser tabs.
	userData.onExternalChange(({
		collection,
		metadata,
		value
	}) => {
		onUserDataExternalChange({
			collection,
			metadata,
			value,
			dispatch,
			userData
		})
	})
}