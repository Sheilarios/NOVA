import { Navigate } from "react-router-dom";
import { useAdmin } from "../../hooks/useAdmin";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAdmin();

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;