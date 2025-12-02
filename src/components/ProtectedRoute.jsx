import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { canAccessHome } = useAuth();

  if (!canAccessHome()) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;

