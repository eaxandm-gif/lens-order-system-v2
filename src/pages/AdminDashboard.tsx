import { useEffect, useState } from 'react';
import { BarChart3, Boxes, Check, ClipboardList, LayoutDashboard, LogOut, PackageCheck, Search, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type Customer = {
  id: string;
  shop_name: string;
  contact_name: string;
  phone: string;
  status: string;
  customer_type: string;
  created_at: string;
};

export default function AdminDashboard() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function loadCustomers() {
    setLoading(true);
    const { data } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    setCustomers((data as Customer[]) ?? []);
    setLoading(false);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate('/admin');
      else loadCustomers();
    });
  }, [navigate]);

  async function approve(id: string) {
    await supabase.from('customers').update({ status: 'APPROVED', approved_at: new Date().toISOString() }).eq('id', id);
    await loadCustomers();
  }

  async function logout() {
    await supabase.auth.signOut();
    navigate('/admin');
  }

  const pending = customers.filter((item) => item.status === 'PENDING_APPROVAL');

  return (
    <main className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-brand"><div className="brand-mark small-brand">L</div><div><strong>Lens Order</strong><span>Admin Console</span></div></div>
        <nav>
          <button className="selected"><LayoutDashboard size={19} />ภาพรวม</button>
          <button><Users size={19} />ลูกค้า</button>
          <button><ClipboardList size={19} />คำสั่งซื้อ</button>
          <button><Boxes size={19} />สินค้าและ SKU</button>
          <button><PackageCheck size={19} />คลังและจัดส่ง</button>
          <button><BarChart3 size={19} />รายงาน</button>
        </nav>
        <button className="logout-button" onClick={logout}><LogOut size={18} />ออกจากระบบ</button>
      </aside>

      <section className="admin-content">
        <header className="admin-topbar"><div><p className="eyebrow">DASHBOARD</p><h1>ภาพรวมระบบ</h1></div><div className="admin-search"><Search size={17} /><input placeholder="ค้นหา..." /></div></header>
        <section className="metric-grid">
          <article><span>ลูกค้าทั้งหมด</span><strong>{customers.length}</strong><small>บัญชีร้านค้า</small></article>
          <article><span>รออนุมัติ</span><strong>{pending.length}</strong><small>ต้องดำเนินการ</small></article>
          <article><span>ออร์เดอร์วันนี้</span><strong>0</strong><small>ยังไม่เปิดใช้งาน</small></article>
          <article><span>รอจัดส่ง</span><strong>0</strong><small>ยังไม่เปิดใช้งาน</small></article>
        </section>

        <section className="admin-panel">
          <div className="panel-heading"><div><h2>ลูกค้ารออนุมัติ</h2><p>ตรวจสอบและเปิดสิทธิ์สั่งซื้อ</p></div><span className="count-badge">{pending.length}</span></div>
          {loading ? <p>กำลังโหลด...</p> : pending.length === 0 ? <div className="empty-state"><Check size={30} /><h3>ไม่มีรายการรออนุมัติ</h3></div> : (
            <div className="table-wrap"><table><thead><tr><th>ร้านค้า</th><th>ผู้ติดต่อ</th><th>เบอร์โทร</th><th>ประเภท</th><th>วันที่สมัคร</th><th /></tr></thead><tbody>
              {pending.map((customer) => <tr key={customer.id}>
                <td><strong>{customer.shop_name}</strong></td><td>{customer.contact_name}</td><td>{customer.phone}</td><td><span className="type-badge">NORMAL</span></td><td>{new Date(customer.created_at).toLocaleDateString('th-TH')}</td><td><button className="approve-button" onClick={() => approve(customer.id)}>อนุมัติ</button></td>
              </tr>)}
            </tbody></table></div>
          )}
        </section>
      </section>
    </main>
  );
}
