import { fmtS, todayISO } from '../dates';
import { autoMetrics, compLevel } from '../logic';
import { P, S, save } from '../store';
import type { Plan } from '../types';
import { Chip, Text } from '../ui';

function Track({ c, v }: { c: Plan['comps'][number]; v: number | null }) {
	return (
		<div className={`track${v == null ? ' na' : ''}`}>
			{v != null && [1, 2, 3, 4, 5].map((i) => <span key={i} className={i <= v ? 'f' : ''} />)}
			<i className="t" style={{ left: `${((c.t3 - 0.5) / 5) * 100}%` }} title="Mục tiêu 3 tháng" />
			<i className="t2" style={{ left: `${((c.t12 - 0.5) / 5) * 100}%` }} title="Mục tiêu 12 tháng" />
		</div>
	);
}

export default function Comp() {
	const m = autoMetrics();
	const cnt: Record<string, number> = {};
	for (const e of S.evidence) if (e.comp) cnt[e.comp] = (cnt[e.comp] || 0) + 1;
	const AUTO: Record<string, string> = { K2: m.ot == null ? '' : `${m.ot}% đúng hạn`, K3: `${m.dec} quyết định/30 ngày`, K4: `${m.rodd} rủi ro quá hạn` };

	return (
		<>
			<h1>Năng lực</h1>
			<div className="sub">Thang 1 Awareness · 2 Working Knowledge · 3 Independent Execution · 4 Ownership · 5 Strategic Leadership. Chỉ nâng mức khi có bằng chứng.</div>
			<div className="card">
				<div className="legend">
					<span>
						<i className="sw accent" />
						Mức hiện tại
					</span>
					<span>
						<i className="sw signal" />
						Mục tiêu 3 tháng
					</span>
					<span>
						<i className="sw ok" />
						Mục tiêu 12 tháng
					</span>
					<span>
						<i className="sw hatch" />
						Chưa đủ bằng chứng
					</span>
				</div>
				{P.comps.map((c) => {
					const u = S.comps[c.id] || { cur: null };
					const v = compLevel(c.id);
					const n = cnt[c.id] || 0;
					return (
						<div className="cbar" key={c.id}>
							<div>
								<b>{c.name}</b>
								<div className="note">
									{v == null ? 'Chưa đủ bằng chứng' : `Level ${v}`}
									{u.d ? ` · ${fmtS(u.d)}` : ''} · {n} mục bằng chứng
								</div>
								{v != null && v >= 3 && n === 0 && <Chip c="warn">Chưa có mục trong Bằng chứng</Chip>}
							</div>
							<Track c={c} v={v} />
							<select
								aria-label={`Mức của ${c.name}`}
								value={v == null ? '' : String(v)}
								onChange={(e) => {
									const val = e.target.value === '' ? null : +e.target.value;
									S.comps[c.id] = { ...(S.comps[c.id] || {}), cur: val, d: todayISO() };
									save();
								}}
							>
								<option value="">Chưa đủ bằng chứng</option>
								{[1, 2, 3, 4, 5].map((k) => (
									<option key={k} value={k}>
										Level {k}
									</option>
								))}
							</select>
							<div className="full">
								<Text k={`comps|${c.id}|ev`} placeholder="Bằng chứng cho mức này (không dán nội dung mật)" label={`Bằng chứng cho ${c.name}`} />
							</div>
						</div>
					);
				})}
			</div>
			<h2>Personal Executive Scorecard</h2>
			<p className="note">Mục tiêu số được chốt sau 30 ngày dùng thật, khi đã có baseline. Cột “Tự động” lấy từ Tracker, Decision Log và Risk Register.</p>
			<div className="card scroll">
				<table>
					<thead>
						<tr>
							<th>Chỉ số</th>
							<th>Cách đo</th>
							<th>Tần suất</th>
							<th>Tự động</th>
							<th>Giá trị ghi tay</th>
							<th>Bằng chứng</th>
						</tr>
					</thead>
					<tbody>
						{P.kpis.map((k) => (
							<tr key={k.id}>
								<td>
									<b>{k.name}</b>
									<div className="note">{k.source}</div>
								</td>
								<td>{k.how}</td>
								<td>{k.freq}</td>
								<td className="note">{AUTO[k.id] || '–'}</td>
								<td style={{ minWidth: 130 }}>
									<Text k={`kpis|${k.id}|v`} placeholder="Chưa đo" label={`Giá trị ${k.name}`} />
								</td>
								<td style={{ minWidth: 180 }}>
									<Text k={`kpis|${k.id}|e`} label={`Bằng chứng ${k.name}`} />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</>
	);
}
