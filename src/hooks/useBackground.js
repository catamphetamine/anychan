import { useSelector } from 'react-redux'

export default function useBackground() {
	const backgroundLightMode = useSelector(state => state.app.backgroundLightMode)
	const backgroundDarkMode = useSelector(state => state.app.backgroundDarkMode)

	const darkMode = useSelector(state => state.app.darkMode)

	return darkMode ? backgroundDarkMode : backgroundLightMode
}