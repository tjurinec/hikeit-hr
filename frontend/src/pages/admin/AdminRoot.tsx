import { useState } from 'react';
import AdminLoginPage from './AdminLoginPage';
import AdminPage from './AdminPage';

export default function AdminRoot() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (!loggedIn) return <AdminLoginPage onLogin={() => setLoggedIn(true)} />;
  return <AdminPage onLogout={() => setLoggedIn(false)} />;
}
