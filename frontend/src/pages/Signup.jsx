// frontend/src/pages/Signup.jsx
import React, { useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "user" // default to user, admin NOT allowed here
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    if (!form.name || form.name.length < 20 || form.name.length > 60) {
      return "Name must be 20-60 characters.";
    }
    if (form.address && form.address.length > 400) {
      return "Address must be at most 400 characters.";
    }
    if (!form.password || form.password.length < 8 || form.password.length > 16) {
      return "Password must be 8-16 characters.";
    }
    if (!/[A-Z]/.test(form.password)) {
      return "Password must include at least one uppercase letter.";
    }
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(form.password)) {
      return "Password must include at least one special character.";
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !re.test(form.email)) {
      return "Please enter a valid email.";
    }
    // role must be either 'user' or 'owner' — avoid anything else
    if (form.role !== "user" && form.role !== "owner") {
      return "Invalid role selected.";
    }
    return null;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/signup", form);
      // res.data => { token, user }
      login(res.data); // saves token/user in context/localStorage
      const role = res.data.user.role;
      // redirect by role
      if (role === "admin") navigate("/admin");
      else if (role === "owner") navigate("/owner");
      else navigate("/dashboard"); // user dashboard
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="card w-full max-w-lg shadow-xl border-t-8 border-t-brand">
        <h2 className="text-3xl font-black text-secondary mb-8 text-center uppercase tracking-tight">Create Account</h2>

        {error && (
          <div className="bg-red-50 border-l-4 border-brand text-brand p-4 mb-6 rounded-md font-medium text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Full Name</label>
            <input
              name="name"
              placeholder="Full Name (20-60 chars)"
              value={form.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Email</label>
            <input
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="input-field"
              type="email"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Address</label>
            <textarea
              name="address"
              placeholder="Address (max 400 chars)"
              value={form.address}
              onChange={handleChange}
              className="input-field min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Password</label>
              <input
                name="password"
                placeholder="8-16 chars, Uppercase, Special"
                value={form.password}
                onChange={handleChange}
                className="input-field"
                type="password"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Register As</label>
              <select name="role" value={form.role} onChange={handleChange} className="input-field bg-white">
                <option value="user">Normal User</option>
                <option value="owner">Store Owner</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-lg mt-4 font-bold shadow-lg shadow-brand/20">
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account? <a href="/" className="text-brand font-bold hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );

}
