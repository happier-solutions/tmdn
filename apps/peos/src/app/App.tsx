import { useEffect, useState, type ComponentType } from 'react';
import { curStage, overdueCount, planWeek, reviewDue } from './logic';
import { P, S, applyTheme, init, save, useStore } from './store';
import { startSync, sync } from './sync';
import type { Plan } from './types';
import Comp from './views/Comp';
import Data from './views/Data';
import Evidence from './views/Evidence';
import Gates from './views/Gates';
import Know from './views/Know';
import Library from './views/Library';
import Ops from './views/Ops';
import Overview from './views/Overview';
import Review from './views/Review';
import Today from './views/Today';

const VIEWS: Record<string, [string, ComponentType]> = {
	'hom-nay': ['Hôm nay', Today],
	'dieu-hanh': ['Điều hành', Ops],
	'thu-vien': ['Thư viện', Library],
	'nang-luc': ['Năng lực', Comp],
	'kien-thuc': ['Kiến thức', Know],
	review: ['Review', Review],
	'tong-quan': ['Tổng quan', Overview],
	'bang-chung': ['Bằng chứng', Evidence],
	cong: ['Cổng', Gates],
	'du-lieu': ['Dữ liệu', Data],
};
const NAV: [string, string[]][] = [
	['Hằng ngày', ['hom-nay', 'dieu-hanh']],
	['Phát triển', ['thu-vien', 'nang-luc', 'kien-thuc', 'review']],
	['Hồ sơ', ['tong-quan', 'bang-chung', 'cong']],
	['Hệ thống', ['du-lieu']],
];
const routeOf = () => {
	const h = location.hash.slice(1);
	return VIEWS[h] ? h : 'hom-nay';
};

const SYNC_RAIL = {
	pulling: ['Đang tải dữ liệu…', ''],
	saving: ['Đang lưu…', ''],
	ok: ['Đã lưu', ''],
	error: ['Chưa đồng bộ được', 'Dữ liệu vẫn an toàn trên máy'],
	offline: ['Đang ngoại tuyến', 'Thay đổi được lưu trên máy'],
} as const;

async function signOut() {
	await fetch('/api/auth/sign-out', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
	location.href = '/login/';
}

function Shell() {
	useStore();
	const [view, setView] = useState(routeOf);
	useEffect(() => {
		const on = () => {
			setView(routeOf());
			window.scrollTo(0, 0);
		};
		window.addEventListener('hashchange', on);
		return () => window.removeEventListener('hashchange', on);
	}, []);
	useEffect(() => {
		document.title = `PEOS – ${VIEWS[view][0]}`;
	}, [view]);
	applyTheme();

	const [, View] = VIEWS[view];
	const st = curStage();
	const od = overdueCount();
	const rd = reviewDue().length;
	const [syncTitle, syncNote] = SYNC_RAIL[sync.st];
	const time = sync.st === 'ok' && sync.last ? `Lúc ${new Date(sync.last).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : syncNote;

	return (
		<div className="app">
			<aside className="rail">
				<p className="brand">PEOS</p>
				<p className="brand-sub">Executive Career Command Center</p>
				<div className="stagebox">
					<b>{P.stages[st]?.short}</b>
					{P.stages[st]?.span}
					{st === 0 ? ` · tuần ${planWeek()}/11` : ''}
				</div>
				<nav className="nav" aria-label="Màn hình">
					{NAV.map(([group, keys]) => (
						<div key={group} className="navset">
							<div className="navgrp">{group}</div>
							{keys.map((k) => (
								<a key={k} href={`#${k}`} aria-current={k === view ? 'page' : undefined}>
									{VIEWS[k][0]}
									{k === 'dieu-hanh' && od > 0 && (
										<span className="badge" title="Việc trễ hạn">
											{od}
										</span>
									)}
									{k === 'review' && rd > 0 && (
										<span className="badge accent" title="Đến hạn review">
											{rd}
										</span>
									)}
								</a>
							))}
						</div>
					))}
				</nav>
				<div className={`syncbox ${sync.st === 'ok' ? 'ok' : sync.st === 'error' ? 'bad' : ''}`} role="status">
					<b>{syncTitle}</b>
					{time}
				</div>
				<div className="railfoot">
					<button
						type="button"
						onClick={() => {
							S.theme = S.theme === '' ? 'light' : S.theme === 'light' ? 'dark' : '';
							save();
						}}
					>
						Giao diện: {S.theme === 'light' ? 'sáng' : S.theme === 'dark' ? 'tối' : 'tự động'}
					</button>
					<button type="button" className="ghost" onClick={signOut}>
						Đăng xuất
					</button>
				</div>
			</aside>
			<main>
				<View key={view} />
			</main>
		</div>
	);
}

function NoPlan() {
	const [msg, setMsg] = useState('');
	return (
		<main className="center">
			<div className="card narrow">
				<h1>Chưa có kế hoạch</h1>
				<p className="note">Tải lên file kế hoạch .json của bạn để bắt đầu. File này chỉ lưu trong tài khoản của bạn.</p>
				<input
					type="file"
					accept="application/json,.json"
					aria-label="File kế hoạch"
					onChange={async (e) => {
						const raw = (await e.target.files?.[0]?.text()) ?? '';
						const res = await fetch('/api/plan', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: raw });
						if (res.ok) location.reload();
						else setMsg('File kế hoạch không đúng định dạng.');
					}}
				/>
				<p className="note" role="status">
					{msg}
				</p>
				<button type="button" className="ghost" onClick={signOut}>
					Đăng xuất
				</button>
			</div>
		</main>
	);
}

export default function App({ userId }: { userId: string }) {
	const [state, setState] = useState<'loading' | 'ready' | 'noplan' | 'error'>('loading');
	useEffect(() => {
		fetch('/api/plan')
			.then(async (res) => {
				if (res.status === 401) return void (location.href = '/login/');
				if (res.status === 404) return setState('noplan');
				if (!res.ok) throw new Error(String(res.status));
				const { plan } = (await res.json()) as { plan: Plan };
				init(plan, userId);
				applyTheme();
				await startSync();
				setState('ready');
			})
			.catch(() => setState('error'));
	}, [userId]);

	if (state === 'loading') return <p className="loading">Đang tải…</p>;
	if (state === 'noplan') return <NoPlan />;
	if (state === 'error') return <p className="loading">Không tải được kế hoạch. Tải lại trang để thử lại.</p>;
	return <Shell />;
}
