require('regenerator-runtime/runtime')
var fetch = require('node-fetch')
var imageboard = require('imageboard')

var fourChan = imageboard('4chan', {
  request: function(method, url, parameters) {
    // Sends an HTTP request.
    // Any HTTP request library can be used here.
    // Must return a `Promise` resolving to response JSON.
    switch (method) {
      case 'POST':
        return fetch(url, {
        	method: 'POST',
        	body: JSON.stringify(parameters)
        }).then(function(response) {
					return response.json()
				})
      case 'GET':
        return fetch(url).then(function(response) {
					return response.json()
				})
      default:
        throw new Error(`Method not supported: ${method}`)
    }
  }
})

// // Get the list of boards.
// // Print the first 10 boards.
// fourChan.getBoards().then((boards) => {
//   const boardsList = boards.slice(0, 10).map(({ id, title, category, description }) => {
//     return `* [${category}] /${id}/ ${title} — ${description}`
//   })
//   console.log(boardsList.join('\n'))
// })

var getCommentText = require('imageboard').getCommentText

// Prints the first five threads on `/a/` board.
fourChan.getThreads({ boardId: 'a' }).then((threads) => {
  const threadsList = threads.slice(0, 5).map(({
    id,
    title,
    createdAt,
    commentsCount,
    attachmentsCount,
    comments
  }) => {
    return [
      `#${id}`,
      createdAt,
      title,
      `${commentsCount} comments, ${attachmentsCount} attachments`,
      getCommentText(comments[0]) || '(empty)'
    ].join('\n\n')
  })
  console.log(threadsList.join('\n\n~~~~~~~~~~~~~~~~~~~~~~~~~\n\n'))
})

// // Get the list of threads on "/a/" board.
// // Output the first two of them to the console.
// fourChan.getThreads({ boardId: 'a' }).then((threads) => console.log(threads.slice(0, 2)))

// // Get thread info and comments list for thread "12345" on "/a/" board.
// // Output thread info and the first two comments to the console.
// fourChan.getThread({ boardId: 'a', threadId: 193601495 }).then((thread) => console.log({
// 	...thread,
// 	comments: thread.comments.slice(0, 2)
// }))