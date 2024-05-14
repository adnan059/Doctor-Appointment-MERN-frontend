import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { token } = useSelector((state) => state.user);

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
