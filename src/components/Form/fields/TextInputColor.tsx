import React, { useCallback, useState, useMemo, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

import { HexAlphaColorPicker, HexColorPicker } from 'react-colorful'

import Button from 'frontend-lib/components/Button.js'
import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'

import TextInput from './TextInput.js'

import { useMessages } from '@/hooks'

import './TextInputColor.css'

const TextInputColor = React.forwardRef<HTMLInputElement, TextInputColorProps>(({
	wait,
	value,
	onChange,
	...rest
}, ref) => {
	const messages = useMessages()

	const container = useRef<HTMLDivElement>()
	const button = useRef<HTMLButtonElement>()

	const [showColorPicker, setShowColorPicker] = useState(false)
	const [skipShowingColorPickerOnClick, setSkipShowingColorPickerOnClick] = useState(false)

	const onButtonClick = useCallback(() => {
		if (!showColorPicker) {
			// Just `if (!showColorPicker)` condition alone didn't work here:
			// by the time the `<button/>`'s `onClick` handler gets called,
			// `showColorPicker` has already been set to `false` by the color picker's `onBlur` handler.
			//
			// To work around that, an additional state variable `skipShowingColorPickerOnClick` was introduced.
			//
			// It still has "false positives" in some edge cases though: for example, when opening the color picker
			// by clicking the button and then mouse-down-ing the button to close the color picker and then moving
			// the mouse cursor to some other element and only then mouse-upping: in that case, the color picker
			// won't open next time the user clicks the button. But I consider that bug non-critical.
			//
			if (skipShowingColorPickerOnClick) {
				setSkipShowingColorPickerOnClick(false)
			} else {
				setShowColorPicker(true)
			}
		}
	}, [
		showColorPicker,
		setShowColorPicker,
		skipShowingColorPickerOnClick,
		setSkipShowingColorPickerOnClick
	])

	const onTextChange = useCallback((value?: string) => {
		onChange(value)
		setShowColorPicker(false)
	}, [
		onChange,
		setShowColorPicker
	])

	const onColorPickerBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
		if (event.relatedTarget) {
			if (event.relatedTarget === button.current) {
				setSkipShowingColorPickerOnClick(true)
			} else {
				if (container.current) {
					const colorPickerElement: HTMLDivElement = container.current.querySelector('.react-colorful')
					if (colorPickerElement) {
						// https://developer.mozilla.org/en-US/docs/Web/API/Node/contains
						if (colorPickerElement.contains(event.relatedTarget)) {
							return
						}
					}
				}
			}
		}
		setShowColorPicker(false)
	}, [
		setShowColorPicker
	])

  const onColorChosen = useCallback((value: string) => {
		onChange(value)
	}, [
		onChange
	])

	const buttonStyle = useMemo(() => ({
		backgroundColor: value ? (isValidColor(value.trim()) ? value.trim() : undefined) : undefined
	}), [
		value
	])

	useEffectSkipMount(() => {
		if (showColorPicker) {
			if (container.current) {
				const colorPickerInteractiveElement: HTMLDivElement = container.current.querySelector('.react-colorful__interactive')
				if (colorPickerInteractiveElement) {
					colorPickerInteractiveElement.focus()
				}
			}
		}
	}, [
		showColorPicker
	])

	return (
		<div ref={container} className="TextInputColor">
			<TextInput
				ref={ref}
				{...rest}
				wait={wait}
				value={value}
				onChange={onTextChange}
				className="TextInputColor-input"
			/>
			<Button
				ref={button}
				aria-hidden
				disabled={wait}
				style={buttonStyle}
				className="TextInputColor-button"
				onClick={onButtonClick}>
			</Button>
			{showColorPicker && (
				<HexAlphaColorPicker
					color={value || '#ffffffff'}
					onChange={onColorChosen}
					onBlur={onColorPickerBlur}
					className="TextInputColor-colorPicker"
				/>
			)}
		</div>
	)
})

TextInputColor.propTypes = {
	wait: PropTypes.bool,
	value: PropTypes.string,
	onChange: PropTypes.func.isRequired
}

interface TextInputColorProps {
	wait?: boolean,
	value?: string,
	onChange: (value?: string) => void
}

export default TextInputColor

export function isValidColor(value: string): boolean {
	return /^#[0-9A-F]{6}$/i.test(value) || /^#[0-9A-F]{8}$/i.test(value)
}