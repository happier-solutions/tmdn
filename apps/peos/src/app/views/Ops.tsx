import { useState } from 'react';
import { addDays, iso, parse, todayISO } from '../dates';
import { onTimeRate } from '../logic';
import { S, save } from '../store';
import { Banner, DateInput, Select, Stat, Text } from '../ui';

type Col = [key: string, label: string, kind: 'text' | 'date' | 'sel', options?: string[]];
interface OpsCfg {
	key: 'tracker' | 'decisions' | 'risks';
	label: string;
	add: string;
	cols: Col[];
	closed?: string;
	blank: () => Record<string, string>;
}
const OPS: Record<'t' | 'd' | 'r', OpsCfg> = {
	t: {
		key: 'tracker',
		label: 'Tracker',
		add: 'Thêm việc',
		cols: [
			['t', 'Việc', 'text'],
			['o', 'Owner', 'text'],
			['due', 'Deadline', 'date'],
			['out', 'Đầu ra', 'text'],
			['imp', 'Mức quan trọng', 'sel', ['Cao', 'Trung bình', 'Thấp']],
			['st', 'Trạng thái', 'sel', ['Mới', 'Đang làm', 'Chờ phản hồi', 'Xong']],
		],
		closed: 'Xong',
		blank: () => ({ t: '', o: '', due: '', out: '', imp: 'Trung bình', st: 'Mới', done: '' }),
	},
	d: {
		key: 'decisions',
		label: 'Decision Log',
		add: 'Thêm quyết định',
		cols: [
			['d', 'Ngày', 'date'],
			['t', 'Quyết định', 'text'],
			['who', 'Ai quyết', 'text'],
			['basis', 'Căn cứ', 'text'],
			['next', 'Việc tiếp theo', 'text'],
		],
		blank: () => ({ d: todayISO(), t: '', who: '', basis: '', next: '' }),
	},
	r: {
		key: 'risks',
		label: 'Risk Register',
		add: 'Thêm rủi ro',
		cols: [
			['t', 'Rủi ro', 'text'],
			['lvl', 'Mức', 'sel', ['Cao', 'Vừa', 'Thấp']],
			['o', 'Người xử lý', 'text'],
			['due', 'Hạn', 'date'],
			['mit', 'Biện pháp', 'text'],
			['st', 'Trạng thái', 'sel', ['Mở', 'Đang xử lý', 'Đã đóng']],
		],
		closed: 'Đã đóng',
		blank: () => ({ t: '', lvl: 'Vừa', o: '', due: '', mit: '', st: 'Mở', done: '' }),
	},
};

export default function Ops() {
	const [tab, setTab] = useState<'t' | 'd' | 'r'>('t');
	const [showDone, setShowDone] = useState(false);
	const cfg = OPS[tab];
	const list = S[cfg.key] as unknown as Record<string, string>[];
	const t0 = todayISO();
	const lim = iso(addDays(parse(t0), 2));
	let open = 0;
	let od = 0;
	let soon = 0;
	if (cfg.closed) {
		for (const r of list) {
			if (r.st === cfg.closed) continue;
			open++;
			if (r.due && r.due < t0) od++;
			else if (r.due && r.due <= lim) soon++;
		}
	}
	const ot = onTimeRate();
	// Closing a row stamps the day; reopening clears it.
	const onStatus = (i: number) => (v: string) => {
		list[i].done = v === cfg.closed ? todayISO() : '';
	};
	const rows = list.map((r, i) => ({ r, i })).filter(({ r }) => showDone || !cfg.closed || r.st !== cfg.closed);

	return (
		<>
			<h1>Điều hành</h1>
			<div className="sub">Executive Action Tracker, Decision Log và Risk Register: ba công cụ cốt lõi của CEO Office.</div>
			<Banner tone="signal">Dùng mã việc hoặc viết tắt, không ghi nội dung nhạy cảm của công ty.</Banner>
			<div className="tabs" role="tablist">
				{(Object.keys(OPS) as ('t' | 'd' | 'r')[]).map((k) => (
					<button type="button" role="tab" aria-selected={tab === k} key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>
						{OPS[k].label}
					</button>
				))}
			</div>
			{cfg.closed && (
				<div className="stats">
					<Stat label="Đang mở" val={String(open)} />
					<Stat label="Trễ hạn" val={String(od)} />
					<Stat label="Đến hạn trong 48 giờ" val={String(soon)} />
					{tab === 't' && <Stat label="Đúng hạn" val={ot == null ? '–' : `${ot}%`} note="Trên các việc đã xong có deadline" />}
				</div>
			)}
			<div className="row gap-b">
				<button
					type="button"
					className="primary"
					onClick={() => {
						(list as unknown[]).push(cfg.blank());
						save();
					}}
				>
					{cfg.add}
				</button>
				{cfg.closed && (
					<label className="row inline">
						<input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} /> Hiện cả việc đã đóng
					</label>
				)}
			</div>
			<div className="card scroll">
				<table className="tbl">
					<thead>
						<tr>
							{cfg.cols.map((c) => (
								<th key={c[0]}>{c[1]}</th>
							))}
							<th />
						</tr>
					</thead>
					<tbody>
						{rows.map(({ r, i }) => {
							const odr = cfg.closed && r.st !== cfg.closed && r.due && r.due < t0;
							return (
								<tr key={i} className={odr ? 'od' : undefined}>
									{cfg.cols.map(([key, label, kind, opts]) => {
										const k = `${cfg.key}|${i}|${key}`;
										return (
											<td key={key}>
												{kind === 'sel' ? (
													<Select k={k} options={opts!} label={label} onSet={key === 'st' ? onStatus(i) : undefined} />
												) : kind === 'date' ? (
													<DateInput k={k} />
												) : (
													<Text k={k} label={label} style={{ minWidth: 150 }} />
												)}
											</td>
										);
									})}
									<td className="act">
										<button
											type="button"
											className="ghost danger"
											aria-label="Xóa dòng"
											onClick={() => {
												list.splice(i, 1);
												save();
											}}
										>
											Xóa
										</button>
									</td>
								</tr>
							);
						})}
						{!rows.length && (
							<tr>
								<td colSpan={cfg.cols.length + 1} className="note">
									Chưa có dòng nào. Bấm “{cfg.add}” để bắt đầu.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</>
	);
}
