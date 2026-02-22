import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function AdminLoginModal({ onClose }) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/auth/login", {
                email: "admin@example.com",
                password
            });
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);
            onClose(); // close modal
            navigate("/admin");
        } catch (err) {
            alert("Admin Login Failed: " + (err.response?.data?.message || "Invalid Password"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-neutral/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="card w-full max-w-sm shadow-2xl relative animate-fade-in border-t-4 border-t-secondary">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-secondary transition-colors text-xl font-bold"
                >
                    ✕
                </button>

                <h3 className="text-2xl font-black text-secondary mb-1">Admin Access</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-6">Enter System Password</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field text-center tracking-widest font-bold"
                            autoFocus
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn-secondary w-full py-3 shadow-lg"
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Unlock Dashboard"}
                    </button>
                </form>
            </div>
        </div>
    );
}
