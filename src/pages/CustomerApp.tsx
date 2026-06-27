import { useEffect, useMemo, useState } from 'react';
import { Bell, ChevronRight, Search, ShoppingBag } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { getIdToken, initializeLiff, type LineProfile } from '../lib/liff';
import { supabase } from '../lib/supabase';

type CustomerState = 'loading' | 'new' | 'pending' | 'approved' | 'error';

type SessionResponse = {
  customer: null | {
    id: string;
    shop_name: string | null;
    status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
    customer_type: 'NORMAL' | 'VIP';
  };
};

const demoProducts = [
  { name: 'Mini Olivia Brown', subtitle: 'Blister Pack', price: '฿290' },
  { name: 'Baby Doll Gray', subtitle: 'Blister Pack', price: '฿290' },
  { name: 'Mio Brown', subtitle: 'Blister Pack', price: '฿320' },
  { name: 'Mini Olivia Gray', subtitle: 'Blister Pack', price: '฿290' },
];

export default function CustomerApp() {
  const [profile, setProfile] = useState<LineProfile | null>(null);
  const [state, setState] = useState<CustomerState>('loading');
  const [shopName, setShopName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [active, setActive] = useState('home');
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const p = await initializeLiff();
        setProfile(p);
        setContactName(p.displayName);
        const token = getIdToken();
        const { data, error: invokeError } = await supabase.functions.invoke<SessionResponse>('line-session', {
          body: { action: 'session', idToken: token },
        });
        if (invokeError) throw invokeError;
        if (!data?.customer) setState('new');
        else if (data.customer.status === 'APPROVED') setState('approved');
        else setState('pending');
      } catch (e) {
        const message = e instanceof Error ? e.message : 'ไม่สามารถเชื่อมต่อ LINE ได้';
        if (!message.includes('Redirecting')) {
          setError(message);
          setState('error');
        }
      }
    })();
  }, []);

  async function register() {
    if (!shopName.trim() || !contactName.trim() || !phone.trim()) return;
    try {
      setState('loading');
      const { error: invokeError } = await supabase.functions.invoke('line-session', {
        body: {
          action: 'register',
          idToken: getIdToken(),
          payload: { shopName: shopName.trim(), contactName: contactName.trim(), phone: phone.trim() },
        },
      });
      if (invokeError) throw invokeError;
      setState('pending');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'ลงทะเบียนไม่สำเร็จ');
      setState('error');
    }
  }

  const greeting = useMemo(() => profile?.displayName ?? 'ลูกค้า', [profile]);

  if (state === 'loading') return <div className="center-screen"><div className="loader" /><p>กำลังเชื่อมต่อ LINE...</p></div>;
  if (state === 'error') return <div className="center-screen"><h2>เกิดข้อผิดพลาด</h2><p>{error}</p></div>;

  if (state === 'new') {
    return (
      <main className="customer-shell registration-page">
        <section className="registration-card">
          <div className="brand-mark">L</div>
          <p className="eyebrow">WELCOME</p>
          <h1>ลงทะเบียนร้านค้า</h1>
          <p className="muted">กรอกข้อมูลสั้น ๆ เพื่อเริ่มสั่งซื้อผ่าน LINE</p>
          <label>ชื่อร้าน<input value={shopName} onChange={(e) => setShopName(e.target.value)} placeholder="เช่น ร้านแว่น ABC" /></label>
          <label>ชื่อผู้ติดต่อ<input value={contactName} onChange={(e) => setContactName(e.target.value)} /></label>
          <label>เบอร์โทร<input inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08x-xxx-xxxx" /></label>
          <button className="primary-button" onClick={register}>ส่งข้อมูลลงทะเบียน</button>
        </section>
      </main>
    );
  }

  if (state === 'pending') {
    return (
      <main className="customer-shell pending-page">
        <section className="pending-card">
          <div className="status-orb">✓</div>
          <p className="eyebrow">REGISTRATION RECEIVED</p>
          <h1>ได้รับข้อมูลแล้ว</h1>
          <p>แอดมินกำลังตรวจสอบบัญชีร้านค้าของคุณ เมื่ออนุมัติแล้วจะเริ่มสั่งซื้อได้ทันที</p>
        </section>
      </main>
    );
  }

  return (
    <main className="customer-shell app-page">
      <header className="mobile-header">
        <div>
          <span className="muted small">สวัสดี</span>
          <h2>{greeting}</h2>
        </div>
        <div className="header-actions"><button><Bell size={19} /></button><button><ShoppingBag size={19} /></button></div>
      </header>

      <section className="search-box"><Search size={18} /><input placeholder="ค้นหาสินค้า รุ่น หรือสี" /></section>

      <section className="hero-banner">
        <div><span className="pill">สินค้าแนะนำ</span><h1>คอนแทคเลนส์<br />สำหรับร้านของคุณ</h1><button>เลือกซื้อเลย <ChevronRight size={16} /></button></div>
        <div className="lens-art"><div className="lens-circle" /><div className="lens-circle second" /></div>
      </section>

      <section className="section-heading"><div><span className="eyebrow">POPULAR</span><h3>สินค้าขายดี</h3></div><button>ดูทั้งหมด</button></section>
      <section className="product-grid">
        {demoProducts.map((product, index) => (
          <article className="product-card" key={product.name}>
            <div className={`product-image product-${index + 1}`}><div className="lens-pack">KK</div></div>
            <div className="product-copy"><h4>{product.name}</h4><p>{product.subtitle}</p><strong>{product.price}</strong></div>
            <button className="add-button">+</button>
          </article>
        ))}
      </section>
      <BottomNav active={active} onChange={setActive} />
    </main>
  );
}
