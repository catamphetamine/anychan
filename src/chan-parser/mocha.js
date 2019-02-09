const mute = true

export const describe = (name, func) => {
	if (!mute) {
		console.log(name)
	}
	func()
}

export const it = (name, func) => {
	if (!mute) {
		console.log(' * ' + name)
	}
	func()
}