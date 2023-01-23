import { useState, useCallback } from 'react'

export default function usePostUrlClick({
	comment,
	onPostUrlClick
}) {
	const [clickedPostUrl, setClickedPostUrl] = useState()

	// When rendering `<Post/>` component, it automatically passes a second argument
	// called `post` to `onPostUrlClick()` function of `<PostDate/>` → `<PostSelfLink/>`.
	// But this application doesn't render the `<Post/>` component directly.
	// Instead, it manually renders a `<PostSelfLink/>` element in `<CommentFooter/>`.
	// Therefore, it should manually pass the second argument called `comment`
	// to `onPostUrlClick()` function, which it does here.
	const onPostUrlClickHandler = useCallback((event) => {
		if (onPostUrlClick) {
			onPostUrlClick(event, comment)
		}
		setClickedPostUrl(true)
	}, [
		comment,
		onPostUrlClick,
		setClickedPostUrl
	])

	return {
		clickedPostUrl,
		onPostUrlClick: onPostUrlClickHandler
	}
}