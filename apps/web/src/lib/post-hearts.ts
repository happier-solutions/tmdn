// Stored per post, in this browser only. Blocked storage (some private modes) throws, and the count then lasts until the page closes.
const keyFor = (path: string) => `hearts:${path}`;

export const readHearts = (path: string) => {
	try {
		const count = Number(localStorage.getItem(keyFor(path)));
		return Number.isSafeInteger(count) && count > 0 ? count : 0;
	} catch {
		return 0;
	}
};

export const saveHearts = (path: string, count: number) => {
	try {
		localStorage.setItem(keyFor(path), String(count));
	} catch {
		// Nothing to tell the reader: the heart still counts on this page.
	}
};
