import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminStorePage = () => {
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const API = process.env.REACT_APP_API_BASE;

  // Fetch all stores
  const getStores = async () => {
    try {
      const res = await axios.get(`${API}/stores`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getStores();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/stores`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Store added successfully!");
      setForm({ name: "", email: "", address: "" });
      getStores();
    } catch (err) {
      setMessage("Error adding store");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Store Management</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="name"
          placeholder="Store Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Store Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Store Address"
          value={form.address}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Store</button>
      </form>

      {message && <p>{message}</p>}

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Average Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.address}</td>
              <td>{s.average_rating || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminStorePage;
