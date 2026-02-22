import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      if (res.data.user.role === "admin") navigate("/admin");
      else if (res.data.user.role === "owner") navigate("/owner");
      else navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="card w-full max-w-md shadow-2xl border-t-8 border-t-brand">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-secondary tracking-tighter mb-2">
            RATE<span className="text-brand">IT</span>.
          </h2>
          <p className="text-gray-400 font-medium uppercase tracking-wide text-xs">Sign In to Continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Email Address</label>
            <input
              type="email"
              placeholder="yours@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <button type="submit" className="btn-primary w-full py-3 text-lg font-bold shadow-lg shadow-brand/20">
            Login
          </button>
        </form>
        <p className="mt-8 text-center text-gray-400 text-sm">
          Don't have an account? <a href="/signup" className="text-brand font-bold hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}
