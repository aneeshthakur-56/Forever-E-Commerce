import { Navigate, Outlet } from "react-router-dom";
import { useAdminContext } from "../context/AdminContext";
import Loading from "../components/Loading";

const ProtectedRoute = () => {
  const { isAuth } = useAdminContext();
  return <>{isAuth ? <Outlet /> : <Navigate to="/login" />}</>;
};

export default ProtectedRoute;
