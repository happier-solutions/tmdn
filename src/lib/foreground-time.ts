/** Starts tracking now and returns a getter for the time, in ms, the page has been in front. */
export function trackForegroundTime() {
	// Firefox and Safari keep no visibility record, and a tab left in the background must not count.
	let hiddenFor = 0;
	let hiddenAt = document.hidden ? 0 : -1;
	document.addEventListener('visibilitychange', () => {
		const now = performance.now();
		if (document.hidden) {
			hiddenAt = now;
		} else {
			hiddenFor += now - hiddenAt;
			hiddenAt = -1;
		}
	});

	return () => {
		const now = performance.now();
		const entries = performance.getEntriesByType('visibility-state');
		if (!entries.length) return now - hiddenFor - (hiddenAt < 0 ? 0 : now - hiddenAt);
		return entries.reduce(
			(total, { name, startTime }, i) =>
				name === 'visible' ? total + (entries[i + 1]?.startTime ?? now) - startTime : total,
			0,
		);
	};
}
