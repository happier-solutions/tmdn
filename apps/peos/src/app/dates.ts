// Local calendar dates as 'YYYY-MM-DD' strings, like the spec.
export const pad = (n: number) => (n < 10 ? '0' : '') + n;
export const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export function parse(s: string) {
	const [y, m, d] = s.split('-').map(Number);
	return new Date(y, m - 1, d);
}
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const diffDays = (a: Date, b: Date) => Math.round((+a - +b) / 86400000);
export const todayISO = () => iso(new Date());
export const WEEKDAYS = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
export const fmtD = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
export const fmtS = (s: string) => fmtD(parse(s));
export function monday(d: Date) {
	const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
	const w = x.getDay();
	x.setDate(x.getDate() - (w === 0 ? 6 : w - 1));
	return x;
}
export const inRange = (d: string, a: Date, b: Date) => d >= iso(a) && d <= iso(b);
export const numv = (x: unknown) => {
	const n = parseInt(String(x), 10);
	return Number.isNaN(n) ? 0 : n;
};
