import { useState } from 'react';
import { fmtS, todayISO } from '../dates';
import { P, S, save } from '../store';
import { Chip } from '../ui';

export default function Know() {
	const [dom, setDom] = useState('');
	const [q, setQ] = useState('');
	const [form, setForm] = useState({ dom: P.knowledgeDomains[0] ?? '', title: '', body: '' });
	const [msg, setMsg] = useState('');
	const notes = S.notes;
	const ql = q.toLowerCase();
	const list = notes.filter((n) => (!dom || n.dom === dom) && (!ql || `${n.title} ${n.body}`.toLowerCase().includes(ql))).sort((a, b) => (a.d < b.d ? 1 : -1));

	const add = () => {
		const title = form.title.trim();
		if (!title) return setMsg('Nhập tiêu đề trước khi lưu.');
		S.notes.push({ id: `KN-${Date.now()}`, d: todayISO(), dom: form.dom, title, body: form.body.trim() });
		setForm({ ...form, title: '', body: '' });
		setMsg('');
		save();
	};
	const chip = (v: string, label: string) => (
		<button type="button" key={v || '*'} className={`chip kchip${dom === v ? ' on' : ''}`} aria-pressed={dom === v} onClick={() => setDom(v)}>
			{label}
		</button>
	);

	return (
		<>
			<h1>Kiến thức</h1>
			<div className="sub">Thư viện ghi chú theo lĩnh vực. Mỗi ghi chú nên kết thúc bằng một câu: điều này thay đổi cách tôi làm việc như thế nào.</div>
			<div className="row gap-b">
				{chip('', `Tất cả (${notes.length})`)}
				{P.knowledgeDomains.map((d) => chip(d, `${d} (${notes.filter((x) => x.dom === d).length})`))}
			</div>
			<div className="card">
				<div className="grid2">
					<label className="f first">
						Lĩnh vực
						<select value={form.dom} onChange={(e) => setForm({ ...form, dom: e.target.value })}>
							{P.knowledgeDomains.map((d) => (
								<option key={d}>{d}</option>
							))}
						</select>
					</label>
					<label className="f first">
						Tiêu đề
						<input type="text" value={form.title} placeholder="Một dòng" onChange={(e) => setForm({ ...form, title: e.target.value })} />
					</label>
				</div>
				<label className="f">
					Nội dung (không dán nội dung mật)
					<textarea rows={4} value={form.body} placeholder="Điều đã học, nguồn, và cách áp dụng vào công việc" onChange={(e) => setForm({ ...form, body: e.target.value })} />
				</label>
				<div className="gap-t">
					<button type="button" className="primary" onClick={add}>
						Lưu ghi chú
					</button>{' '}
					<span className="note" role="status">
						{msg}
					</span>
				</div>
			</div>
			<div className="row gap-b">
				<h2 className="grow flush">{list.length} ghi chú</h2>
				<input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm trong ghi chú" aria-label="Tìm trong ghi chú" style={{ maxWidth: 240 }} />
			</div>
			{list.map((n) => (
				<details className="lib" key={n.id}>
					<summary>
						<span className="grow">
							<b>{n.title}</b>
						</span>
						<Chip c="ac">{n.dom}</Chip>
						<span className="note">{fmtS(n.d)}</span>
					</summary>
					<div className="libbody">
						<div className="pre">{n.body}</div>
						<div className="gap-t">
							<button
								type="button"
								className="ghost danger"
								onClick={() => {
									S.notes = S.notes.filter((x) => x.id !== n.id);
									save();
								}}
							>
								Xóa ghi chú
							</button>
						</div>
					</div>
				</details>
			))}
			{!list.length && <p className="note">Chưa có ghi chú nào phù hợp. Khi học xong một buổi, ghi 3 dòng ở đây.</p>}
		</>
	);
}
