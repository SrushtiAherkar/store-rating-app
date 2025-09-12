import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/LoginPage";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";

export default function App(){
  const { user } = useAuth();
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={ user ? (
          user.role === "admin" ? <AdminDashboard /> : user.role === "owner" ? <OwnerDashboard /> : <UserDashboard />
        ) : <Navigate to="/" />} />
        <Route path="*" element={<div style={{padding:20}}>Not Found</div>} />
      </Routes>
    </div>
  );
}
