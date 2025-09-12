// frontend/src/pages/OwnerDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function OwnerDashboard() {
  const { user, logout } = useAuth();

  const [stores, setStores] = useState([]);
  const [ratingsForStore, setRatingsForStore] = useState(null);

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [passMsg, setPassMsg] = useState("");

  // Load only stores owned by this owner
  const loadStores = async () => {
    try {
      const res = await api.get("/stores");
      const owned = res.data.stores.filter(s => s.owner_id === user.id);
      setStores(owned);
    } catch (err) {
      console.error(err);
      alert("Error loading owner data");
    }
  };

  useEffect(() => { loadStores(); }, []);

  const openRatings = async (store) => {
    try {
      const res = await api.get(`/ratings/store/${store.id}`);
      setRatingsForStore({ store, data: res.data });
    } catch (err) {
      console.error(err);
      alert("Error loading ratings");
    }
  };

  const handlePassUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${user.id}/password`, {
        oldPassword: oldPass,
        newPassword: newPass
      });
      setPassMsg("Password updated successfully!");
      setOldPass("");
      setNewPass("");
    } catch (err) {
      console.error(err);
      setPassMsg("Error updating password");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Owner Dashboard</h2>
      <button onClick={logout} style={{ float: "right" }}>Logout</button>

      <section style={{ marginTop: 40 }}>
        <h3>Update Password</h3>
        <form onSubmit={handlePassUpdate} style={{ marginBottom: 20 }}>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
          />
          <button type="submit">Update Password</button>
        </form>
        {passMsg && <p>{passMsg}</p>}
      </section>

      <section style={{ marginTop: 40 }}>
        <h3>Your Stores</h3>
        {stores.length === 0 ? (
          <p>You don’t have any stores yet.</p>
        ) : (
          <ul>
            {stores.map(s => (
              <li key={s.id}>
                {s.name} — Avg: {s.averageRating}
                <button onClick={() => openRatings(s)} style={{ marginLeft: 10 }}>
                  View Ratings
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {ratingsForStore && (
        <section style={{ marginTop: 40 }}>
          <h3>
            Ratings for {ratingsForStore.store.name} — 
            Avg: {ratingsForStore.data.averageRating}
          </h3>
          {ratingsForStore.data.ratings.length === 0 ? (
            <p>No ratings yet.</p>
          ) : (
            <ul>
              {ratingsForStore.data.ratings.map(r => (
                <li key={r.id}>
                  <strong>{r.user?.name}</strong>: {r.value} — {r.comment || ""}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
