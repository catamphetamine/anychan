import React, { useState, useCallback, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// @ts-expect-error
import { TextInput } from 'react-responsive-ui'

import LoadingEllipsis from 'social-components-react/components/LoadingEllipsis.js'

import SearchIconOutline from 'frontend-lib/icons/fill-and-outline/search-outline.svg'

import './SearchInput.css'

// A generic "search" input.
//
// The application is supposed to pass either `async findItems(searchQuery)` function
// or a set of all possible `items` and a `getItemTextLowerCase()` function.
//
const SearchInput = React.forwardRef(<Item extends unknown>({
	value,
	onChange,
	autoFocus,
	icon,
	placeholder,
	'aria-label': ariaLabel,
	items,
	getItemTextLowerCase,
	findItems,
	onResults,
	onError,
	searchStartDelayAfterInputStop,
	searchIterationMaxDuration = 16, // 60 fps transaltes into ~16 ms per frame
	// searchIterationMaxItems = 100,
	onEscapeKeyDownWhenEmpty,
	onBlurWhenEmpty,
	className,
	inputClassName
}: SearchInputProps<Item>, ref: React.ForwardedRef<HTMLInputElement>) => {
	// Set default value for `searchStartDelayAfterInputStop`.
	if (searchStartDelayAfterInputStop === undefined) {
		if (findItems) {
			// Asynchrnonous search has a small delay to prevent sending too much network requests in a second.
			searchStartDelayAfterInputStop = 160
		} else {
			// Synchronous search starts immediately because there're no network requests.
			searchStartDelayAfterInputStop = 0
		}
	}

	const [isEmpty, setEmpty] = useState(!value)
	const [isSearching, setSearching] = useState(false)

	const latestSearchState = useRef<SearchState>()
	const startSearchTimer = useRef<number>()
	const nextSearchIterationTimer = useRef<number>()

	const startSearch = useCallback((searchInputValue?: string) => {
		const searchQuery = searchInputValue ? searchInputValue.trim().toLowerCase() : ''

		const searchState: SearchState = {
			started: true
		}

		const onSearchEnded = () => {
			searchState.ended = true
			setSearching(false)
		}

		latestSearchState.current = searchState

		if (!searchQuery) {
			onSearchEnded()
			onResults(items, {
				query: undefined,
				finished: true
			})
			return
		}

		if (findItems) {
			const startedAt = Date.now()
			findItems(searchQuery).then((results) => {
				if (!searchState.cancelled) {
					onSearchEnded()
					onResults(results, {
						query: searchQuery,
						finished: true,
						duration: Date.now() - startedAt
					})
				}
			}, (error) => {
				if (!searchState.cancelled) {
					searchState.error = true
					onSearchEnded()
					if (onError) {
						onError(error)
					} else {
						throw error
					}
				}
			})
		} else if (items && getItemTextLowerCase) {
			findItemsSync({
				searchQuery,
				onResults: (results, parameters) => {
					if (!searchState.cancelled) {
						if (parameters.finished) {
							searchState.ended = true
							setSearching(false)
						}
						onResults(results, parameters)
					}
				},
				items,
				getItemTextLowerCase,
				searchIterationMaxDuration,
				// searchIterationMaxItems,
				getNextSearchIterationTimer: () => nextSearchIterationTimer.current,
				setNextSearchIterationTimer: (timerId) => nextSearchIterationTimer.current = timerId
			})
		} else {
			throw new Error('The application must supply either `findItems(searchQuery)` or `items` and `getItemTextLowerCase()`')
		}
	}, [
		findItems,
		findItemsSync,
		items,
		onResults,
		getItemTextLowerCase,
		searchIterationMaxDuration,
		// searchIterationMaxItems,
		nextSearchIterationTimer,
		setSearching,
		latestSearchState
	])

	const cancelSearch = useCallback(() => {
		clearTimeout(startSearchTimer.current)
		clearTimeout(nextSearchIterationTimer.current)
	}, [])

	const onChange_ = useCallback((searchQuery?: string) => {
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
		onChange(searchQuery)
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

	const onKeyDown = useCallback((event: KeyboardEvent) => {
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
				autoFocus={autoFocus}
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
})

SearchInput.propTypes = {
	value: PropTypes.string,
	onChange: PropTypes.func.isRequired,

	autoFocus: PropTypes.bool,

	icon: PropTypes.bool,

	placeholder: PropTypes.string,

	// A function that searches for items by a search query.
	// The application is supposed to pass either `async findItems(searchQuery)` function
	// or a set of all possible `items` and a `getItemTextLowerCase()` function.
	findItems: PropTypes.func,

	// A list of items to search in.
	items: PropTypes.arrayOf(PropTypes.any),

	// A function that returns `item`'s text in lower case.
	getItemTextLowerCase: PropTypes.func,

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

	onError: PropTypes.func,

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

interface SearchInputProps<Item> {
	value?: string,
	onChange: (value: string) => void,

	autoFocus?: boolean,

	'aria-label'?: string,

	icon?: boolean,

	placeholder?: string

	// A function that searches for items.
	findItems?: (searchQuery?: string) => Promise<Item[]>,

	// A list of items to search in.
	items?: Item[],

	// A function that returns `item`'s text in lower case.
	getItemTextLowerCase?: (item: Item) => string,

	// `onResults()` will get called multiple times during the search.
	// The arguments are:
	// * results: any[]
	// * { finished: boolean, duration?: number, query?: string }
	//   * query?: string — Search query, `undefined` means empty.
	//   * finished: boolean — Has the search concluded or not yet.
	//   * duration?: number — Search duration.
	//     * If the search hasn't `finished` yet, there'll be no `duration` property.
	//     * If it wasn't really a search — if search query was cleared — there'll be no `duration` property.
	onResults: (items: Item[], parameters: {
		finished: boolean,
		duration?: number,
		query?: string
	}) => void,

	onError?: (error: Error) => void,

	// A delay to start the search after the user has stopped typing.
	searchStartDelayAfterInputStop?: number,

	// Max duration of a a single iteration.
	searchIterationMaxDuration?: number,

	// Max items to process in a single iteration.
	searchIterationMaxItems?: number,

	onEscapeKeyDownWhenEmpty?: () => void,
	onBlurWhenEmpty?: () => void,

	className?: string,
	inputClassName?: string
}

export default SearchInput

// Searches in `items` for a given `searchQuery`.
// Calls `onResults()` with the results and a `finished: boolean` flag.
function findItemsSync<Item>({
	searchQuery,
	onResults,
	items,
	getItemTextLowerCase,
	fromIndex = 0,
	startedAt = Date.now(),
	results = [],
	searchIterationMaxDuration,
	// searchIterationMaxItems,
	getNextSearchIterationTimer,
	setNextSearchIterationTimer
}: SearchParams<Item>) {
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
			clearTimeout(getNextSearchIterationTimer())
			// Could use `requestIdleCallback()` for spacing out iterations
			// but it's not supported in Safari:
			// https://caniuse.com/?search=requestIdleCallback
			setNextSearchIterationTimer(setTimeout(() => {
				findItemsSync({
					searchQuery,
					onResults,
					items,
					getItemTextLowerCase,
					fromIndex: i,
					startedAt,
					results,
					// searchIterationMaxItems,
					searchIterationMaxDuration,
					getNextSearchIterationTimer,
					setNextSearchIterationTimer
				})
			}, 0))
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

interface SearchParams<Item> {
	searchQuery?: string,
	onResults: SearchInputProps<Item>['onResults'],
	items: Item[],
	fromIndex?: number,
	startedAt?: number,
	results?: Item[],
	getItemTextLowerCase: SearchInputProps<Item>['getItemTextLowerCase'],
	searchIterationMaxDuration?: number,
	getNextSearchIterationTimer: () => number | undefined,
	setNextSearchIterationTimer: (timerId: number) => void
}

interface SearchState {
	started: boolean,
	ended?: boolean,
	error?: boolean,
	cancelled?: boolean
}