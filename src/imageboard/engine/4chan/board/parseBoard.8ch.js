export default function parseBoard(board) {
  const parsedBoard = {
    id: board.uri,
    name: board.title,
    description: board.subtitle,
    commentsPerHour: board.pph_average, // Also has `ppd` and `pph`.
    language: board.locale,
    tags: board.tags
  }
  if (board.sfw === '0') {
    board.isNotSafeForWork = true
  }
  // `board.active` is a number.
  // "Active ISPs" is short hand for
  // "number of /16 subnet ranges to post on this board in the last 72 hours."
  // It is not a perfect metric and does not account for number of lurkers
  // (users who only read the board and do not post) or the number of users
  // sharing an IP range (for example, all Tor users are considered one active user).
  // In the entire Internet, there are only 16,384 /16 ranges (also known as Class B networks),
  // with 65,536 addresses per range. So, if /v/ or /pol/ has 3,000 ranges (active users),
  // that means their posters represent 18% of the possible number of ranges on the Internet.
  // Many ISPs only have one or two ranges.
  board.activePostersShare = board.active / 16384
  return parsedBoard
}