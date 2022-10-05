`ThreadStatusCache` was introduced at some point as an attempt to work around the complexity related to having two different datasets: one for non-archived threads and the other for archived threads.

See `src/UserData/README.md` for more info.

Since then, a better data storage approach has been used, so this `ThreadStatusCache` is no longer required. The code is still here just in case.

Also see the commented-out references to `ThreadStatusCache` in several placed in the code:

* `onThreadArchived`
* `onThreadExpired`
* `src/initialize.js` — `startThreadStatusCache()`