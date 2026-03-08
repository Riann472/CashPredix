import useAuth from '../hooks/useAuth';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

 const ProtectedRoute = () => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />
    )
}

export default ProtectedRoute;