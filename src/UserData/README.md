# Data Store

"User-specific data" — such as "latest read comments", "votes", "hidden comments", "hidden threads", "ignored authors", "own comments", "own threads", "subscribed threads", etc. — is stored in a web browser's `localStorage`.

Storing it in something like `IndexedDB` was an option, but it turned out to be much more complex, and also requiring a user to provide an explicit consent, which wouldn't be desirable behavior.

So, having just bare `localStorage` at my hands, I wrote the "User Data" storage to conveniently store and retrieve this "user-specific data", as well as export, import and migrate it.

Initially, one type of data for all threads was stored together in a large JSON object in the `localStorage`. That is called a "collection" in the code. See `collections.js` file for the full list of "collections".

For example, the "latest read comments" "collection" data would look like:

```js
localStorage.latestReadComments = {
	a: {
		123: {
			id: 124,
			t: 1234567890
		},
		456: {
			id: 457,
			t: 1234567890
		}
	},
	b: {
		123: {
			id: 124,
			t: 1234567890
		},
		456: {
			id: 457,
			t: 1234567890
		}
	}
}
```

Every collection type would usually have its own specific structure.

For example, some collections would store info about a comment in a thread in a channel, like the "votes" collection:

```js
localStorage.votes = {
	a: {
		123: {
			124: +1,
			125: -1
		}
	}
}
```

Other collections would store just the lists of the comment IDs, like the "hidden comments" collection:

```js
localStorage.hiddenComments = {
	a: {
		123: [124, 125]
	}
}
```

For every such collection type, a corresponding `type` was written, supporting "read", "write", "delete" and "merge" operations.

After those data types have been implemented (see the `types` folder), it all worked.

Then I figured that, as the user scrolls down, for every new visible comment it would write to `localStorage`, which is needless and not optimal. For example, "Solid-State Drives" have a limited count of "write cycles", and although they can easily handle such write loads, and other applications (including the Operating System itself) write far more data on them on a regular basis, it still felt like bad engineering.

So I introduced a concept of a `CachedLocalStorage` that would cache the parsed JSON data in RAM, avoiding re-reading and re-parsing it every time. That `CachedLocalStorage` would also listen to `pagehide` or `visibilitychange` events to flush all scheduled data updates to disk when the user switches tabs.

Later it was found out that there might be a performance issue with the big datasets themselves, because parsing such big JSON objects every time is not optimal. Again, probably modern devices could handle that just fine, and the overall effect would be negligible compared to all other apps and the Operating System itself, but it felt like bad engineering too.

The first idea for reducing the size of the datasets was that expired threads' data would get cleaned up automatically when refreshing the board "catalog", but then it turned out that some imageboards have a concept of an indefinitely-stored "archive", so data for expired threads wouldn't always get cleaned up.

Then I decided to split the data between a "regular" dataset and an "archived" dataset. The idea was that the "regular" dataset would be kept small (and easy to parse), while the "archived" dataset could get larger but it would also get accessed rarely.

With that concept, on "thread archived" event, thread data would get moved from the "regular" dataset to the "archived" dataset.

Then, it turned out that every thread page would have to track its `archived` status in order to know where should it save its thread-associated data: in the "regular" dataset or in the "archived" dataset. Why `archived` status tracking might be required? Because a user might open two browser windows simultaneously: one with the tread open and the other with the board open. In that case, since windows aren't tabs, there will be no `pagehide` or `visibilitychange` events, so `CachedLocalStorage` wouldn't get flushed to disk when switching between those two windows, and it wouldn't re-read the data from disk when switching back to those windows.

So, at some point, the user will refresh the second window with the board "catalog", and it will detect that the thread is no longer listed, which would mean that it has become archived, so it moved the thread data to the archive, but the first window doesn't know about that and would keep writing updates such as "latest read comment", "votes", "hidden comments", etc. to the "regular" dataset rather than the "archived" dataset, so the thread data would get split into two pieces between the "regular" and the "archived" datasets.

The "split" issue could be worked around by listening to the `localStorage`'s `change` event. Upon receiving such event, every open browser window would update its list of "archived" threads, and then merge any of its not-yet-flushed data with the updated data, and flush the merged result to disk.

Sidenote: The `change` event itself is "asynchronous", i.e. one browser window doesn't pause its code execution until other browser windows have processed that event. That's a minor unavoidable inconvenience, and the chances of it "losing" any data are practically non existent given correctly written merging algorithms.

Then, as the complexity grew, I thought: Why does it have to be so complex? Is there a simpler and more elegant way?

I decided to try another approach: storing data for each thread in a separate `localStorage` key. With that approach, various legacy "complex" data structure types like `channelThreadComments.js` aren't used anymore: it all comes down to just `value`, `list` and `map`. (The legacy "complex" data types aren't deleted yet (for now), and reside in the `types/unused` folder, but, as the folder name says, they're no longer used).

With the "separate `localStorage` entry for each thread" approach, some tasks (like board-wide listing) became more complex, while other tasks became simpler: for example, only parsing the minimum JSON required to get info of specific kind on a specific thread, and, as a result, not having to maintain a separate "archived" dataset, and therefore not having to track the "archived" status of every open thread.

There's still some level of "compoundness" in per-thread data structure. For example, the already mentioned "votes" collection would still store the votes for all comments in a thread in that thread's entry:

```js
localStorage.votes/a/123 = {
	124: +1,
	125: -1
}
```

But it's even better that way, because reading the votes for every comment in a thread from `localStorage` separately wouldn't be optimal — it's more efficient to read the votes for all comments in a thread in a single operation when thread data is loaded on page load.