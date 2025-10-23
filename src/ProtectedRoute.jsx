// src/component/admin/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("admintoken");
  const userType = localStorage.getItem("userType");

  // Check if token or user role is invalid
  if (!token || userType !== "SuperAdmin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
