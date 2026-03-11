import { Toaster } from './components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Layout from './components/Layout';
import UserSettings from './pages/UserSettings';
import ExpenseSettings from './pages/ExpenseSettings';
import Register from './pages/Register';
import Transactions from './pages/Transactions';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Settings from './pages/Settings';

const queryClient = new QueryClient()

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/settings/user" element={<UserSettings />} />
                <Route path="/settings/expenses" element={<ExpenseSettings />} />
                <Route path="/transactions" element={<Transactions />} />
              </Route>
            </Route>
          </Routes>
        </QueryClientProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
