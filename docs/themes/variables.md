# Theme Variables

This document describes the [CSS Variables](https://developer.mozilla.org/docs/Web/CSS/Using_CSS_custom_properties) available for customization in [themes](https://github.com/catamphetamine/captchan/blob/master/docs/themes/guide.md). If you have suggestions for new CSS Variables then contact the repo author through [issues](https://github.com/catamphetamine/captchan/issues) to discuss that.

All variables listed here have their default values — see
[style-variables.css](https://github.com/catamphetamine/captchan/blob/master/src/styles/style-variables.css).

## Document

* `--Document-color: black` — Text color on a page.
* `--Document-backgroundColor: white` — Background color of a page.
* `--Document-fontFamily: Roboto` — Application font.
* `--Document-fontFamily--text: sans-serif` — Text content font.

## Header

* `--Header-color: black` — Header text color.
* `--Header-backgroundColor: white` — Header background color.
* `--Header-backgroundColor--title: var(--Header-backgroundColor)` — Header background color on the left side.
* `--Header-backgroundColor--menu: var(--Header-backgroundColor)` — Header background color on the right side.
* `--Header-borderWidth: 1px` — Header bottom border width.
* `--Header-borderColor: gray` — Header bottom border color color.

## HeaderSeparator

On thread pages there's a separator line between board name and thread subject in the header.

* `--HeaderSeparator-color--left` — The color of the separator line.

## NotificationBadge

"Notification badges" are the (1) notification count badges of the menu icons.

* `--NotificationBadge-color: white` — Notification badge text color.
* `--NotificationBadge-backgroundColor: red` — Notification badge background color.

## Announcement

Sometimes chan administration needs to announce something to the users. Things like latest news, contests, etc. Such an announcement appears on top of the page, below the header.

* `--Announcement-backgroundColor: white` — Announcement background color.
* `--Announcement-color: black` — Announcement text color.
* `--Announcement-borderWidth: 1px` — Header bottom border width.
* `--Announcement-borderColor: gray` — Header bottom border color color.

## Menu

* `--Menu-color: black` — Menu icons color (outline).
* `--Menu-color--active: gray` — Menu icons color (fill) when clicked.
* `--Menu-color--selected: black` — Menu icons color (fill) when selected.

## Sidebar

* `--Sidebar-color: white` — Sidebar text color.
* `--Sidebar-backgroundColor: black` — Sidebar background color.
* `--Sidebar-borderColor: transparent` — Sidebar right border color.

## Clickable

A clickable is a link or a button. Links and textual buttons are darker than buttons with background for eligibility reasons.

* `--Clickable-color--dark: brown` — Link color.
* `--Clickable-color: orange` — Link color when clicked. Button background color.
* `--Clickable-color--light: red` — Button background color when clicked.

## Picture

* `--Picture-backgroundColor: gray` — Background color of a picture while it's being loaded.
* `--Picture-borderColor: gray` — Picture border color.
* `--Picture-borderWidth: 1px` — Picture border width.

## Error

* `--Error-color: white` — Error notification color.
* `--Error-backgroundColor: red` — Error notification background color.

## Notification

* `--Notification-color: white` — Notification text color.
* `--Notification-backgroundColor: black` — Notification background color.
* `--Notification-borderColor: transparent` — Notification border color.
* `--Notification-borderWidth: 0px` — Notification border width.
* `--Notification-color--error: var(--Error-color)` — Error notification text color.
* `--Notification-backgroundColor--error: var(--Error-backgroundColor)` — Error notification background color.
* `--Notification-borderColor--error: var(--Notification-borderColor)` — Error notification border color.
* `--Notification-borderWidth--error: var(--Notification-borderWidth)` — Error notification border width.

## HoverButton

A "hover button" is a button that doesn't look like a button unless it's hovered. The examples are the various post buttons: comment date link, "reply" button, "…" menu button, show replies button.

Some buttons can be "pushed" meaning that they stay in the "pushed" state until "unpushed" via a click.

* `--HoverButton-backgroundColor: gray` — Hover button background color on mouse over.
* `--HoverButton-backgroundColor--active: yellow` — Hover button background color when clicked.
* `--HoverButton-backgroundColor--pushed: var(--HoverButton-backgroundColor--active)` — Hover button background color when pushed.
* `--HoverButton-color--active: orange` — Hover button text color when clicked.
* `--HoverButton-color--pushed: orange` — Hover button text color when pushed.
* `--HoverButton-color--pushedActive: var(--HoverButton-color--active)` — Hover button text color when clicked to unpush.
* `--HoverButton-borderColor: gray` — Hover button border color on mouse over.
* `--HoverButton-borderColor--active: var(--HoverButton-borderColor)` — Hover button border color on click.
* `--HoverButton-borderColor--pushed: var(--HoverButton-borderColor--active)` — Hover button background color when pushed.

## Content

"Content" are posts and generic page content.

* `--Content-color: black` — Content text color.
* `--Content-backgroundColor: white` — Content background color.
* `--Content-backgroundColor--active: yellow` — When a thread is clicked in a threads list then it's highlighted with this color.
* `--Content-color--50` — The lightest variation of `--Content-color`. For black `--Content-color` that would be an extremely light gray color.
* `--Content-color--100` — A very light variation of `--Content-color`. For black `--Content-color` that would be a very light gray color.
* `--Content-color--200` — A light variation of `--Content-color`. For black `--Content-color` that would be a light gray color.
* `--Content-color--300` — A lighter variation of `--Content-color`. For black `--Content-color` that would be gray color.

## Post

* `--Post-color--secondary: gray` — A color for "secondary" content of a post. "Secondary" content is everything besides the comment text (comment date, buttons color, icons color).
* `--Post-color--secondaryThread: gray` — While `--Post-color--secondary` is used on board pages (example: `/a/`) `--Post-color--secondaryThread` is used on thread pages (example: `/a/123456`). The rationale is that when scrolling a thread "secondary" content has less informational value than when scrolling a list of threads.
* `--Post-borderColor: gray` — Bottom border color of posts on a thread page.

### PostBannedIcon

* `--PostBannedIcon-color: red` — The color of the "User was banned for this post" icon.

### PostAuthor

A "post author section" is post author name and its surroundings like the "person" icon, an email or a "tripcode".

* `--PostAuthor-color: black` — The color of a post author section.
* `--PostAuthor-color--administrator: red` — The color of a post author section when the user is an administrator.
* `--PostAuthor-color--moderator: blue` — The color of a post author section when the user is a moderator.

### PostAuthorName

* `--PostAuthorName-color: orange` — The color of a post author name.
* `--PostAuthorName-color--id: black` — The color of a post author name when author IDs (IP address subnet hashes) are shown.

### PostQuote

* `--PostQuote-color: green` — Post quote text color.
* `--PostQuote-backgroundColor: transparent` — Post quote background color.
* `--PostQuote-backgroundColor--hover: gray` — Post quote background color on mouse over.
* `--PostQuote-borderColor: transparent` — Post quote border color.
* `--PostQuote-borderColor--hover: gray` — Post quote border color on mouse over.

### PostQuoteMarker

"Post quote marker" is the vertical line on the left side of the quote.

* `--PostQuoteMarker-color: gray` — Post quote marker color.
* `--PostQuoteMarker-opacity: 1` — Post quote marker opacity.
* `--PostQuoteMarker-width: 2px` — Post quote marker width.
* `--PostQuoteMarker-padding: 0.2em` — Post quote marker top and bottom padding.

`8ch.net` and `kohlchan.net` have a notion of "inverse" quotes: the ones posted with a `<` prefix rather than the normal `>` quote prefix. There's no explanation on how "inverse" quotes are different from the normal quotes and what's the purpose of their existence. Furthermore, `kohlchan.net` also has "orange" "inverse" quotes.

* `--PostQuote-color--inverse: red` — "Inverse" quote text color.
* `--PostQuote-color--inverse2: orange` — "Orange" "inverse" quote text color.

### PostInlineSpoiler

* `--PostInlineSpoiler-color: gray` — Spoiler color.
* `--PostInlineSpoiler-color--postActive: gray` — When a thread is clicked in a list of threads all spoilers in its opening post will have this color.
* `--PostInlineSpoiler-color--censored: red` — Ignored word spoiler color.
* `--PostInlineSpoiler-color--censoredPostActive: red` — When a thread is clicked in a list of threads all ignored word spoilers in its opening post will have this color.

### CommentTree

* `--CommentTree-color: black` — The color of the comment tree lines.
* `--CommentTree-color--branch: black` — The color of the horizontal comment tree lines (the ones that "branch off" to the right).
* `--CommentTree-color--hover: orange` — The color of the comment tree lines on mouse over.
* `--CommentTree-backgroundColor--hover: gray` — The background color of the comment tree on mouse over.

### Boards

Board selection list. There're two of them: one is on the "Show all boards" (`/boards`) page and the other is in the sidebar. The styling variables for the sidebar one have `--sidebar` in their postfix.

* `--Boards-color--active: orange` — Text color of a "Show all boards" boards list entry when it's clicked.
* `--Boards-backgroundColor--hover: gray` — Background color of a "Show all boards" boards list entry on mouse over.
* `--Boards-color--sidebarActive: orange` — Text color of a sidebar boards list entry when it's clicked.
* `--Boards-backgroundColor--sidebarHover: gray` — Background color of a sidebar boards list entry on mouse over.
* `--Boards-backgroundColor--sidebarActive: gray` — Background color of a sidebar boards list entry when it's clicked.
* `--Boards-backgroundColor--sidebarSelected: black` — Background color of a sidebar boards list entry when the boards is selected.

### BoardsViewSwitcher

Some chans (like `2ch.hk`) provide board activity rating. For such chans the board selection list will have an option of viewing the list of boards either sorted by their rating descending ("Popular") or categorized as usual ("By Category").

* `--BoardsViewSwitcher-color--sidebar: white` — Sidebar boards view switcher text color.

### BoardsSlash

In the boards list there're "slash" (`/`) characters on both sides of board URLs.

* `--BoardsSlash-color: gray` — The color of the "slash" (`/`) characters on both sides of board URLs in the boards list on "Show all boards" page.
* `--BoardsSlash-color--sidebar: gray` — The color of the "slash" (`/`) characters on both sides of board URLs in the boards list in sidebar.