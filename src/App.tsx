import { Navigate, Route, Routes } from 'react-router-dom';
import CustomerApp from './pages/CustomerApp';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/customer" replace />} />
      <Route path="/customer/*" element={<CustomerApp />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}
