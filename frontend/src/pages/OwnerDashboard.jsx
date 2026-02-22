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

  const loadStores = async () => {
    try {
      const res = await api.get("/stores");
      // filter to only my stores
      const owned = res.data.stores.filter(s => s.owner && s.owner.id === user.id);
      // Note: Backend getStores might return owner object. If not, filtered by checking s.owner.id if eager loaded or separate query.
      // Based on controller, it includes owner.
      setStores(owned);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadStores(); }, []);

  const openRatings = async (store) => {
    try {
      const res = await api.get(`/ratings/store/${store.id}`);
      setRatingsForStore({ store, data: res.data });
    } catch (err) {
      console.error(err);
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
      setPassMsg("Error updating password: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      <div className="flex justify-between items-center mb-8 border-b-2 border-brand pb-4">
        <h2 className="text-xl md:text-3xl font-bold text-secondary">Owner Dashboard</h2>
        <button onClick={logout} className="bg-dark text-white px-5 py-2.5 rounded-lg hover:bg-black transition-colors shadow-md text-sm font-semibold tracking-wide">
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Update Password */}
        <div className="card h-fit">
          <h3 className="text-xl font-bold text-secondary mb-6 border-b border-gray-100 pb-2">Security</h3>
          <form onSubmit={handlePassUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Current Password</label>
              <input
                type="password"
                className="input-field"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">New Password</label>
              <input
                type="password"
                className="input-field"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-secondary w-full">Update Password</button>
          </form>
          {passMsg && <p className="mt-4 text-sm font-medium text-brand text-center bg-brand/10 p-2 rounded">{passMsg}</p>}
        </div>

        {/* Stores List */}
        <div className="lg:col-span-2 space-y-8">
          <div className="card">
            <h3 className="text-xl font-bold text-secondary mb-6 border-b border-gray-100 pb-2">Your Stores</h3>
            {stores.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">You don't have any stores assigned yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stores.map(s => (
                  <div key={s.id} className="border border-gray-200 p-5 rounded-xl hover:shadow-lg transition bg-white hover:border-brand/30 group">
                    <h4 className="font-bold text-lg text-neutral group-hover:text-brand transition-colors">{s.name}</h4>
                    <p className="text-sm text-gray-500 mb-4">{s.address}</p>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-brand text-lg">{s.averageRating}</span>
                        <span className="text-yellow-500">★</span>
                        <span className="text-xs text-gray-400 font-medium">({s.totalRatings} ratings)</span>
                      </div>
                      <button
                        onClick={() => openRatings(s)}
                        className="text-xs font-bold text-secondary bg-secondary/10 px-3 py-1.5 rounded-full hover:bg-secondary hover:text-white transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ratings View */}
          {ratingsForStore && (
            <div className="card animate-fade-in border-t-4 border-t-brand">
              <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-xl font-bold text-neutral">
                  Ratings for <span className="text-brand">{ratingsForStore.store.name}</span>
                </h3>
                <span className="text-2xl font-black text-neutral">{ratingsForStore.data.averageRating} <span className="text-yellow-500 text-lg">★</span></span>
              </div>

              {ratingsForStore.data.ratings.length === 0 ? (
                <p className="text-gray-500 italic">No ratings received yet.</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {ratingsForStore.data.ratings.map(r => (
                    <div key={r.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-bold text-neutral block">{r.user?.name || "Unknown User"}</span>
                          <span className="text-[10px] text-gray-400 font-medium uppercase">{new Date(r.createdAt).toLocaleDateString()}</span>
                        </div>
                        <span className="bg-white px-2 py-1 rounded shadow-sm font-bold text-brand border border-gray-100">{r.value} ★</span>
                      </div>
                      {r.comment && <p className="text-gray-600 text-sm italic leading-relaxed">"{r.comment}"</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

}
