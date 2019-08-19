# lynxchan

While [adding support](http://lynxhub.com/lynxchan/res/722.html#q984) for [`lynxchan`](https://gitgud.io/LynxChan/LynxChan) several issues have been discovered in the `lynxchan` engine (as of June 2019).

* No "get boards list" API (like `/boards.json` on `4chan.org`).
* No thread creation date on threads in `/catalog.json` API response.
* No `signedRole` property on threads in `/catalog.json` API response.
* No "unique IPs" counter on threads in "get thread" API response.
* No duration for video files.
* No width and height for thumbnails in `files[]` array entries of a post.
* No `files[]` array on threads in `/catalog.json` API response (only `thumb` thumbnail URL).
* (can be hacked around in a web browser) No `width` and `height` of the `thumb` thumbnail URL on threads in `/catalog.json` API response.
* (can be hacked around in a web browser) No "original" image URL for the `thumb` thumbnail URL on threads in `/catalog.json` API response.
* (can be hacked around in a web browser) No `width` and `height` of the "original" image URL for the `thumb` thumbnail URL on threads in `/catalog.json` API response.
* (can be hacked around) No `postCount` and `fileCount` in "get thread" API response.
* (can be hacked around) No `mime` and `size` for the `thumb` thumbnail URL on threads in `/catalog.json` API response.
* (can be hacked around) No `postCount` for threads in `/catalog.json` API response when they have no replies.
* (can be hacked around) No `fileCount` for threads in `/catalog.json` API response when they have no attachments in replies.