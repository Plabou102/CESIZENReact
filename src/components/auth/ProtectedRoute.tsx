import { Navigate } from "react-router-dom";
import { useMe } from "../../hooks/auth/useMe";
import { isAuthenticated } from "../../utils/authStorage";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const hasToken = isAuthenticated();
  const { data: user, isLoading, isError } = useMe();

  if (!hasToken) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (isError || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "ADMIN") {
    return <div>Accès refusé</div>;
  }

  return <>{children}</>;
}