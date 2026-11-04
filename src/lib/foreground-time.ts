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

export function formatDuration(ms: number) {
	const total = Math.floor(ms / 1000);
	const hours = Math.floor(total / 3600);
	const minutes = Math.floor((total % 3600) / 60);
	const seconds = total % 60;
	if (hours) return `${hours} giờ ${minutes} phút`;
	return minutes ? `${minutes} phút ${seconds} giây` : `${seconds} giây`;
}
