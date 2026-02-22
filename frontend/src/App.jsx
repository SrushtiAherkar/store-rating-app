import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/LoginPage";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const { user } = useAuth();
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dedicated Role Routes */}
        <Route path="/admin" element={user && user.role === "admin" ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/owner" element={user && user.role === "owner" ? <OwnerDashboard /> : <Navigate to="/" />} />

        {/* Dashboard Redirect / User View */}
        <Route path="/dashboard" element={user ? (
          user.role === "admin" ? <Navigate to="/admin" /> :
            user.role === "owner" ? <Navigate to="/owner" /> :
              <UserDashboard />
        ) : <Navigate to="/" />} />

        <Route path="*" element={<div className="p-10 text-center text-gray-500 text-xl font-bold">404 - Page Not Found</div>} />
      </Routes>
    </div>
  );
}
