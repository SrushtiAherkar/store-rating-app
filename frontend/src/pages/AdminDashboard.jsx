import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);

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
    load();
  }, []);

  const load = async () => {
    try {
      const [storesRes, usersRes] = await Promise.all([
        api.get("/stores"),
        api.get("/users")
      ]);
      setStores(storesRes.data.stores);
      setUsers(usersRes.data.users);
      const storeCount = storesRes.data.stores.length;
      const ratingsTotal = storesRes.data.stores.reduce(
        (a, b) => a + (b.totalRatings || 0),
        0
      );
      setStats({
        users: usersRes.data.users.length,
        stores: storeCount,
        ratings: ratingsTotal
      });
    } catch (err) {
      console.error(err);
      alert("Error loading admin data");
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
      load();
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
      load();
    } catch (err) {
      console.error(err);
      setUserMsg("Error creating user");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Dashboard</h2>

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <div className="stat">Total Users: {stats.users}</div>
        <div className="stat">Total Stores: {stats.stores}</div>
        <div className="stat">Total Ratings: {stats.ratings}</div>
      </div>

      {/* -------- Add Store Form -------- */}
      <h3>Add New Store</h3>
      <form onSubmit={handleAddStore} style={{ marginBottom: 20 }}>
        <input
          type="text"
          name="name"
          placeholder="Store Name"
          value={newStore.name}
          onChange={handleStoreChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Store Email"
          value={newStore.email}
          onChange={handleStoreChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Store Address"
          value={newStore.address}
          onChange={handleStoreChange}
          required
        />
        <button type="submit">Add Store</button>
      </form>
      {storeMsg && <p>{storeMsg}</p>}

      {/* -------- Add User Form -------- */}
      <h3>Add New User</h3>
      <form onSubmit={handleAddUser} style={{ marginBottom: 20 }}>
        <input
          type="text"
          name="name"
          placeholder="Full Name (20+ chars)"
          value={newUser.name}
          onChange={handleUserChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleUserChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={newUser.address}
          onChange={handleUserChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={newUser.password}
          onChange={handleUserChange}
          required
        />
        <select name="role" value={newUser.role} onChange={handleUserChange}>
          <option value="user">User</option>
          <option value="owner">Owner</option>
        </select>
        <button type="submit">Add User</button>
      </form>
      {userMsg && <p>{userMsg}</p>}

      {/* -------- Stores Table -------- */}
      <h3>Stores</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Address</th><th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.address}</td>
              <td>{s.averageRating}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* -------- Users Table -------- */}
      <h3>Users</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Address</th><th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.address}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
