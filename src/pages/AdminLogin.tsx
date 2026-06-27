import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) return setError(authError.message);
    const { data } = await supabase.from('admin_users').select('id').maybeSingle();
    if (!data) {
      await supabase.auth.signOut();
      return setError('บัญชีนี้ไม่มีสิทธิ์ Admin');
    }
    navigate('/admin/dashboard');
  }

  return (
    <main className="admin-login-page">
      <form className="admin-login-card" onSubmit={submit}>
        <div className="brand-mark">L</div>
        <p className="eyebrow">LENS ORDER ADMIN</p>
        <h1>เข้าสู่ระบบหลังบ้าน</h1>
        <label>อีเมล<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label>รหัสผ่าน<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        {error && <p className="error-text">{error}</p>}
        <button className="primary-button" type="submit">เข้าสู่ระบบ</button>
      </form>
    </main>
  );
}
