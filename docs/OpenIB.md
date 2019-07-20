# OpenIB

While adding support for `8ch.net` several very minor issues have been discovered in the [`OpenIB`](https://github.com/OpenIB/OpenIB/) engine (as of June 2019).

* Some boards (like `/leftypol/`) are [missing](https://github.com/OpenIB/OpenIB/issues/297) flags ("Socialism", "Anarcho-Communism", etc) both in `/catalog.json` API response and "get thread" API response.
* Code syntax is highlighted but [there's no information](https://github.com/catamphetamine/captchan/issues/4#issuecomment-513467300) about the actual language in comment HTML so code highlighters can't be applied unless there's some language autodetection technique like in [`highlight.js`](https://highlightjs.org/) which requires downloading the complete language pack and then running each language parser on the code to select the one that matches the most.
* (can be hacked around) [Incorrect](https://github.com/OpenIB/OpenIB/issues/295) `images` property on threads in `/catalog.json` API response.
* (can be hacked around) [Incorrect](https://github.com/OpenIB/OpenIB/issues/298) `extra_files: [[]]` property on some threads in `/catalog.json` API response.