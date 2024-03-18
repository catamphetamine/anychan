# Style Variables

This document describes the [CSS Variables](https://developer.mozilla.org/docs/Web/CSS/Using_CSS_custom_properties) available for customization in [themes](https://gitlab.com/catamphetamine/anychan/blob/master/docs/themes/guide.md). If you have suggestions for new CSS Variables then contact the repo author through [issues](https://gitlab.com/catamphetamine/anychan/issues) to discuss that.

This document doesn't contain all available CSS Variables, so see the additional documents:
* [`social-components-react` CSS Variables]()

All variables listed here have their default values which are defined in the following files:
* [variables.css](https://gitlab.com/catamphetamine/anychan/blob/master/src/styles/variables.css) — common defaults
* [variables.light.css](https://gitlab.com/catamphetamine/anychan/blob/master/src/styles/variables.light.css) — custom defaults for light mode
* [variables.dark.css](https://gitlab.com/catamphetamine/anychan/blob/master/src/styles/variables.dark.css) — custom defaults for dark mode

If a variable can't be found in those files then it means that it could be found in `social-components-react` or `frontend-lib`:
* `social-components-react`
  * [variables.css](https://gitlab.com/catamphetamine/social-components-react/blob/master/style/variables.css)
  * [variables.light.css](https://gitlab.com/catamphetamine/social-components-react/blob/master/style/variables.light.css)
  * [variables.dark.css](https://gitlab.com/catamphetamine/social-components-react/blob/master/style/variables.dark.css)
* `frontend-lib`
  * [variables.css](https://gitlab.com/catamphetamine/frontend-lib/-/blob/main/styles/variables.css)
  * [variables.light.css](https://gitlab.com/catamphetamine/frontend-lib/-/blob/main/styles/variables.light.css)
  * [variables.dark.css](https://gitlab.com/catamphetamine/frontend-lib/-/blob/main/styles/variables.dark.css)
* Some variables can also potentially be missing from this document due to being overlooked.

Variables could be defined either as common ones or as "light"/"dark" mode specific ones:
* Common variables should be defined in `:root` CSS selector.
* "Light" mode variables should be defined in `.light` CSS selector.
* "Dark" mode variables should be defined in `.dark` CSS selector.

## Header

* `--Header-color: black` — Header text color.
* `--Header-color--hover: var(--Clickable-color--text)` — Header text color when hovered.
* `--Header-color--active: var(--Clickable-color--textActive)` — Header text color when clicked.
* `--Header-backgroundColor: white` — Header background color.
* `--Header-backgroundColor--title: var(--Header-backgroundColor)` — Header background color on the left side.
* `--Header-backgroundColor--menu: var(--Header-backgroundColor)` — Header background color on the right side.
* `--Header-borderWidth: 1px` — Header bottom border width.
* `--Header-borderColor: gray` — Header bottom border color color.

## HeaderSeparator

On thread pages there's a separator line between channel name and thread title in the header.

* `--HeaderSeparator-color--left` — The color of the separator line.

## NotificationBadge

"Notification badges" are the (1) notification count badges of the menu icons.

* `--NotificationBadge-color: white` — Notification badge text color.
* `--NotificationBadge-backgroundColor: red` — Notification badge background color.

## Sidebar

* `--Sidebar-backgroundColor: white` — Sidebar background color.
* `--Sidebar-color-200: gray` - Sidebar "muted" content color.
* `--Sidebar-color-500: black` — Sidebar scrollbar color.
* `--Sidebar-color-600: black` — Sidebar "miscellaneous" content color.
* `--Sidebar-color-900: black` — Sidebar text color.
* `--Sidebar-baseColor-200: orange` — Sidebar input border color when focused.
* `--Sidebar-baseColor-700: orange` — Sidebar link color.
* `--Sidebar-highlightColor-100: gray` — Sidebar active element background color on mouse over.
* `--Sidebar-highlightColor-200: gray` — Sidebar active element background color on click.
* `--Sidebar-borderColor: black` — Sidebar right border color.

## Toolbar

The menu at the top of a channel or thread page.

* `--Toolbar-color: black` — The color of icons in a channel or thread page menu.
* `--Toolbar-color--active: black` — The color of icons in a channel or thread page menu when clicked. Menu icons usually change from outline to counterform when clicked.
* `--Toolbar-color--selected: black` — The color of icons in a channel or thread page menu when selected. Menu icons usually change from outline to counterform when selected.

## Post

(also see the main list of CSS Variables for `Post` in `social-components-react`)

* `--Post-color--secondaryThread: gray` — While `--Post-color--secondary` is used on channel pages (example: `/a/`) `--Post-color--secondaryThread` is used on thread pages (example: `/a/123456`). The rationale is that when scrolling a thread "secondary" content has less informational value than when scrolling a list of threads.

## Comment

`Comment` is a special case of a `Post`. The distinction is mostly conceptual: a "post" could be a "comment" on a social network or in a chat, a "blog post", a "longread" article or even a book. Naturally, "comments" are somewhat special among the rest of the `Post` types due to the visual context they're usually shown in: comments should be concise and there's usually a lot of them to fit on a screen.

* `--Comment-marginTop` — The vertical spacing between comments. Could be separated into two different cases:
  * `--Comment-marginTop--topLevel` — `--Comment-marginTop` for "top-level" comments, i.e. the ones that don't have a parent comment.
  * `--Comment-marginTop--nested` — `--Comment-marginTop` for non-"top-level" comments.
<!-- * `--Comment-marginTop--channelPageWithLatestComments` — The vertical spacing between threads on a channel page in "with latest comments" view. -->

* `--Comment-borderColor: gray` — Comments separator line color (on thread page).
* `--Comment-borderColor--largeScreen: gray` — Comments separator line color (on thread page) (on large screens).
* `--Comment-borderColor--channelPage: gray` — Comments separator line color (on channel page).
* `--Comment-borderColor--channelPageLargeScreen: gray` — Comments separator line color (on channel page) (on large screens).

### CommentSpacer

When displaying a list of comments, they should be visually separated using some kind of a "spacer".

* It could be just blank space, as it's done between comments on a thread page. In such case, the height of the spacer is equal to `--Comment-marginTop`.
* It could be a horizontal line surrounded by blank space, as it's done between threads on a board page. In such case, the height of the spacer is equal to: `--Comment-marginTop` (blank space above the line) + `--CommentSpacerLine-height` (horizontal line) + `--Comment-marginTop` (blank space below the line).

CSS Variables:

* `--CommentSpacerLine-height` — The thickness of the horizontal line.
* `--CommentSpacerLine-color` — The color of the horizontal line.

### CommentAuthorBannedIcon

* `--CommentAuthorBannedIcon-color: red` — The color of the "User was banned for this post" icon.

### CommentAuthor

A "comment author section" is comment author name and its surroundings like the "person" icon, an email or a "tripcode".

* `--CommentAuthor-color: black` — The color of a comment author section.
<!-- * `--CommentAuthor-color--accent: orange` — The color of a comment author email. -->
* `--CommentAuthor-color--administrator: red` — The color of a comment author name when the user is an administrator.
* `--CommentAuthor-color--moderator: blue` — The color of a comment author name when the user is a moderator.

### Channels

Channel selection list.

* `--Channels-fontWeight: normal` — Font weight of channel names in the channels list.
* `--Channels-color: white` — Text color of a channels list entry.
* `--Channels-color--active: orange` — Text color of a channels list entry when it's clicked.

### ChannelsViewSwitcher

* `--ChannelsViewSwitcher-color: white` — Channels view switcher text color. Some imageboards (like `2ch.hk`) provide channel activity rating. For such imageboards the channel selection list will have an option of viewing the list of channels either sorted by their rating descending ("Popular") or categorized as usual ("By Category").

### ChannelUrl

* `--ChannelUrl-fontFamily: monospace` — Font family of URLs in the channels list.
* `--ChannelUrl-fontWeight: normal` — Font weight of URLs in the channels list.
* `--ChannelUrl-slash-color: gray` — The color of the "slash" (`/`) characters on both sides of channel URLs in the channels list.
* `--ChannelUrl-slash-color--hover: gray` — The color of the "slash" (`/`) characters on both sides of channel URLs in the channels list on mouse over.
* `--ChannelUrl-slash-color--active: gray` — The color of the "slash" (`/`) characters on both sides of channel URLs in the channels list when clicked.
* `--ChannelUrl-slash-color--selected: gray` — The color of the "slash" (`/`) characters on both sides of channel URLs in the channels list when selected.