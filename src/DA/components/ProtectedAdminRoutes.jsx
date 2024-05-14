import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedAdminRoutes = () => {
  const { user } = useSelector((state) => state.user);

  return user?.isAdmin ? <Outlet /> : <Navigate to={"/"} />;
};

export default ProtectedAdminRoutes;
