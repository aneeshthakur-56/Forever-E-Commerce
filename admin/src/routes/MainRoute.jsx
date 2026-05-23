import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "../layout/Layout";
import AddProduct from "../pages/AddProduct";
import ListProduct from "../pages/ListProduct";
import Orders from "../pages/Orders";
import Login from "../pages/Login";
import Loading from "../components/Loading";

import { useAdminContext } from "../context/AdminContext";
import ProtectedRoute from "./ProtectedRoute";

const MainRoute = () => {
  const { isLoading } = useAdminContext();
  if (isLoading) return <Loading />;
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route path="/" element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          <Route index element={<AddProduct />} />
          <Route path="add" element={<AddProduct />} />
          <Route path="list" element={<ListProduct />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default MainRoute;
