# lynxchan

While [adding support](http://lynxhub.com/lynxchan/res/722.html#q984) for [`lynxchan`](http://lynxhub.com/) several issues have been discovered in the `lynxchan` engine (as of June 2019).

* No thread creation date on threads in `/catalog.json` API response.
* No `signedRole` property on threads in `/catalog.json` API response.
* No "unique IPs" counter on threads in "get thread" API response.
* No duration for video files.
* No width and height for thumbnails in `files[]` array entries of a post.
* No `files[]` array on threads in `/catalog.json` API response (only `thumb` thumbnail URL).
* No `width` and `height` for the `thumb` thumbnail URL on threads in `/catalog.json` API response.
* (can be hacked around) No `postCount` and `fileCount` in "get thread" API response.
* (can be hacked around) No `mime` and `size` for the `thumb` thumbnail URL on threads in `/catalog.json` API response.
* (can be hacked around) No `postCount` for threads in `/catalog.json` API response when they have no replies.
* (can be hacked around) No `fileCount` for threads in `/catalog.json` API response when they have no attachments in replies.