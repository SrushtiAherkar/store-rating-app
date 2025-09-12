import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar(){
  const { user, logout } = useAuth();
  return (
    <nav style={{display:"flex",gap:12,padding:12,background:"#f5f5f5",alignItems:"center"}}>
      <Link to="/">Home</Link>
      {!user ? (
        <>
          <Link to="/">Login</Link>
          <Link to="/signup">Signup</Link>
        </>
      ) : (
        <>
          <span style={{marginLeft:8}}>{user.name} ({user.role})</span>
          <Link to="/dashboard">Dashboard</Link>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </nav>
  );
}
