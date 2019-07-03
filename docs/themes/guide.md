# Themes

The application comes pre-packaged with a couple of built-in themes. Users can add their own custom themes on the "Settings" page. For that, a user should supply either a URL of a `.css` file or just paste [CSS](https://developer.mozilla.org/docs/Learn/CSS/Introduction_to_CSS/How_CSS_works) code.

Themes should mostly use the available [CSS Variables](https://github.com/catamphetamine/captchan/blob/master/docs/themes/variables.md). If a customization can't be achieved using the available CSS Variables consider contacting the repo author through [issues](https://github.com/catamphetamine/captchan/issues) for a discussion of adding new CSS Variables, or just use CSS selectors directly instead.

Each theme should provide both "Regular" mode (`:root`) and "Dark" mode (`:root.dark`).

See the [built-in themes](https://github.com/catamphetamine/captchan/tree/master/src/styles/theme) as an example.

### Default theme

[View in full resolution](https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/default-theme-screenshot-3605x1955.png)

<img src="https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/default-theme-screenshot-1024x555.png" width="512" height="278"/>

[style-variables.css](https://github.com/catamphetamine/captchan/blob/master/src/styles/style-variables.css)

### Neon Genesis Evangelion

[View in full resolution](https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/eva-theme-screenshot-3605x1955.png)

<img src="https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/eva-theme-screenshot-1024x555.png" width="512" height="278"/>

[neon-genesis-evangelion.css](https://github.com/catamphetamine/captchan/blob/master/src/styles/theme/neon-genesis-evangelion.css)
