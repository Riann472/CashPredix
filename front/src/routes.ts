import { createBrowserRouter } from 'react-router';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'transacoes', Component: Transactions },
      { path: 'configuracoes', Component: Settings },
    ],
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/registro',
    Component: Register,
  },
]);

