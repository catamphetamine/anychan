# Translation

## Procedure

To add a new translation, "fork" the repository (or several repositories), "clone" it (or them) to your disk, create/edit the files, and then create a "pull request" (or several "pull requests"). See the official [guide](https://guides.github.com/activities/forking/).

## Messages

"Messages" are spread out across two repositories: [`anychan`](https://gitlab.com/catamphetamine/anychan/tree/master/src/messages) and [`frontend-lib`](https://gitlab.com/catamphetamine/frontend-lib/tree/main/messages). The file name is `<language>.json`.

Translating both `<language>.json` files is required. If some of the "messages" inside the files are missing, they'll be substituted by English ones.

"Messages" from `frontend-lib` are ["deeply" merged](https://medium.com/@qjli/daily-coding-tips-14-how-to-do-deep-merge-in-javascript-30ab0845ad19) with "messages" from `anychan`.

## Offensive

"Offensive" words can be put inside "spoilers" to hide them (by default) when reading comments. The lists of "offensive" word "patterns" are called [`offensive.<language>.json`](https://gitlab.com/catamphetamine/frontend-lib/blob/master/messages/offensive.en.json) and located in [`frontend-lib/messages`](https://gitlab.com/catamphetamine/frontend-lib/blob/master/messages/).

The lists of "offensive" words are meant only for really "bad" insults and should not include light insults used commonly in everyday life (for example, "shit" is not considered a "bad"-enough insult). This is a compromise between a user having unpleasant experience when reading such comments and having a really boring experience reading through dull, uninteresting and overly sterile half-spoilered comments.

## Countries

Country names are used as tooltips for country flags on boards like `/int/`. Translating country names is not required (English country names are used by default).

To add translated country names, create a file called [`countries.<language>.json`](https://gitlab.com/catamphetamine/frontend-lib/blob/master/messages/countries.en.json) in [`frontend-lib/messages`](https://gitlab.com/catamphetamine/frontend-lib/blob/master/messages/).

Country names can be copy-pasted from [`github.com/umpirsky/country-list`](https://github.com/umpirsky/country-list/blob/master/data/).

```js
JSON.stringify(
  Object.keys(countries).sort()
    .reduce((all, country) => ({ ...all, [country]: countries[country] }), {}),
  null,
  '\t'
)
````
