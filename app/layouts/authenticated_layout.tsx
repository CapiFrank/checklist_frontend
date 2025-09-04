import { Navigate, Outlet } from "react-router";
import { useAuth } from "~/contexts/auth_context";

const AuthenticatedLayout = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
export default AuthenticatedLayout;
