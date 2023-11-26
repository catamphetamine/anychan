# Translation

## Procedure

To add a new translation, "fork" the repository (or several repositories), "clone" it (or them) to your disk, create/edit the files, and then create a "pull request" (or several "pull requests"). See the official [guide](https://guides.github.com/activities/forking/).

## Messages

"Messages" are spread out across several repositories:
* [`anychan`](https://gitlab.com/catamphetamine/anychan/tree/main/src/messages)
  * `<language>.json` — "Messages" that're specific to `anychan` application.
* [`frontend-lib`](https://gitlab.com/catamphetamine/frontend-lib/tree/main/messages)
  * `<language>.json` — Generic "messages" that could be reused across various applications.
  * `countries.<language>.json` — Country names. Should simply be copy-pasted from [`react-phone-number-input`](https://github.com/catamphetamine/react-phone-number-input/tree/master/locale).
  * `offensive.<language>.json` — Rules for automatic hiding of "offensive" words in a certain language.
* [`social-components`](https://gitlab.com/catamphetamine/social-components/-/tree/master/messages)
  * `<language>.json` — "Messages" for `social-components` package.
* [`social-components-react`](https://gitlab.com/catamphetamine/social-components-react/-/tree/main/messages)
  * `<language>.json` — "Messages" for `social-components-react` package.

When submitting a translation for a new language, translating all those files is required. If some of the "messages" inside those translation files are missing, they'll be automatically substituted by English ones.

`<language>.json` messages from `frontend-lib` and `social-component-react` repos are ["deeply" merged](https://medium.com/@qjli/daily-coding-tips-14-how-to-do-deep-merge-in-javascript-30ab0845ad19) with the ones in `anychan` repo.

### Format

In most cases, "messages" are just simple pieces of text. But in some cases, "messages" could be "parametrized".

#### Basic parameters

A "message" could include a "parameter". A "parameter" could be included in the message text in the form of a parameter name surrounded by curly braces. Example: `"My name is {name}"`.

Depending on the type of the parameter's value, it may be required to specify that type next to the parameter's name:

* For numbers — `{parameterName, number}`
* For percentages — `{parameterName, number, ::percent}`
* For currency amounts — `{parameterName, number, ::currency}`
* For dates — `{parameterName, date, format}` where `format` could be one of:
  * `short`
  * `medium`
  * `long`
  * `full`
* For time — `{parameterName, time, format}` where `format` could be one of:
  * `short`
  * `medium`
  * `long`
  * `full`
* For any other value types — `{parameterName}`

#### Advanced parameters

In some rare cases, it might also be required to not just insert a parameter in the message text but to alter the message text itself based on the parameter value. For example, when `count` parameter is `1`, it should say `"I have {count} apple"` and in any other case it should say `"I have {count} apples"`.

To support such advanced message formatting, this application uses a library called [`formatjs`](https://formatjs.io/docs/core-concepts/icu-syntax), along with its "ICU message syntax" which is used in those advanced cases. Listed below are the types of `formatjs`-specific formatting that could be encountered in the messages.

##### Compare parameter value

Syntax: `{ parameterName, select, value1 {...} value2 {...} ... other {...} }`.

Explanation: For each of the specified values, it compares them to the parameter's value that gets converted to a string for the comparison purposes. If any value matches, the whole block is replaced with the contents of the curly braces next to the matched value. If no value matches the parameter's value, `other` is used (including `other` case is required).

##### If parameter is passed

Syntax: `{ parameterName, exists {...} }`.

Explanation: If any value was passed for the parameter, the whole block is replaced with the contents of the curly braces next to `exists`. Otherwise, i.e. when no value was passed for the parameter, the whole block is ignored.

##### If parameter is not passed

Syntax: `{ parameterName, missing {...} }`.

Explanation: If no value was passed for the parameter, the whole block is replaced with the contents of the curly braces next to `missing`. Otherwise, i.e. when any value was passed for the parameter, the whole block is ignored.

##### Format date

Syntax: `{ parameterName, date, long }`.

Explanation: Formats the parameter's value as a date in "long" format.

##### Count number

Syntax: `{ parameterName, plural, one {...} ... other {...} }`.

Explanation: Classifies the parameter's value, which must be a number, as belonging to one of the [plural categories](https://cldr.unicode.org/index/cldr-spec/plural-rules) — `zero`, `one`, `two`, `few`, `many`, `other`, `=value` — and then replaces the whole block with the contents of the curly braces next to the matched category, replacing `#` with the parameter's value. There're defined [sets of possible plural categories for each language](https://www.unicode.org/cldr/charts/44/supplemental/language_plural_rules.html), and each language has its own (usually different) set of supported plural categories.

##### Ordinal number

Syntax: Same one as in [Count number](#count-number) but with `selectordinal` instead of `plural`.

Explanation: Use it for formatting "ordinals" like `1st`, `2nd`, etc.

#### Tags

Syntax: `<tagName>...</tagName>`

Explanation: Wraps a certain (enclosed) part of the message in a React element tag (consider them similar to HTML tags).

### Null

A message could be `null` indicating that nothing should be output.

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
```