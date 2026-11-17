import { useState } from 'react';
import { status } from '../logic';
import { COMPNAME, P } from '../store';
import { Chip, TaskDetail } from '../ui';
import { StageStatus } from './Today';

const EMPTY = { freq: '', comp: '', pri: '', auth: '', st: '', q: '' };
type Filter = typeof EMPTY;

export default function Library() {
	const [f, setF] = useState<Filter>(EMPTY);
	const set = (k: keyof Filter) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
	const q = f.q.toLowerCase();
	const list = P.tasks.filter(
		(t) =>
			(!f.freq || t.freq === f.freq) &&
			(!f.comp || t.comp === f.comp) &&
			(!f.pri || t.pri === f.pri) &&
			(!f.auth || t.auth === f.auth) &&
			(!f.st || status(t.id) === f.st) &&
			(!q || `${t.name} ${t.id} ${t.out}`.toLowerCase().includes(q)),
	);
	const sel = (k: keyof Filter, label: string, opts: [string, string][]) => (
		<div>
			<label className="f first">
				{label}
				<select value={f[k]} onChange={set(k)}>
					<option value="">Tất cả</option>
					{opts.map(([v, l]) => (
						<option key={v} value={v}>
							{l}
						</option>
					))}
				</select>
			</label>
		</div>
	);
	const pris = [...new Set(P.tasks.map((t) => t.pri))].map((p): [string, string] => [p, p]);

	return (
		<>
			<h1>Thư viện công việc</h1>
			<div className="sub">{P.tasks.length} việc. Mỗi việc có cách làm, đầu ra, tiêu chí và KPI. Bộ lọc theo loại, năng lực, ưu tiên, quyền và trạng thái.</div>
			<div className="card">
				<div className="grid3">
					{sel('freq', 'Loại / tần suất', Object.entries(P.freq))}
					{sel(
						'comp',
						'Năng lực',
						P.comps.map((c) => [c.id, c.name]),
					)}
					{sel('pri', 'Ưu tiên', pris)}
					{sel('auth', 'Quyền', Object.entries(P.auth))}
					{sel(
						'st',
						'Trạng thái',
						['Chưa bắt đầu', 'Đang làm', 'Xong', 'Lặp lại'].map((s) => [s, s]),
					)}
					<div>
						<label className="f first">
							Tìm
							<input type="text" value={f.q} onChange={set('q')} placeholder="Tên hoặc mã việc" />
						</label>
					</div>
				</div>
				<div className="row gap-t">
					<span className="note">{list.length} việc phù hợp</span>
					<button type="button" onClick={() => setF(EMPTY)}>
						Xóa bộ lọc
					</button>
				</div>
			</div>
			{list.map((t) => {
				const stt = status(t.id);
				return (
					<details className="lib" key={t.id}>
						<summary>
							<b>{t.id}</b>
							<span className="grow">{t.name}</span>
							<Chip>{P.freq[t.freq]}</Chip>
							<Chip c={t.pri === 'Cao' ? 'hi' : ''}>{t.pri}</Chip>
							<Chip c="ac">{P.auth[t.auth]}</Chip>
							<Chip c={stt === 'Xong' ? 'ok' : ''}>{stt}</Chip>
						</summary>
						<div className="libbody">
							<TaskDetail t={t} />
							<dl className="detail">
								<dt>Năng lực</dt>
								<dd>{COMPNAME[t.comp]}</dd>
							</dl>
							{stt !== 'Lặp lại' && (
								<label className="f">
									Trạng thái
									<StageStatus id={t.id} style={{ maxWidth: 220 }} />
								</label>
							)}
						</div>
					</details>
				);
			})}
			{!list.length && <p className="note">Không có việc nào phù hợp bộ lọc.</p>}
		</>
	);
}
