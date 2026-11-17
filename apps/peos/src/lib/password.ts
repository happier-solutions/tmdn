// Password hashing with WebCrypto PBKDF2-SHA256: native code, far cheaper in Workers CPU time than a
// scrypt written in JS. 100,000 iterations is the Workers maximum. Not measured against the Free plan's
// 10 ms CPU limit; check sign-in on the deployed Worker.
// Stored as: pbkdf2-sha256$<iterations>$<salt b64>$<hash b64>
const ITERATIONS = 100_000;
const enc = new TextEncoder();
const b64 = (b: Uint8Array) => btoa(String.fromCharCode(...b));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function derive(password: string, salt: Uint8Array<ArrayBuffer>, iterations: number) {
	const key = await crypto.subtle.importKey('raw', enc.encode(password.normalize('NFKC')), 'PBKDF2', false, ['deriveBits']);
	const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256);
	return new Uint8Array(bits);
}

export async function hashPassword(password: string) {
	const salt = crypto.getRandomValues(new Uint8Array(16));
	return `pbkdf2-sha256$${ITERATIONS}$${b64(salt)}$${b64(await derive(password, salt, ITERATIONS))}`;
}

export async function verifyPassword({ hash, password }: { hash: string; password: string }) {
	const [scheme, iter, salt, expected] = hash.split('$');
	if (scheme !== 'pbkdf2-sha256' || !iter || !salt || !expected) return false;
	const got = await derive(password, unb64(salt), Number(iter));
	const want = unb64(expected);
	if (got.length !== want.length) return false;
	// Constant time: no early exit on the first differing byte.
	let diff = 0;
	for (let i = 0; i < got.length; i++) diff |= got[i] ^ want[i];
	return diff === 0;
}
