# makaba

While adding support for `2ch.hk` some very minor bugs have been discovered in the `makaba` engine (as of June 2019).

* Incorrect `files_count` property both `/catalog.json` API response and "get thread" API response. For example, for a thread having only one reply with 4 attachments in it `files_count` will be `1` in `/catalog.json` API response and `2` in "get thread" API response. For `/catalog.json` API response it seems to count "replies having attachments" instead of "attachments in replies having attachments", and for "get thread" API response it seems to do the same thing while also counting the attachments of the opening post (which should be skipped).