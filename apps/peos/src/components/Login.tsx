import { useState } from 'react';

type Mode = 'in' | 'up';

const MESSAGES: Record<string, string> = {
	INVALID_EMAIL_OR_PASSWORD: 'Email hoặc mật khẩu không đúng.',
	USER_ALREADY_EXISTS: 'Email này đã có tài khoản. Hãy đăng nhập.',
	USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'Email này đã có tài khoản. Hãy đăng nhập.',
	PASSWORD_TOO_SHORT: 'Mật khẩu cần ít nhất 10 ký tự.',
	FORBIDDEN: 'Email này chưa được phép đăng ký.',
};

export default function Login({ signUp }: { signUp: boolean }) {
	const [mode, setMode] = useState<Mode>('in');
	const [busy, setBusy] = useState(false);
	const [msg, setMsg] = useState('');

	async function submit(e: React.SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		const f = new FormData(e.currentTarget);
		const email = String(f.get('email') || '').trim();
		const password = String(f.get('password') || '');
		const body = mode === 'in' ? { email, password } : { email, password, name: email.split('@')[0] };
		setBusy(true);
		setMsg('');
		try {
			const res = await fetch(`/api/auth/sign-${mode}/email`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
			if (res.ok) {
				location.href = '/';
				return;
			}
			const err = (await res.json().catch(() => ({}))) as { code?: string; message?: string };
			setMsg((err.code && MESSAGES[err.code]) || (res.status === 429 ? 'Thử quá nhiều lần. Đợi một phút rồi thử lại.' : err.message || 'Không đăng nhập được. Thử lại sau.'));
		} catch {
			setMsg('Không kết nối được máy chủ.');
		} finally {
			setBusy(false);
		}
	}

	return (
		<form className="card narrow" onSubmit={submit}>
			<p className="brand">PEOS</p>
			<p className="brand-sub">Executive Career Command Center</p>
			<h1>{mode === 'in' ? 'Đăng nhập' : 'Tạo tài khoản'}</h1>
			<label className="f">
				Email
				<input type="email" name="email" autoComplete="username" required />
			</label>
			<label className="f">
				Mật khẩu
				<input type="password" name="password" autoComplete={mode === 'in' ? 'current-password' : 'new-password'} minLength={10} required />
			</label>
			<p className="note" role="alert">
				{msg}
			</p>
			<div className="row spread">
				<button type="submit" className="primary" disabled={busy}>
					{busy ? 'Đang xử lý…' : mode === 'in' ? 'Đăng nhập' : 'Tạo tài khoản'}
				</button>
				{signUp && (
					<button
						type="button"
						className="ghost"
						onClick={() => {
							setMode(mode === 'in' ? 'up' : 'in');
							setMsg('');
						}}
					>
						{mode === 'in' ? 'Tạo tài khoản' : 'Đã có tài khoản'}
					</button>
				)}
			</div>
		</form>
	);
}
