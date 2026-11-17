import { useState } from 'react';
import { fmtS, todayISO } from '../dates';
import { P, S, defaults, emit, merge, persistLocal, replaceState, save, storageOK } from '../store';
import { applyShard, cloudPrune, getConflicts, resetAll, setConflicts, sync, syncNow } from '../sync';
import type { Plan } from '../types';
import { Check, DateInput, Select } from '../ui';

const STATUS_LABEL = { pulling: 'Đang tải dữ liệu…', saving: 'Đang lưu…', ok: 'Đã đồng bộ', error: 'Lỗi đồng bộ', offline: 'Đang ngoại tuyến' };

export function kindLabel(k: string) {
	if (k === 'core') return 'Thiết lập, năng lực, cổng, KPI';
	if (k === 'ops') return 'Tracker, Decision Log, Risk Register';
	if (k === 'journal') return 'Bằng chứng và ghi chú kiến thức';
	if (k.startsWith('d-')) return `Nhật ký ngày ${k.slice(2)}`;
	if (k.startsWith('rv-')) return `Review năm ${k.slice(3)}`;
	return k;
}

function download(name: string, text: string) {
	const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
	const a = Object.assign(document.createElement('a'), { href: url, download: name });
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}
const readFile = (input: HTMLInputElement) => input.files?.[0]?.text() ?? Promise.resolve('');

export default function Data() {
	const [msg, setMsg] = useState('');
	const [armed, setArmed] = useState('');
	const [importText, setImportText] = useState('');
	const conflicts = getConflicts();
	const snaps = Object.entries(sync.snaps)
		.map(([id, x]) => ({ id, ...x }))
		.sort((a, b) => b.t - a.t);
	const arm = (id: string) => {
		if (armed === id) return true;
		setArmed(id);
		return false;
	};

	const exportBackup = () => {
		download(`peos-backup-${todayISO()}.json`, JSON.stringify(S, null, 2));
		S.lastExport = todayISO();
		save();
		setMsg('Đã lưu file sao lưu.');
	};
	const importBackup = (raw: string) => {
		try {
			const o = JSON.parse(raw.trim());
			if (!o || typeof o !== 'object' || o.v !== 1 || !o.days) throw new Error('format');
			replaceState(merge(defaults(), o));
			S._t = {};
			S._h = {};
			// Not save(): its delayed conditional push would lose to the server copy. cloudPrune force-pushes.
			persistLocal();
			emit();
			void cloudPrune();
			setImportText('');
			setMsg('Đã khôi phục dữ liệu.');
		} catch {
			setMsg('Nội dung không đúng định dạng sao lưu của PEOS. Dữ liệu hiện tại không bị thay đổi.');
		}
	};
	const uploadPlan = async (raw: string) => {
		let plan: Plan;
		try {
			plan = JSON.parse(raw);
			if (plan?.version !== 1 || !Array.isArray(plan.tasks)) throw new Error('format');
		} catch {
			return setMsg('File kế hoạch không đúng định dạng.');
		}
		const res = await fetch('/api/plan', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(plan) });
		if (!res.ok) return setMsg('Không lưu được kế hoạch. Thử lại sau.');
		location.reload();
	};

	return (
		<>
			<h1>Dữ liệu</h1>
			<div className="sub">Dữ liệu được giữ ở ba lớp: trên máy này, trong cơ sở dữ liệu gắn với tài khoản của bạn, và file sao lưu do bạn tự lưu.</div>
			{!storageOK && <div className="banner">Trình duyệt này không cho lưu dữ liệu. Hãy dựa vào đồng bộ và file sao lưu.</div>}
			{msg && (
				<div className="banner ok" role="status">
					{msg}
				</div>
			)}
			{conflicts.length > 0 && (
				<div className="card attention">
					<h3>Có thay đổi trên máy bị thay thế do xung đột</h3>
					<p className="note">Khi hai thiết bị cùng sửa một phần dữ liệu, bản mới hơn được giữ. Bản cũ trên máy này được lưu lại để bạn khôi phục nếu cần.</p>
					{conflicts.map((c, i) => (
						<div className="fu-row" key={`${c.id}-${c.t}`}>
							<div className="grow">
								{kindLabel(c.id)}
								<div className="note">{new Date(c.t).toLocaleString('vi-VN')}</div>
							</div>
							<button
								type="button"
								onClick={() => {
									applyShard(c.id, c.shard);
									setConflicts(conflicts.filter((_, j) => j !== i));
									save();
									setMsg('Đã khôi phục bản trên máy.');
								}}
							>
								Khôi phục bản này
							</button>
							<button
								type="button"
								className="ghost"
								onClick={() => {
									setConflicts(conflicts.filter((_, j) => j !== i));
									emit();
								}}
							>
								Bỏ
							</button>
						</div>
					))}
				</div>
			)}
			<div className="card">
				<h2 className="flush">Đồng bộ</h2>
				<p>
					<b>{STATUS_LABEL[sync.st]}</b>
					{sync.st === 'error' && ` (${sync.err})`}
					{sync.last && sync.st === 'ok' && ` · lúc ${new Date(sync.last).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`}
				</p>
				<p className="note">Dữ liệu nằm trong khu vực riêng của tài khoản bạn. Đăng nhập trên máy khác là có lại toàn bộ. Vẫn hãy lưu file sao lưu mỗi tháng.</p>
				<button
					type="button"
					onClick={async () => {
						await syncNow(true);
						setMsg('Đã đồng bộ.');
					}}
				>
					Đồng bộ ngay
				</button>
			</div>
			{snaps.length > 0 && (
				<div className="card">
					<h2 className="flush">Bản chụp hằng tuần</h2>
					<p className="note">Mỗi tuần hệ thống tự chụp lại thiết lập, Tracker và nhật ký bằng chứng, giữ 4 tuần gần nhất. Dùng khi lỡ xóa hoặc sửa nhầm.</p>
					{snaps.map((x) => (
						<div className="fu-row" key={x.id}>
							<div className="grow">
								{kindLabel(x.kind)}
								<div className="note">{new Date(x.t).toLocaleDateString('vi-VN')}</div>
							</div>
							<button
								type="button"
								onClick={() => {
									if (!arm(x.id)) return;
									applyShard(x.kind, x.data);
									save();
									setArmed('');
									setMsg('Đã khôi phục bản chụp. Dữ liệu sẽ được đồng bộ lại.');
								}}
							>
								{armed === x.id ? 'Bấm lại để xác nhận' : 'Khôi phục'}
							</button>
						</div>
					))}
				</div>
			)}
			<div className="card">
				<h2 className="flush">Tự động hóa</h2>
				<label className="row inline gap-b">
					<Check k="autoPri" /> Tự điền 3 ưu tiên mỗi sáng từ việc chưa xong, Tracker và việc của giai đoạn
				</label>
				<label className="row inline">
					<Check k="autoReview" /> Tự tạo bản nháp review tuần, tháng, quý từ dữ liệu
				</label>
			</div>
			<div className="card">
				<h2 className="flush">Thiết lập</h2>
				<div className="grid3">
					<label className="f first">
						Ngày bắt đầu đi làm
						<DateInput k="start" />
					</label>
					<label className="f first">
						Ngày bắt đầu kế hoạch Giai đoạn 0
						<DateInput k="planStart" />
					</label>
					<label className="f first">
						Đặt tay giai đoạn
						<Select k="stageOverride" options={[['', 'Tự động theo lịch'], ...P.stages.map((s, i): [string, string] => [String(i), s.short])]} />
					</label>
				</div>
			</div>
			<div className="card">
				<h2 className="flush">Sao lưu file</h2>
				<p className="note">Sao lưu gần nhất: {S.lastExport ? fmtS(S.lastExport) : 'chưa có'}</p>
				<button type="button" className="primary" onClick={exportBackup}>
					Lưu file sao lưu
				</button>
			</div>
			<div className="card">
				<h2 className="flush">Khôi phục từ file</h2>
				<label className="f first">
					Chọn file sao lưu .json
					<input type="file" accept="application/json,.json" onChange={async (e) => setImportText(await readFile(e.target))} />
				</label>
				<label className="f">
					Hoặc dán nội dung sao lưu
					<textarea rows={5} value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="Dán JSON đã sao lưu" />
				</label>
				<div className="gap-t">
					<button type="button" disabled={!importText.trim()} onClick={() => importBackup(importText)}>
						Khôi phục từ nội dung này
					</button>
				</div>
				<p className="note gap-t">Việc này thay thế dữ liệu hiện có, cả trên máy chủ.</p>
			</div>
			<div className="card">
				<h2 className="flush">Kế hoạch</h2>
				<p className="note">
					Kế hoạch gồm {P.tasks.length} việc, {P.comps.length} năng lực, {P.gates.length} cổng. Thay kế hoạch không xóa nhật ký của bạn.
				</p>
				<div className="row">
					<button type="button" onClick={() => download(`peos-plan-${todayISO()}.json`, JSON.stringify(P, null, '\t'))}>
						Tải kế hoạch
					</button>
					<label className="btn">
						Thay kế hoạch từ file
						<input type="file" accept="application/json,.json" className="sr-only" onChange={async (e) => uploadPlan(await readFile(e.target))} />
					</label>
				</div>
			</div>
			<div className="card">
				<h2 className="flush">Xóa dữ liệu</h2>
				<p className="note">Xóa toàn bộ nhật ký, bằng chứng, review và thiết lập, trên máy này và trên máy chủ. Kế hoạch được giữ.</p>
				<button
					type="button"
					className="danger"
					onClick={async () => {
						if (!arm('reset')) return;
						setArmed('');
						try {
							await resetAll();
							setMsg('Đã xóa dữ liệu.');
						} catch {
							persistLocal();
							setMsg('Không xóa được dữ liệu trên máy chủ. Hãy thử lại khi có kết nối.');
						}
					}}
				>
					{armed === 'reset' ? 'Bấm lại để xác nhận xóa' : 'Xóa tất cả dữ liệu'}
				</button>
			</div>
		</>
	);
}
