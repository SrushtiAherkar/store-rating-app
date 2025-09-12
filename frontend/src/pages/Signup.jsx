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
    <div style={{ padding: 20 }}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
        <div style={{ marginBottom: 8 }}>
          <input
            name="name"
            placeholder="Full Name (20-60 chars)"
            value={form.name}
            onChange={handleChange}
            style={{ width: "100%", padding: 8 }}
            required
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={{ width: "100%", padding: 8 }}
            type="email"
            required
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <textarea
            name="address"
            placeholder="Address (max 400 chars)"
            value={form.address}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, minHeight: 80 }}
          />
        </div>

        <div style={{ marginBottom: 8 }}>
          <input
            name="password"
            placeholder="Password (8-16 chars, 1 uppercase, 1 special)"
            value={form.password}
            onChange={handleChange}
            style={{ width: "100%", padding: 8 }}
            type="password"
            required
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Register as</label>
          <select name="role" value={form.role} onChange={handleChange} style={{ padding: 8 }}>
            <option value="user">Normal User</option>
            <option value="owner">Store Owner</option>
          </select>
        </div>

        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign up"}
        </button>
      </form>
    </div>
  );
}
