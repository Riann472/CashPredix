import { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { apiConfig } from '../services/apiConfig';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const { auth, setAuth } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      apiConfig.get("/auth/profile", { withCredentials: true })
        .then(res => {
          setAuth(res.data);
        })
        .catch(() => {
          setAuth(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [auth, setAuth]);

  if (loading) return null;

  return auth
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;