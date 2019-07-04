# OpenIB

While adding support for `8ch.net` several very minor issues have been discovered in the [`OpenIB`](https://github.com/OpenIB/OpenIB/) engine (as of June 2019).

* Some boards (like `/leftypol/`) are [missing](https://github.com/OpenIB/OpenIB/issues/297) flags ("Socialism", "Anarcho-Communism", etc) both in `/catalog.json` API response and "get thread" API response.
* (can be hacked around) [Incorrect](https://github.com/OpenIB/OpenIB/issues/295) `images` property on threads in `/catalog.json` API response.
* (can be hacked around) [Incorrect](https://github.com/OpenIB/OpenIB/issues/298) `extra_files: [[]]` property on some threads in `/catalog.json` API response.