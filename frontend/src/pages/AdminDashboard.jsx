import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });

  const [stores, setStores] = useState([]);
  const [storeFilter, setStoreFilter] = useState({ q: "", sortBy: "name", order: "ASC" });

  const [users, setUsers] = useState([]);
  const [userFilter, setUserFilter] = useState({ q: "", role: "", sortBy: "name", order: "ASC" });

  const [newStore, setNewStore] = useState({ name: "", email: "", address: "" });
  const [storeMsg, setStoreMsg] = useState("");

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
    role: "user"
  });
  const [userMsg, setUserMsg] = useState("");

  useEffect(() => {
    loadStats();
    loadStores();
    loadUsers();
  }, []);

  // Reload when filters change
  useEffect(() => { loadStores(); }, [storeFilter]);
  useEffect(() => { loadUsers(); }, [userFilter]);

  const loadStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data.stats);
    } catch (err) {
      console.error("Failed to load stats", err);
    }
  };

  const loadStores = async () => {
    try {
      const params = { ...storeFilter };
      const res = await api.get("/stores", { params });
      setStores(res.data.stores);
    } catch (err) {
      console.error(err);
    }
  };

  const loadUsers = async () => {
    try {
      const params = { ...userFilter };
      if (!params.role) delete params.role; // don't send empty role
      const res = await api.get("/users", { params });
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Add Store ---
  const handleStoreChange = (e) => {
    setNewStore({ ...newStore, [e.target.name]: e.target.value });
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    try {
      await api.post("/stores", newStore);
      setStoreMsg("Store added successfully!");
      setNewStore({ name: "", email: "", address: "" });
      loadStats(); loadStores();
    } catch (err) {
      console.error(err);
      setStoreMsg("Error adding store");
    }
  };

  // --- Add User ---
  const handleUserChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/signup", newUser);
      setUserMsg("User created successfully!");
      setNewUser({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "user"
      });
      loadStats(); loadUsers();
    } catch (err) {
      console.error(err);
      setUserMsg("Error creating user: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      <h2 className="page-title text-secondary border-secondary">Admin Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="card border-l-4 border-l-brand hover:scale-105 transform transition-transform">
          <h3 className="text-secondary text-sm uppercase tracking-wide font-bold mb-2">Total Users</h3>
          <p className="text-4xl font-extrabold text-neutral">{stats.users}</p>
        </div>
        <div className="card border-l-4 border-l-secondary hover:scale-105 transform transition-transform">
          <h3 className="text-secondary text-sm uppercase tracking-wide font-bold mb-2">Total Stores</h3>
          <p className="text-4xl font-extrabold text-neutral">{stats.stores}</p>
        </div>
        <div className="card border-l-4 border-l-dark hover:scale-105 transform transition-transform">
          <h3 className="text-secondary text-sm uppercase tracking-wide font-bold mb-2">Total Ratings</h3>
          <p className="text-4xl font-extrabold text-neutral">{stats.ratings}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        {/* --- ADD STORE --- */}
        <div className="card bg-white">
          <h3 className="text-2xl font-bold text-secondary mb-6 pb-2 border-b border-gray-100">Add New Store</h3>
          <form onSubmit={handleAddStore} className="space-y-4">
            <input name="name" placeholder="Store Name" className="input-field" value={newStore.name} onChange={handleStoreChange} required />
            <input name="email" placeholder="Store Email" className="input-field" value={newStore.email} onChange={handleStoreChange} required />
            <input name="address" placeholder="Store Address" className="input-field" value={newStore.address} onChange={handleStoreChange} required />
            <button type="submit" className="btn-primary w-full">
              <span>+</span> Add Store
            </button>
          </form>
          {storeMsg && <p className="mt-3 text-brand font-medium animate-pulse">{storeMsg}</p>}
        </div>

        {/* --- ADD USER --- */}
        <div className="card bg-white">
          <h3 className="text-2xl font-bold text-secondary mb-6 pb-2 border-b border-gray-100">Add New User</h3>
          <form onSubmit={handleAddUser} className="space-y-4">
            <input name="name" placeholder="Full Name (20+ chars)" className="input-field" value={newUser.name} onChange={handleUserChange} required />
            <input name="email" placeholder="Email" className="input-field" value={newUser.email} onChange={handleUserChange} required />
            <input name="address" placeholder="Address" className="input-field" value={newUser.address} onChange={handleUserChange} required />
            <input type="password" name="password" placeholder="Password" className="input-field" value={newUser.password} onChange={handleUserChange} required />
            <select name="role" className="input-field bg-white" value={newUser.role} onChange={handleUserChange}>
              <option value="user">User</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="btn-secondary w-full">
              <span>+</span> Add User
            </button>
          </form>
          {userMsg && <p className="mt-3 text-brand font-medium animate-pulse">{userMsg}</p>}
        </div>
      </div>

      {/* --- STORES LIST --- */}
      <div className="card mb-12 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-2xl font-bold text-neutral">Stores Directory</h3>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <input
              placeholder="Search..."
              className="p-2 border border-gray-300 rounded-lg text-sm flex-grow focus:border-brand focus:ring-1 focus:ring-brand outline-none"
              value={storeFilter.q}
              onChange={(e) => setStoreFilter({ ...storeFilter, q: e.target.value })}
            />
            <select
              className="p-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-brand outline-none"
              value={storeFilter.sortBy}
              onChange={(e) => setStoreFilter({ ...storeFilter, sortBy: e.target.value })}
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="address">Address</option>
            </select>
            <select
              className="p-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-brand outline-none"
              value={storeFilter.order}
              onChange={(e) => setStoreFilter({ ...storeFilter, order: e.target.value })}
            >
              <option value="ASC">Asc</option>
              <option value="DESC">Desc</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-secondary uppercase text-xs tracking-wider border-b border-gray-200">
                <th className="p-4 font-bold">Name</th><th className="p-4 font-bold">Email</th><th className="p-4 font-bold">Address</th><th className="p-4 font-bold text-center">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stores.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-neutral">{s.name}</td>
                  <td className="p-4 text-gray-600">{s.email}</td>
                  <td className="p-4 text-gray-600">{s.address}</td>
                  <td className="p-4 text-center">
                    <span className="inline-block bg-brand/10 text-brand px-3 py-1 rounded-full font-bold text-sm">
                      {s.averageRating} ★
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- USERS LIST --- */}
      <div className="card overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h3 className="text-2xl font-bold text-neutral">User Management</h3>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <input
              placeholder="Search..."
              className="p-2 border border-gray-300 rounded-lg text-sm flex-grow focus:border-brand focus:ring-1 focus:ring-brand outline-none"
              value={userFilter.q}
              onChange={(e) => setUserFilter({ ...userFilter, q: e.target.value })}
            />
            <select
              className="p-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-brand outline-none"
              value={userFilter.role}
              onChange={(e) => setUserFilter({ ...userFilter, role: e.target.value })}
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
            </select>
            <select
              className="p-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-brand outline-none"
              value={userFilter.sortBy}
              onChange={(e) => setUserFilter({ ...userFilter, sortBy: e.target.value })}
            >
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="address">Address</option>
              <option value="role">Role</option>
            </select>
            <select
              className="p-2 border border-gray-300 rounded-lg text-sm bg-white focus:border-brand outline-none"
              value={userFilter.order}
              onChange={(e) => setUserFilter({ ...userFilter, order: e.target.value })}
            >
              <option value="ASC">Asc</option>
              <option value="DESC">Desc</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-secondary uppercase text-xs tracking-wider border-b border-gray-200">
                <th className="p-4 font-bold">Name</th><th className="p-4 font-bold">Email</th><th className="p-4 font-bold">Address</th><th className="p-4 font-bold text-center">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-neutral">{u.name}</td>
                  <td className="p-4 text-gray-600">{u.email}</td>
                  <td className="p-4 text-gray-600">{u.address}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs uppercase font-bold tracking-wider ${u.role === 'admin' ? 'bg-red-100 text-red-700' :
                      u.role === 'owner' ? 'bg-purple-100 text-purple-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
