import { Navigate, Outlet } from "react-router-dom";

function ProtectedLayout() {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default ProtectedLayout;
