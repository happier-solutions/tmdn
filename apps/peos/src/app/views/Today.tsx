import { useEffect, useRef, useState } from 'react';
import { WEEKDAYS, addDays, fmtS, iso, monday, pad, parse, todayISO } from '../dates';
import { STATUS, autoFillPriorities, backupDue, curStage, dayObj, doneInRange, hasPriText, learnSuggestion, learnTarget, parseQuick, reviewDue, stageOpenTasks, status, suggestPri, weekMin } from '../logic';
import { DAILY, P, S, TASKMAP, save, setPath } from '../store';
import { Area, Banner, Bar, Check, Chip, Ring, TaskRow, Text } from '../ui';

export default function Today() {
	const [cur, setCur] = useState(todayISO);
	const t0 = todayISO();
	const isToday = cur === t0;
	const qc = useRef<HTMLInputElement>(null);
	const day = dayObj(cur);

	// Morning: fill the three priorities once from yesterday, the Tracker and the stage.
	useEffect(() => {
		if (S.autoPri !== false && isToday && !dayObj(cur)._auto && !hasPriText(dayObj(cur))) autoFillPriorities(cur);
	}, [cur, isToday]);

	const d = parse(cur);
	const st = curStage();
	const dailyDone = DAILY.filter((t) => day.tasks?.[t.id]).length;
	const pri = day.pri || {};
	let priDone = 0;
	for (let i = 0; i < 3; i++) if (pri[i]?.d) priDone++;
	const score = (dailyDone + priDone) / (DAILY.length + 3);

	const mo = monday(d);
	const su = addDays(mo, 6);
	const m1 = new Date(d.getFullYear(), d.getMonth(), 1);
	const m2 = new Date(d.getFullYear(), d.getMonth() + 1, 0);
	const qm = Math.floor(d.getMonth() / 3) * 3;
	const q1 = new Date(d.getFullYear(), qm, 1);
	const q2 = new Date(d.getFullYear(), qm + 3, 0);
	const pick = (freq: string, a: Date, b: Date) => P.tasks.filter((t) => t.freq === freq && (day.tasks?.[t.id] || !doneInRange(t.id, a, b)));
	const wd = d.getDay();
	let due = wd === 5 || wd === 6 || wd === 0 ? pick('weekly', mo, su) : [];
	if (d.getDate() >= 26) due = due.concat(pick('monthly', m1, m2));
	if (d.getDate() >= 26 && (d.getMonth() + 1) % 3 === 0) due = due.concat(pick('quarterly', q1, q2));

	const open = stageOpenTasks().slice(0, 4);
	const lim = iso(addDays(parse(t0), 2));
	const fu = S.tracker
		.filter((r) => r.t && r.due && r.st !== 'Xong' && r.due <= lim)
		.sort((a, b) => (a.due < b.due ? -1 : 1))
		.slice(0, 5);
	const wm = weekMin(mo);
	const tg = learnTarget();
	const used = new Set<string>();
	for (let i = 0; i < 3; i++) if (pri[i]?.t) used.add(String(pri[i].t).toLowerCase());
	const sgAll = suggestPri(cur)
		.filter((x) => !used.has(x.toLowerCase()))
		.slice(0, 4);

	const evs: [string, string][] = [];
	S.tracker.forEach((r, j) => {
		if (r.st === 'Xong' && r.done === cur && !r.evd && r.t) evs.push([`t|${j}`, r.t]);
	});
	for (const t of P.tasks) if (S.libD[t.id] === cur && status(t.id) === 'Xong' && !S.libE[t.id]) evs.push([`l|${t.id}`, `${t.id} ${t.name}`]);
	const rd = isToday ? reviewDue() : [];

	const move = (n: number) => setCur(n === 0 ? todayISO() : iso(addDays(parse(cur), n)));
	const addPri = (text: string) => {
		let slot = 2;
		for (let s = 0; s < 3; s++) {
			if (!(pri[s]?.t && String(pri[s].t).trim())) {
				slot = s;
				break;
			}
		}
		setPath(`days|${cur}|pri|${slot}|t`, text);
		save();
	};
	const quickAdd = () => {
		const v = qc.current?.value.trim();
		if (!v) return;
		const p = parseQuick(v);
		if (!p.t) return;
		S.tracker.push({ t: p.t, o: p.o, due: p.due, out: '', imp: 'Trung bình', st: 'Mới', done: '' });
		qc.current!.value = '';
		save();
		qc.current!.focus();
	};
	const logEvidence = (src: string) => {
		const [kind, id] = src.split('|');
		if (kind === 't') {
			const tr = S.tracker[+id];
			if (tr) {
				S.evidence.push({ id: `EVD-${Date.now()}`, d: t0, type: P.roles.solved, title: tr.t, sum: tr.out || '', comp: '', task: '' });
				tr.evd = true;
			}
		} else {
			const tk = TASKMAP[id];
			if (tk) {
				S.evidence.push({ id: `EVD-${Date.now()}`, d: t0, type: P.roles.shipped, title: `${tk.id} ${tk.name}`, sum: tk.out, comp: tk.comp, task: tk.id });
				S.libE[tk.id] = true;
			}
		}
		save();
	};

	return (
		<>
			{backupDue() && (
				<Banner>
					Bạn chưa sao lưu file trong hơn 7 ngày. <a href="#du-lieu">Sao lưu ngay</a>
				</Banner>
			)}
			{rd.length > 0 && (
				<Banner tone="accent">
					Đến lúc làm: {rd.join(', ')}. Bản nháp đã được tạo sẵn từ dữ liệu của bạn. <a href="#review">Mở Review</a>
				</Banner>
			)}
			<div className="masthead">
				<div>
					<div className="mast-date">
						{WEEKDAYS[d.getDay()]}, {pad(d.getDate())}/{pad(d.getMonth() + 1)}
					</div>
					<div className="mast-sub">
						{d.getFullYear()} · {P.stages[st]?.name}
						{isToday ? '' : ' · không phải hôm nay'}
					</div>
				</div>
				<div className="row" style={{ gap: 14 }}>
					<div className="row" style={{ gap: 6 }}>
						<button type="button" onClick={() => move(-1)} aria-label="Ngày trước">
							‹
						</button>
						<button type="button" onClick={() => move(0)}>
							Hôm nay
						</button>
						<button type="button" onClick={() => move(1)} aria-label="Ngày sau">
							›
						</button>
					</div>
					<Ring p={score} />
				</div>
			</div>

			{S.onboard !== false && Object.keys(S.days).length < 2 && (
				<div className="card soft">
					<div className="row">
						<h3 className="grow flush">Bắt đầu trong 3 bước</h3>
						<button
							type="button"
							className="ghost"
							onClick={() => {
								S.onboard = false;
								save();
							}}
						>
							Ẩn
						</button>
					</div>
					<ol className="steps">
						<li>Xem 3 ưu tiên đã được điền sẵn, sửa lại cho đúng.</li>
						<li>Tick nhịp cố định khi làm xong; bấm “Cách làm” nếu cần hướng dẫn.</li>
						<li>Ghi chỉ đạo của CEO vào ô “Ghi nhanh”; hệ thống tự theo dõi hạn và nhắc follow-up.</li>
					</ol>
				</div>
			)}

			<div className="card hero">
				<div className="row spread">
					<h2 className="flush">Ba ưu tiên</h2>
					<span className="note">{priDone}/3 xong</span>
				</div>
				{[0, 1, 2].map((k) => (
					<div key={k} className={`pri${pri[k]?.d ? ' done' : ''}`}>
						<span className="pn">{k + 1}</span>
						<Check k={`days|${cur}|pri|${k}|d`} label={`Ưu tiên ${k + 1} đã xong`} />
						<Text k={`days|${cur}|pri|${k}|t`} className="grow" placeholder="Việc và kết quả cần có" label={`Ưu tiên ${k + 1}`} />
					</div>
				))}
				{day._auto && <p className="auto">Đã điền sẵn từ việc chưa xong hôm trước, Tracker và việc của giai đoạn. Sửa tự do.</p>}
				{sgAll.length > 0 && (
					<div className="sug">
						<span className="note">Gợi ý thêm:</span>
						{sgAll.map((x) => (
							<button type="button" key={x} onClick={() => addPri(x)}>
								+ {x.length > 60 ? `${x.slice(0, 58)}…` : x}
							</button>
						))}
					</div>
				)}
			</div>

			<div className="card">
				<label className="f first" htmlFor="qc">
					Ghi nhanh chỉ đạo vào Tracker (dùng @owner và #ngày/tháng)
				</label>
				<div className="row">
					<input
						ref={qc}
						id="qc"
						type="text"
						className="grow"
						placeholder="Soạn báo cáo Q1 @Lan #25/11, rồi nhấn Enter"
						onKeyDown={(e) => {
							if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
								e.preventDefault();
								quickAdd();
							}
						}}
					/>
					<button type="button" className="primary" onClick={quickAdd}>
						Thêm
					</button>
				</div>
			</div>

			<div className="grid2">
				<div className="card">
					<div className="row spread">
						<h2 className="flush">Nhịp cố định</h2>
						<span className="note">
							{dailyDone}/{DAILY.length} xong
						</span>
					</div>
					<div className="gap-y">
						<Bar p={DAILY.length ? dailyDone / DAILY.length : 0} />
					</div>
					{DAILY.map((t) => (
						<TaskRow key={t.id} t={t} day={cur} />
					))}
				</div>
				<div>
					{fu.length > 0 && (
						<div className="card">
							<div className="row spread">
								<h2 className="flush">Cần follow-up</h2>
								<a href="#dieu-hanh" className="note">
									Mở Tracker
								</a>
							</div>
							{fu.map((r, i) => {
								const od = r.due < t0;
								return (
									<div className="fu-row" key={i}>
										<div className="grow">
											<b>{r.t}</b>
											<div className="note">
												{r.o ? `${r.o} · ` : ''}hạn {fmtS(r.due)}
											</div>
										</div>
										<Chip c={od ? 'warn' : 'hi'}>{od ? 'Trễ' : 'Sắp đến hạn'}</Chip>
									</div>
								);
							})}
						</div>
					)}
					{due.length > 0 && (
						<div className="card">
							<h2 className="flush">Đến hạn</h2>
							{due.map((t) => (
								<TaskRow key={t.id} t={t} day={cur} />
							))}
						</div>
					)}
					{evs.length > 0 && (
						<div className="card">
							<h2 className="flush">Có thể ghi bằng chứng</h2>
							<p className="note">Việc xong hôm nay chưa có trong nhật ký bằng chứng.</p>
							{evs.map(([src, label]) => (
								<div className="fu-row" key={src}>
									<div className="grow">{label}</div>
									<button type="button" onClick={() => logEvidence(src)}>
										Ghi
									</button>
								</div>
							))}
						</div>
					)}
					<div className="card">
						<h2 className="flush">Việc theo giai đoạn</h2>
						{open.length ? (
							open.map((t) => (
								<div className="task" key={t.id}>
									<div className="grow">
										<div className="tn">
											<b>{t.id}</b> {t.name}
										</div>
										<div className="tm">{t.out}</div>
									</div>
									<StageStatus id={t.id} />
								</div>
							))
						) : (
							<p className="note">Không còn việc mở của giai đoạn này. Xem Thư viện để chọn việc tiếp theo.</p>
						)}
					</div>
					<div className="card">
						<h2 className="flush">Ghi chú trong ngày</h2>
						<label className="f">Chủ động trao đổi với CEO</label>
						<Area k={`days|${cur}|ceo`} placeholder="Việc cần CEO biết hoặc quyết định" rows={2} />
						<label className="f">Cần follow-up thêm</label>
						<Area k={`days|${cur}|fu`} placeholder="Ai, việc gì, hạn" rows={2} />
						<label className="f">Học hôm nay</label>
						<p className="note tight">{learnSuggestion()}</p>
						<Area k={`days|${cur}|learn`} placeholder="3 dòng điều áp dụng được" rows={2} />
						<label className="f">Số phút đã học</label>
						<Text k={`days|${cur}|learnMin`} placeholder="0" inputMode="numeric" style={{ maxWidth: 120 }} label="Số phút đã học" />
						<p className="note tight">
							Tuần này {(wm / 60).toFixed(1)} giờ, mục tiêu {tg[0] / 60}–{tg[1] / 60} giờ
						</p>
						<Bar p={wm / tg[1]} />
						<label className="f">Kết quả đã tạo ra</label>
						<Area k={`days|${cur}|note`} placeholder="Kết quả đã tạo ra hôm nay" rows={3} />
					</div>
				</div>
			</div>
		</>
	);
}

// Status of a one-off task; "Xong" stamps the day it was done (libD) for drafts and evidence.
export function StageStatus({ id, onSet, style = { width: 140 } }: { id: string; onSet?: (v: string) => void; style?: React.CSSProperties }) {
	return (
		<select
			aria-label="Trạng thái"
			style={style}
			value={status(id)}
			onChange={(e) => {
				const v = e.target.value;
				S.lib[id] = v;
				if (v === 'Xong') S.libD[id] = todayISO();
				else delete S.libD[id];
				onSet?.(v);
				save();
			}}
		>
			{STATUS.map((s) => (
				<option key={s}>{s}</option>
			))}
		</select>
	);
}
