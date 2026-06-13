import { Navigate } from 'react-router';
import { useAuth, UserRole } from '@/react-app/hooks/useAuth';

interface Props {
  children: React.ReactNode;
  role: UserRole;
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1B4F72]" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== role) {
    // Redirect to their own dashboard if they hit the wrong role's URL
    if (user.role === 'warden') return <Navigate to="/warden/dashboard" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }

  return <>{children}</>;
}
