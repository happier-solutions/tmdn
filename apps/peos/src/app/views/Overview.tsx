import { addDays, diffDays, fmtD, fmtS, iso, monday, pad, parse, todayISO } from '../dates';
import { autoMetrics, compLevel, curStage, dayScore, learnTarget, milestoneDates, stageTasks, status, weakest, weekMin } from '../logic';
import { P, S } from '../store';
import { Bar, Chip, Stat, Text } from '../ui';

function Heat() {
	const t0 = parse(todayISO());
	const s0 = addDays(monday(t0), -77);
	const cells = [];
	for (let w = 0; w < 12; w++) {
		for (let k = 0; k < 7; k++) {
			const x = addDays(s0, w * 7 + k);
			const key = iso(x);
			if (x > t0) {
				cells.push(<i key={key} className="fu" />);
				continue;
			}
			const sc = dayScore(key);
			const l = sc == null ? 0 : sc < 0.34 ? 1 : sc < 0.67 ? 2 : sc < 0.9 ? 3 : 4;
			cells.push(<i key={key} className={`l${l}`} title={`${fmtS(key)}${sc == null ? ': chưa có log' : `: ${Math.round(sc * 100)}%`}`} />);
		}
	}
	return (
		<div className="heat" role="img" aria-label="Mức hoàn thành 12 tuần gần nhất">
			{cells}
		</div>
	);
}

function LearnBars() {
	const t0 = parse(todayISO());
	const tg = learnTarget();
	const vals: [Date, number][] = [];
	let mx = tg[1];
	for (let w = 7; w >= 0; w--) {
		const m = addDays(monday(t0), -7 * w);
		const v = weekMin(m);
		vals.push([m, v]);
		if (v > mx) mx = v;
	}
	return (
		<div className="wbars">
			{vals.map(([m, v]) => (
				<div className="wb" key={iso(m)}>
					<span className="wv">{v ? (v / 60).toFixed(1) : '–'}</span>
					<div className="wcol">
						<i className={v >= tg[0] ? 'ok' : ''} style={{ height: `${(v / mx) * 100}%` }} />
					</div>
					<span className="wl">
						{pad(m.getDate())}/{pad(m.getMonth() + 1)}
					</span>
				</div>
			))}
		</div>
	);
}

export default function Overview() {
	const st = curStage();
	const t0 = parse(todayISO());
	const m = autoMetrics();
	const w = weakest();
	const vals = P.comps.map((c) => compLevel(c.id)).filter((v): v is number => v != null);
	const avg = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '–';
	const stT = stageTasks();
	const stD = stT.filter((t) => status(t.id) === 'Xong').length;
	const gd = P.gates.filter((g) => g.criteria.every((_, j) => S.gates[`${g.id}_${j}`])).length;

	return (
		<>
			<h1>Tổng quan</h1>
			<div className="sub">“{P.motto}”</div>
			<div className="stats">
				<Stat label="Ngày có log (28 ngày)" val={String(m.days)} />
				<Stat label="Mức hoàn thành TB" val={m.avg == null ? '–' : `${m.avg}%`} note="Trên các ngày có log" />
				<Stat label="Giờ học tuần này" val={(m.wm / 60).toFixed(1)} note={`Mục tiêu ${m.tg[0] / 60}–${m.tg[1] / 60} giờ`} />
				<Stat label="Việc trễ trong Tracker" val={String(m.od)} note={m.ot == null ? 'Chưa có việc xong có deadline' : `Đúng hạn ${m.ot}% các việc đã xong`} />
				<Stat label="Bằng chứng tháng này" val={String(m.ev)} note={`Quyết định ghi 30 ngày: ${m.dec}`} />
			</div>
			<div className="card">
				<h2 className="flush">Giai đoạn</h2>
				<div className="stages">
					{P.stages.map((s, i) => (
						<div key={s.name} className={`stg${i === st ? ' cur' : ''}`}>
							<b>{s.short}</b>
							{s.span}
							{i === st && (
								<>
									<br />
									<Chip c="ac">Hiện tại</Chip>
								</>
							)}
						</div>
					))}
				</div>
				<p className="note gap-t">Giai đoạn tính theo lịch chỉ để tham khảo. Chuyển cấp thật dựa vào Cổng. Bạn có thể đặt tay trong màn hình Dữ liệu.</p>
			</div>
			<div className="grid2">
				<div className="card">
					<h2 className="flush">Nhịp thực hiện 12 tuần</h2>
					<Heat />
					<p className="note gap-t">Mỗi ô là một ngày; màu đậm hơn là hoàn thành nhiều hơn.</p>
				</div>
				<div className="card">
					<h2 className="flush">Giờ học mỗi tuần (8 tuần)</h2>
					<LearnBars />
					<p className="note gap-t">Cột xanh là tuần đạt mức tối thiểu ({m.tg[0] / 60} giờ).</p>
				</div>
			</div>
			<div className="grid2">
				<div className="card">
					<h2 className="flush">3 ưu tiên chiến lược</h2>
					{[0, 1, 2].map((i) => (
						<div key={i} className="gap-b">
							<Text k={`star|${i}`} label={`Ưu tiên chiến lược ${i + 1}`} />
						</div>
					))}
				</div>
				<div className="card">
					<h2 className="flush">Các mốc sắp tới</h2>
					{S.start ? (
						<table>
							<tbody>
								{milestoneDates().map(([label, d]) => {
									const n = diffDays(d, t0);
									return (
										<tr key={label}>
											<td>{label}</td>
											<td>{fmtD(d)}</td>
											<td className="note">{n > 0 ? `còn ${n} ngày` : n === 0 ? 'hôm nay' : 'đã qua'}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					) : (
						<p className="note">
							Đặt ngày bắt đầu đi làm trong <a href="#du-lieu">Dữ liệu</a>.
						</p>
					)}
				</div>
			</div>
			<div className="grid2">
				<div className="card">
					<h2 className="flush">Năng lực yếu nhất</h2>
					<p className="note">
						Điểm trung bình {avg}/5 trên {vals.length} năng lực có bằng chứng; {P.comps.length - vals.length} năng lực chưa đủ bằng chứng.
					</p>
					{w.map((x) => (
						<div className="row line" key={x.id}>
							<span className="grow">{x.n}</span>
							{x.na ? <Chip c="warn">Chưa đủ bằng chứng</Chip> : <Chip c="hi">{`Level ${x.v} → ${x.t}`}</Chip>}
						</div>
					))}
				</div>
				<div className="card">
					<h2 className="flush">Dự án và sản phẩm cần xong</h2>
					{stT.length ? (
						<>
							<p className="note">
								{stD}/{stT.length} việc của giai đoạn hiện tại đã xong
							</p>
							<Bar p={stD / stT.length} />
							<div className="gap-t">
								{stT
									.filter((t) => status(t.id) !== 'Xong')
									.slice(0, 5)
									.map((t) => (
										<div key={t.id} className="pad-y">
											<b>{t.id}</b> {t.out}
										</div>
									))}
							</div>
						</>
					) : (
						<p className="note">Giai đoạn này chưa có danh sách việc cố định. Xem Thư viện.</p>
					)}
				</div>
			</div>
			<div className="grid2">
				<div className="card">
					<h2 className="flush">Rủi ro đối với sự phát triển</h2>
					<ul className="steps">
						{P.growthRisks.map((r) => (
							<li key={r}>{r}</li>
						))}
					</ul>
				</div>
				<div className="card">
					<h2 className="flush">Cổng chuyển cấp</h2>
					<p>
						{gd}/{P.gates.length} cổng đủ bằng chứng.
					</p>
					<p className="note">Mỗi cổng cần đủ mọi điều kiện, không tính theo thời gian.</p>
					<p>
						<a href="#cong">Mở màn hình Cổng</a>
					</p>
				</div>
			</div>
		</>
	);
}
