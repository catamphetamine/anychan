* Могла бы быть какая-то проверка прокси при открытии страницы с выводом сообщения в случае неработы прокси.

* +N делать не во весь thumbnail, а в правом верхнем углу, круглешком. Максимум один ряд thumbnails.

* Не показывать оригинал для gif.

* мб выводить thread.posts с 1 по 3 (а мб и не выводить).

* Сокращать длинные посты и делать "Read more".

* Сделать endless scrolling подгрузку (будет перезапрашивать список тредов всех с первой страницы, фильтровать по уже показанным, и выдавать не показанные).

* На странице "Настройки" (сохраняющиеся в local storage) - proxy url и ignore words regexp.

* `localStorage`

```
try {
	// Local storage limit is about 5-10 megabytes.
  localStorage.setItem("name", "Hello World!")
} catch (error) {
	// No consistent error code for "quota exceeded" error.
	// http://chrisberkhout.com/blog/localstorage-errors/
  // if (error === DOMException.QUOTA_EXCEEDED_ERR) {
  //   alert('Quota exceeded')
  // }
  alert('Quota exceeded')
}
```

* Generate preview from post content. `while (node of tree) { if (node.content is 'string') { length += node.content; } next(); }`. `if (length > maxContentLength) { return partialTree }`. `currentNode.content = slice(0, lengthLeft + (sentenceEnd || paragraphEnd))`. preview max lines < full text max lines threshold. line score ~ 80. score contents. `lineOfTextScore = Math.ceil(length / lineScore)`. lineOfTextScore = Math.max(1, lineLength / lineScore).

* More button dots:

<svg aria-label="Show options" class="octicon octicon-kebab-horizontal" viewBox="0 0 13 16" version="1.1" width="13" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M1.5 9a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM13 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path></svg>

* Ссылки вида `https://www.youtube.com/watch?v=c_tSDJD1Jf8` преобразовывать в youtube video attachment.

* Если картинка (не thumbnail) очень большая, то не грузить её. Мб всегда показывать только thumbnail, если не нажато "развернуть все картинки".

* `postShape: { account: accountShape, //.isRequired }` — как-то вынести тоже в виде плагина мб.

* `postPostLinkShape`, `postSpoilerShape`, `postNewLineShape` — как-то вынести тоже в виде плагина мб.

* Можно сделать кнопку "развернуть все картинки" для тредов типа "засмеялся".

* Move into some kind of a plugin: `else if (content.type === 'spoiler') { return <span className="spoiler" key={i}>{content.text}</span> }`.

* Move into some kind of a plugin: `else if (content.type === 'post-link') { return <PostLink key={i}>{content}</PostLink> }`.

* Move into some kind of a plugin: `else if (content.type === 'quote') { return <q key={i}>{content.text}</q> }`.

* (maybe) Comment tree expansion.