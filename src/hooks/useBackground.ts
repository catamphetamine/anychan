import { useSelector } from 'react-redux'

export default function useBackground(): string {
	// @ts-expect-error
	const backgroundLightMode = useSelector(state => state.app.backgroundLightMode)
	// @ts-expect-error
	const backgroundDarkMode = useSelector(state => state.app.backgroundDarkMode)

	// @ts-expect-error
	const darkMode = useSelector(state => state.app.darkMode)

	return darkMode ? backgroundDarkMode : backgroundLightMode
}