import { P, S } from '../store';
import { Check, Chip } from '../ui';

export default function Gates() {
	return (
		<>
			<h1>Cổng chuyển cấp</h1>
			<div className="sub">Tích khi có bằng chứng thật cho từng điều kiện. Thiếu một điều kiện là chưa qua cổng.</div>
			{P.gates.map((g) => {
				const n = g.criteria.filter((_, j) => S.gates[`${g.id}_${j}`]).length;
				return (
					<div className="card" key={g.id}>
						<div className="row">
							<h3 className="grow flush">
								{g.id}: {g.title}
							</h3>
							<Chip c={n === g.criteria.length ? 'ok' : ''}>
								{n}/{g.criteria.length}
							</Chip>
						</div>
						<div className="gap-t">
							{g.criteria.map((c, j) => (
								<div className="task" key={c}>
									<Check k={`gates|${g.id}_${j}`} label={c} />
									<div className="grow">{c}</div>
								</div>
							))}
						</div>
						<p className="note gap-t">Dấu hiệu chưa sẵn sàng: {g.notReady}</p>
					</div>
				);
			})}
			{P.gateBranches.length > 0 && (
				<div className="card">
					<h3>Nếu công ty không giao quyền</h3>
					<ol className="steps">
						{P.gateBranches.map((b) => (
							<li key={b}>{b}</li>
						))}
					</ol>
				</div>
			)}
		</>
	);
}
