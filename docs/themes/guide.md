# Themes

The application comes pre-packaged with a couple of built-in themes. Users can experiment with adding their own custom themes on the "Settings" page. For that, a user should supply either a URL of a `.css` file or just paste [CSS](https://developer.mozilla.org/docs/Learn/CSS/Introduction_to_CSS/How_CSS_works) code.

Themes should mostly use the available [CSS Variables](https://gitlab.com/catamphetamine/captchan/blob/master/docs/themes/variables.md). If a customization can't be achieved using the available CSS Variables, consider contacting the repo author through [issues](https://gitlab.com/catamphetamine/captchan/issues) to discuss adding new CSS Variables, or just use CSS directly instead: for example, if `--Sidebar-backgroundColor` variable didn't exist, then the effect of `:root { --Sidebar-backgroundColor: red; }` could be achieved via `.Sidebar { background-color: red; }`.

Each theme should provide both "Light" and "Dark" modes. "Light" mode styles are defined in `.light {}` CSS selector, and "Dark" mode styles are defined in `.dark {}` CSS selector. Common styles (both for "Light" and "Dark" modes) are defined in `:root {}` CSS selector.

Comments can be added via `/* */`. For example, there should be a comment block at the start of a `.css` file, with the author info (name, email, etc).

Every theme is applied on top of the default style variable values defined in [webapp-frontend/style-variables.css](https://gitlab.com/catamphetamine/webapp-frontend/blob/master/src/styles/style-variables.css) and [style-variables.css](https://gitlab.com/catamphetamine/captchan/blob/master/src/styles/style-variables.css). This explains why the default theme's style ([default.css](https://gitlab.com/catamphetamine/captchan/blob/master/src/styles/theme/default.css)) is empty: because it doesn't overwrite any of the default styles. This also means that when creating a new theme, one could "start small", adding custom style variable values one-by-one, without a requirement to provide everything up-front, which eases the process.

See the [built-in themes](https://gitlab.com/catamphetamine/captchan/tree/master/src/styles/theme) as an example.

<!--
## Submissions

To submit a request for adding a new theme to the application, "fork" the repository (or several repositories), "clone" it (or them) to your disk, create/edit the files, and then create a "pull request" (or several "pull requests"). See the official [guide](https://guides.github.com/activities/forking/).
-->

<!--
### Default theme

#### Light

[View in full resolution](https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/default-theme-light-mode-3605x1955.png)

<img src="https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/default-theme-light-mode-1024x555.png" width="512" height="277"/>

#### Dark

[View in full resolution](https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/default-theme-dark-mode-3605x1955.png)

<img src="https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/default-theme-dark-mode-1024x555.png" width="512" height="277"/>

[default.css](https://github.com/catamphetamine/captchan/blob/master/src/styles/default.css)

### Neon Genesis Evangelion

#### Light

[View in full resolution](https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/eva-theme-light-mode-3605x1955.png)

<img src="https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/eva-theme-light-mode-1024x555.png" width="512" height="277"/>

#### Dark

[View in full resolution](https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/eva-theme-dark-mode-3605x1955.png)

<img src="https://raw.githubusercontent.com/catamphetamine/captchan/master/docs/images/eva-theme-dark-mode-3605x1955.png" width="512" height="277"/>

[neon-genesis-evangelion.css](https://github.com/catamphetamine/captchan/blob/master/src/styles/theme/neon-genesis-evangelion.css)
-->