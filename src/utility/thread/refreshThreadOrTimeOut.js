export default async function refreshThreadOrTimeOut({
	refreshThread,
	timeout = 5 * 1000
}) {
	return await Promise.race([
		new Promise((resolve) => {
			refreshThread({
				onRefreshDelayed() {
					// wait for a retry
				},
				onRefreshFinished(thread) {
					resolve({ thread })
				},
				onRefreshCancelled() {
					resolve({ cancel: true })
				}
			})
		}),
		new Promise(resolve => setTimeout(() => resolve({ timeout: true }), timeout))
	])
}