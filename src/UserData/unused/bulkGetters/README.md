These "bulk getters" were used originally when per-comment data didn't include the data for the "original comment" of the thread, so that one had to be looked up separately in the corresponding per-thread data.

For example, previously, `ownComments` collection didn't include the data for the "original comment" of the thread which had to be looked up separately in the `ownThreads` collection.