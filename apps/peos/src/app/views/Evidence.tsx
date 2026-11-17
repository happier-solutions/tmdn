import { useState } from 'react';
import { fmtS, todayISO } from '../dates';
import { COMPNAME, P, S, save } from '../store';
import { Banner } from '../ui';

export default function Evidence() {
	const blank = () => ({ type: P.evidenceTypes[0] ?? '', d: todayISO(), title: '', sum: '', comp: '', task: '' });
	const [form, setForm] = useState(blank);
	const [msg, setMsg] = useState('');
	const [f, setF] = useState({ type: '', comp: '' });
	const field = (k: keyof ReturnType<typeof blank>) => ({
		value: form[k],
		onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [k]: e.target.value }),
	});
	const add = () => {
		const title = form.title.trim();
		if (!title) return setMsg('Nhập tiêu đề trước khi lưu.');
		S.evidence.push({ id: `EVD-${Date.now()}`, d: form.d || todayISO(), type: form.type, title, sum: form.sum.trim(), comp: form.comp, task: form.task.trim() });
		setForm(blank());
		setMsg('');
		save();
	};
	const list = S.evidence.filter((e) => (!f.type || e.type === f.type) && (!f.comp || e.comp === f.comp)).sort((a, b) => (a.d < b.d ? 1 : -1));

	return (
		<>
			<h1>Bằng chứng và thành tựu</h1>
			<div className="sub">Hồ sơ năng lực có bằng chứng cho đánh giá, thăng tiến và chuyển việc.</div>
			<Banner tone="signal">Chỉ ghi tóm tắt và con số đã được phép dùng. Không dán nội dung chỉ đạo hoặc dữ liệu mật của công ty vào đây.</Banner>
			<div className="card">
				<div className="grid2">
					<label className="f first">
						Loại
						<select {...field('type')}>
							{P.evidenceTypes.map((t) => (
								<option key={t}>{t}</option>
							))}
						</select>
					</label>
					<label className="f first">
						Ngày
						<input type="date" {...field('d')} />
					</label>
				</div>
				<label className="f">
					Tiêu đề
					<input type="text" placeholder="Một dòng" {...field('title')} />
				</label>
				<label className="f">
					Tóm tắt kết quả (có số đo nếu được phép)
					<textarea rows={3} {...field('sum')} />
				</label>
				<div className="grid2">
					<label className="f">
						Năng lực liên quan
						<select {...field('comp')}>
							<option value="">Không gắn</option>
							{P.comps.map((c) => (
								<option key={c.id} value={c.id}>
									{c.name}
								</option>
							))}
						</select>
					</label>
					<label className="f">
						Mã việc liên quan (nếu có)
						<input type="text" placeholder="Ví dụ S1-07" {...field('task')} />
					</label>
				</div>
				<div className="gap-t">
					<button type="button" className="primary" onClick={add}>
						Lưu bằng chứng
					</button>{' '}
					<span className="note" role="status">
						{msg}
					</span>
				</div>
			</div>
			<div className="row gap-b gap-t">
				<h2 className="grow flush">
					{list.length} / {S.evidence.length} mục
				</h2>
				<select aria-label="Lọc theo loại" style={{ width: 'auto' }} value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
					<option value="">Mọi loại</option>
					{P.evidenceTypes.map((t) => (
						<option key={t}>{t}</option>
					))}
				</select>
				<select aria-label="Lọc theo năng lực" style={{ width: 'auto' }} value={f.comp} onChange={(e) => setF({ ...f, comp: e.target.value })}>
					<option value="">Mọi năng lực</option>
					{P.comps.map((c) => (
						<option key={c.id} value={c.id}>
							{c.name}
						</option>
					))}
				</select>
			</div>
			{list.map((e) => (
				<div className="ev" key={e.id}>
					<div className="row">
						<b className="grow">{e.title}</b>
						<button
							type="button"
							className="ghost danger"
							onClick={() => {
								S.evidence = S.evidence.filter((x) => x.id !== e.id);
								save();
							}}
						>
							Xóa
						</button>
					</div>
					<div className="note">
						{fmtS(e.d)} · {e.type}
						{e.comp ? ` · ${COMPNAME[e.comp] || ''}` : ''}
						{e.task ? ` · ${e.task}` : ''}
					</div>
					<div>{e.sum}</div>
				</div>
			))}
			{!list.length && <p className="note">Chưa có mục nào phù hợp. Bằng chứng đầu tiên thường là một việc bạn giải quyết trong 2 tuần đầu.</p>}
		</>
	);
}
