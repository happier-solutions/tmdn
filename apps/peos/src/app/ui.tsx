import type { ReactNode } from 'react';
import { COMPNAME, P, getPath, save, saveSoon, setPath } from './store';
import type { Task } from './types';

type Path = { k: string };

// Text fields bound to a state path: re-render at once, store a moment later.
export function Text({ k, placeholder, className, style, label, inputMode }: Path & { placeholder?: string; className?: string; style?: React.CSSProperties; label?: string; inputMode?: 'numeric' }) {
	return (
		<input
			type="text"
			className={className}
			style={style}
			aria-label={label}
			inputMode={inputMode}
			value={String(getPath(k) ?? '')}
			placeholder={placeholder}
			onChange={(e) => {
				setPath(k, e.target.value);
				saveSoon();
			}}
		/>
	);
}
export function Area({ k, placeholder, rows = 3 }: Path & { placeholder?: string; rows?: number }) {
	return (
		<textarea
			rows={rows}
			value={String(getPath(k) ?? '')}
			placeholder={placeholder}
			onChange={(e) => {
				setPath(k, e.target.value);
				saveSoon();
			}}
		/>
	);
}
export function Check({ k, label, onSet }: Path & { label?: string; onSet?: (v: boolean) => void }) {
	return (
		<input
			type="checkbox"
			aria-label={label}
			checked={!!getPath(k)}
			onChange={(e) => {
				setPath(k, e.target.checked);
				onSet?.(e.target.checked);
				save();
			}}
		/>
	);
}
export function Select({ k, options, label, style, onSet }: Path & { options: (string | [string, string])[]; label?: string; style?: React.CSSProperties; onSet?: (v: string) => void }) {
	return (
		<select
			aria-label={label}
			style={style}
			value={String(getPath(k) ?? '')}
			onChange={(e) => {
				setPath(k, e.target.value);
				onSet?.(e.target.value);
				save();
			}}
		>
			{options.map((o) => {
				const [v, l] = Array.isArray(o) ? o : [o, o];
				return (
					<option key={v} value={v}>
						{l}
					</option>
				);
			})}
		</select>
	);
}
export function DateInput({ k, onSet }: Path & { onSet?: (v: string) => void }) {
	return (
		<input
			type="date"
			value={String(getPath(k) ?? '')}
			onChange={(e) => {
				setPath(k, e.target.value);
				onSet?.(e.target.value);
				save();
			}}
		/>
	);
}

export const Chip = ({ children, c = '' }: { children: ReactNode; c?: string }) => <span className={`chip ${c}`}>{children}</span>;

export function Bar({ p }: { p: number }) {
	return (
		<div className="bar">
			<i style={{ width: `${Math.round(Math.max(0, Math.min(1, p)) * 100)}%` }} />
		</div>
	);
}

export function Ring({ p }: { p: number }) {
	const r = 38;
	const c = 2 * Math.PI * r;
	const pct = Math.round(p * 100);
	return (
		<div className="ring" role="img" aria-label={`Hoàn thành ${pct}%`}>
			<svg width="92" height="92" viewBox="0 0 92 92" aria-hidden="true">
				<circle cx="46" cy="46" r={r} fill="none" stroke="var(--line)" strokeWidth="8" />
				<circle cx="46" cy="46" r={r} fill="none" stroke="var(--ok)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(c * p).toFixed(1)} ${c.toFixed(1)}`} transform="rotate(-90 46 46)" />
			</svg>
			<b>{pct}%</b>
		</div>
	);
}

export const Stat = ({ label, val, note }: { label: string; val: string; note?: string }) => (
	<div className="stat">
		<span className="note">{label}</span>
		<b>{val}</b>
		{note && <span className="note">{note}</span>}
	</div>
);

export const Banner = ({ children, tone = 'warn' }: { children: ReactNode; tone?: 'warn' | 'ok' | 'accent' | 'signal' }) => <div className={`banner ${tone}`}>{children}</div>;

export function TaskDetail({ t }: { t: Task }) {
	return (
		<dl className="detail">
			<dt>Vì sao làm</dt>
			<dd>{t.why}</dd>
			<dt>Cách làm</dt>
			<dd>
				<ol>
					{t.steps.map((s) => (
						<li key={s}>{s}</li>
					))}
				</ol>
			</dd>
			<dt>Đầu ra và bằng chứng</dt>
			<dd>{t.out}</dd>
			<dt>Tiêu chí hoàn thành</dt>
			<dd>{t.ok}</dd>
			<dt>KPI</dt>
			<dd>{t.kpi}</dd>
		</dl>
	);
}

export function TaskRow({ t, day }: { t: Task; day: string }) {
	const k = `days|${day}|tasks|${t.id}`;
	const done = !!getPath(k);
	return (
		<div className={`task${done ? ' done' : ''}`}>
			<Check k={k} label={t.name} />
			<div className="grow">
				<div className="tn">
					<b>{t.id}</b> {t.name}
				</div>
				<div className="tm">
					{t.min ? `${t.min} phút · ` : ''}
					{COMPNAME[t.comp]} · {P.auth[t.auth]}
				</div>
				<details>
					<summary className="tm">Cách làm</summary>
					<TaskDetail t={t} />
				</details>
			</div>
		</div>
	);
}

export const Empty = ({ children }: { children: ReactNode }) => <p className="note">{children}</p>;
