import { Home, PackageSearch, ShoppingBag, UserRound } from 'lucide-react';

type Props = { active: string; onChange: (key: string) => void };

export default function BottomNav({ active, onChange }: Props) {
  const items = [
    ['home', 'หน้าหลัก', Home],
    ['catalog', 'สินค้า', PackageSearch],
    ['orders', 'ออร์เดอร์', ShoppingBag],
    ['account', 'บัญชี', UserRound],
  ] as const;
  return (
    <nav className="bottom-nav">
      {items.map(([key, label, Icon]) => (
        <button key={key} className={active === key ? 'active' : ''} onClick={() => onChange(key)}>
          <Icon size={20} strokeWidth={1.8} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
