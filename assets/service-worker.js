// https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Tutorials/CycleTracker/Service_workers

const VERSION = '0.0.1';
const CACHE_NAME = `anychan-${VERSION}`;

self.addEventListener('fetch', function() {
	// A minimal `ServiceWorker` implementation just so that the whole thing is operational.
	// https://stackoverflow.com/questions/61208907/pwa-minimal-service-worker-just-for-trigger-the-install-button
	return;
});