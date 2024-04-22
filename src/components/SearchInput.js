import React, { useState, useCallback, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { TextInput } from 'react-responsive-ui'

import LoadingEllipsis from 'social-components-react/components/LoadingEllipsis.js'

import SearchIconOutline from 'frontend-lib/icons/fill-and-outline/search-outline.svg'

import './SearchInput.css'

function SearchInput({
	value,
	onChange,
	icon,
	placeholder,
	'aria-label': ariaLabel,
	items,
	getItemTextLowerCase,
	onResults,
	searchStartDelayAfterInputStop = 300,
	searchIterationMaxDuration = 16, // 60 fps transaltes into ~16 ms per frame
	// searchIterationMaxItems = 100,
	onEscapeKeyDownWhenEmpty,
	onBlurWhenEmpty,
	className,
	inputClassName
}, ref) {
	const [isEmpty, setEmpty] = useState(!value)
	const [isSearching, setSearching] = useState(false)

	const startSearchTimer = useRef()
	const nextSearchIterationTimer = useRef()

	const startSearch = useCallback((value) => {
		const searchQuery = value ? value.trim().toLowerCase() : ''
		if (!searchQuery) {
			setSearching(false)
			onResults(items, {
				query: undefined,
				finished: true
			})
			return
		}
		search({
			items,
			searchQuery,
			onResults: (results, parameters) => {
				if (parameters.finished) {
					setSearching(false)
				}
				onResults(results, parameters)
			},
			getItemTextLowerCase,
			searchIterationMaxDuration,
			// searchIterationMaxItems,
			nextSearchIterationTimer
		})
	}, [
		search,
		items,
		onResults,
		getItemTextLowerCase,
		searchIterationMaxDuration,
		// searchIterationMaxItems,
		nextSearchIterationTimer
	])

	const cancelSearch = useCallback(() => {
		clearTimeout(startSearchTimer.current)
		clearTimeout(nextSearchIterationTimer.current)
	}, [])

	const onChange_ = useCallback((newValue) => {
		// // When starting a new search process, show all `items` as results at first.
		// //
		// // The rationale is that the application code will show search results
		// // using `if (searchQueryValue)` condition, so this component should be written
		// // in such a way that every time `searchQueryValue` becomes non-empty,
		// // the search results that the application code already has by that time
		// // are the full list of items.
		// // Without this call of `onResults()`, the application code would have
		// // `undefined` for the list of results on the first search,
		// // and could potentially crash.
		// //
		// // It's sufficient to do this only the first time the user starts typing
		// // after focusing on an empty `<input/>` field.
		// // But having this run every time such situation happens won't result in any bugs
		// // so here it's run every time such situation happens just for simplicity.
		// //
		// const prevValue = value
		// if (!prevValue && newValue) {
		// 	onResults(items, {
		// 		query: undefined,
		// 		finished: true
		// 	})
		// }

		// Call `onChange()` with the new `value`.
		onChange(newValue)
	}, [
		// value,
		// items,
		// onResults,
		onChange
	])

	const prevValueRef = useRef(value)

	useEffect(() => {
		const prevValue = prevValueRef.current
		const newValue = value

		if (prevValue === newValue) {
			return
		}

		// Cancel any ongoing search.
		// Schedule a new one.
		cancelSearch()
		setSearching(true)
		startSearchTimer.current = setTimeout(
			() => startSearch(newValue),
			searchStartDelayAfterInputStop
		)

		// Add or remove "is empty" CSS class.
		setEmpty(!newValue)

		// When starting a new search process, show all `items` as results at first.
		//
		// The rationale is that the application code will show search results
		// using `if (searchQueryValue)` condition, so this component should be written
		// in such a way that every time `searchQueryValue` becomes non-empty,
		// the search results that the application code already has by that time
		// are the full list of items.
		// Without this call of `onResults()`, the application code would have
		// `undefined` for the list of results on the first search,
		// and could potentially crash.
		//
		// This should be done every time the user starts typing
		// after having cleared the `<input/>` field,
		// not just the first time they do that.
		//
		if (!prevValue && newValue) {
			onResults(items, {
				query: undefined,
				finished: true
			})
		}

		prevValueRef.current = newValue
	}, [value])

	useEffect(() => {
		return () => {
			cancelSearch()
		}
	}, [])

	const onKeyDown = useCallback((event) => {
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}

		switch (event.keyCode) {
			// "Escape".
			// Collapse.
			case 27:
				if (!value) {
					if (onEscapeKeyDownWhenEmpty) {
						onEscapeKeyDownWhenEmpty()
					}
				}
				return
		}
	}, [
		value,
		onEscapeKeyDownWhenEmpty
	])

	const onBlur = useCallback(() => {
		if (!value) {
			if (onBlurWhenEmpty) {
				onBlurWhenEmpty()
			}
		}
	}, [
		value,
		onBlurWhenEmpty
	])

	return (
		<div className={classNames(className, 'SearchInput', {
			'SearchInput--empty': isEmpty
		})}>
			{icon &&
				<SearchIconOutline
					className="SearchInput-icon"/>
			}

			<TextInput
				ref={ref}
				value={value}
				onChange={onChange_}
				type="search"
				onKeyDown={onKeyDown}
				onBlur={onBlur}
				aria-label={ariaLabel}
				placeholder={placeholder}
				className={classNames(inputClassName, 'SearchInput-input', {
					'SearchInput-input--withIcon': icon
				})}
			/>

			{isSearching && (
				<>
					<div className="SearchInput-loadingEllipsisBackgrond"/>
					<LoadingEllipsis className="SearchInput-loadingEllipsis"/>
				</>
			)}
		</div>
	)
}

SearchInput = React.forwardRef(SearchInput)

SearchInput.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func.isRequired,

	icon: PropTypes.bool,

	placeholder: PropTypes.string,

	// A list of items to search in.
	items: PropTypes.arrayOf(PropTypes.any).isRequired,

	// A function that returns `item`'s text in lower case.
	getItemTextLowerCase: PropTypes.func.isRequired,

	// `onResults()` will get called multiple times during the search.
	// The arguments are:
	// * results: any[]
	// * { finished: boolean, duration?: number, query?: string }
	//   * query?: string — Search query, `undefined` means empty.
	//   * finished: boolean — Has the search concluded or not yet.
	//   * duration: number — Search duration.
	//     * If the search hasn't `finished` yet, there'll be no `duration` property.
	//     * If it wasn't really a search — if search query was cleared — there'll be no `duration` property.
	onResults: PropTypes.func.isRequired,

	// A delay to start the search after the user has stopped typing.
	searchStartDelayAfterInputStop: PropTypes.number,

	// Max duration of a a single iteration.
	searchIterationMaxDuration: PropTypes.number,

	// Max items to process in a single iteration.
	searchIterationMaxItems: PropTypes.number,

	onEscapeKeyDownWhenEmpty: PropTypes.func,
	onBlurWhenEmpty: PropTypes.func,

	className: PropTypes.string,
	inputClassName: PropTypes.string
}

export default SearchInput

// Searches in `items` for a given `searchQuery`.
// Calls `onResults()` with the results and a `finished: boolean` flag.
function search({
	items,
	searchQuery,
	fromIndex = 0,
	startedAt = Date.now(),
	results = [],
	onResults,
	getItemTextLowerCase,
	searchIterationMaxDuration,
	// searchIterationMaxItems,
	nextSearchIterationTimer
}) {
	// Doesn't push directly into `results` to prevent "mutating" it
	// because it might already be rendered on a page.
	// Instead, it returns a new copy of `results` on every iteration.
	const newResults = []

	const iterationStartedAt = Date.now()

	let i = fromIndex
	while (i < items.length) {
		const iterationDuration = Date.now() - iterationStartedAt

		// See if this iteration should be finished.
		// if (i - fromIndex === searchIterationMaxItems) {
		if (iterationDuration >= searchIterationMaxDuration) {
			results = results.concat(newResults)

			// Report the results so far.
			onResults(results, {
				query: searchQuery,
				finished: false
			})

			// Schedule next iteration.
			clearTimeout(nextSearchIterationTimer.current)
			// Could use `requestIdleCallback()` for spacing out iterations
			// but it's not supported in Safari:
			// https://caniuse.com/?search=requestIdleCallback
			nextSearchIterationTimer.current = setTimeout(() => {
				search({
					items,
					searchQuery,
					fromIndex: i,
					startedAt,
					results,
					onResults,
					getItemTextLowerCase,
					// searchIterationMaxItems,
					searchIterationMaxDuration,
					nextSearchIterationTimer
				})
			}, 0)
			return
		}

		// See if the `item` matches the `searchQuery`.
		// If it does, add it to the results.
		const item = items[i]
		if (getItemTextLowerCase(item).includes(searchQuery)) {
			newResults.push(item)
		}

		i++
	}

	const endedAt = Date.now()
	onResults(results.concat(newResults), {
		query: searchQuery,
		finished: true,
		duration: endedAt - startedAt
	})
}
