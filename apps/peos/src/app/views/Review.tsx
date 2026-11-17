import { useEffect, useState } from 'react';
import { addDays, iso, parse, todayISO } from '../dates';
import { autoDraft, periodFor, reviewDue, reviewEmpty } from '../logic';
import { DAILY, P, S } from '../store';
import { Area } from '../ui';

const TABS: ['w' | 'm' | 'q', string][] = [
	['w', 'Tuần'],
	['m', 'Tháng'],
	['q', 'Quý'],
];

export default function Review() {
	const [tab, setTab] = useState<'w' | 'm' | 'q'>('w');
	const [date, setDate] = useState(todayISO);
	const pi = periodFor(tab, date);
	const today = parse(todayISO());

	// A started period with an empty review gets a draft from the data.
	useEffect(() => {
		if (S.autoReview !== false && pi.start <= today && reviewEmpty(pi.key)) autoDraft(pi);
	}, [pi.key]);

	let dayN = 0;
	let dt = 0;
	let dd = 0;
	let pf = 0;
	let pd = 0;
	for (let x = new Date(pi.start); x <= pi.end; x = addDays(x, 1)) {
		const o = S.days[iso(x)];
		if (!o) continue;
		const c = DAILY.filter((k) => o.tasks?.[k.id]).length;
		let a = 0;
		let b = 0;
		for (let i = 0; i < 3; i++) {
			if (o.pri?.[i]?.t) {
				b++;
				if (o.pri[i].d) a++;
			}
		}
		if (c || b) {
			dayN++;
			dt += DAILY.length;
			dd += c;
			pf += b;
			pd += a;
		}
	}
	const r = S.reviews[pi.key] || {};
	const due = reviewDue();

	return (
		<>
			<h1>Review</h1>
			<div className="sub">Bản nháp được tạo tự động từ nhật ký, Tracker, Decision Log, Bằng chứng và ghi chú kiến thức. Bạn chỉ cần bổ sung phần suy nghĩ, như nguyên nhân và bài học.</div>
			<div className="tabs" role="tablist">
				{TABS.map(([v, l]) => (
					<button type="button" role="tab" aria-selected={tab === v} key={v} className={tab === v ? 'on' : ''} onClick={() => setTab(v)}>
						{l}
						{due.some((x) => x.toLowerCase().includes(l.toLowerCase())) ? ' •' : ''}
					</button>
				))}
			</div>
			<div className="row gap-b">
				<button type="button" onClick={() => setDate(pi.prev)} aria-label="Kỳ trước">
					‹
				</button>
				<b className="grow">{pi.label}</b>
				<button type="button" onClick={() => setDate(pi.next)} aria-label="Kỳ sau">
					›
				</button>
			</div>
			<div className="card">
				<h2 className="flush">Số liệu tự động</h2>
				<div className="grid3">
					<div>
						<div className="note">Ngày có log</div>
						<b className="big">{dayN}</b>
					</div>
					<div>
						<div className="note">Nhịp cố định đã làm</div>
						<b className="big">{dt ? `${Math.round((dd / dt) * 100)}%` : '–'}</b>
					</div>
					<div>
						<div className="note">Ưu tiên hoàn thành</div>
						<b className="big">{pf ? `${pd}/${pf}` : '–'}</b>
					</div>
				</div>
			</div>
			<div className="row gap-b">
				<span className={r._auto ? 'auto grow' : 'grow'}>{r._auto ? 'Đã điền sẵn từ dữ liệu của bạn. Sửa hoặc xóa tùy ý.' : ''}</span>
				<button type="button" onClick={() => autoDraft(pi)}>
					Điền thêm vào ô trống từ dữ liệu
				</button>
			</div>
			<div className="card">
				{P.reviewQuestions[tab].map(([k, label]) => (
					<label className="f" key={k}>
						{label}
						<Area k={`reviews|${pi.key}|${k}`} rows={k === 'why' ? 2 : 4} />
					</label>
				))}
			</div>
		</>
	);
}
