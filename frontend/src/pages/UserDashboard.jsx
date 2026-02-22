import React, { useEffect, useState } from "react";
import api from "../api/api";
import StoreCard from "../components/StoreCard";
import RatingForm from "../components/RatingForm";
import { useAuth } from "../context/AuthContext";

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [myRatings, setMyRatings] = useState([]);
  const [selected, setSelected] = useState(null);
  const { user } = useAuth();

  const [filter, setFilter] = useState({ q: "" });

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const [stm, myr] = await Promise.all([
        api.get("/stores"),
        api.get("/ratings/me")
      ]);
      setStores(stm.data.stores);
      setMyRatings(myr.data.ratings);
    } catch (err) { console.error(err); alert("Error loading stores"); }
  };

  const openRate = async (store) => {
    // find in local myRatings first
    const existing = myRatings.find(r => r.storeId === store.id);
    setSelected({ store, existing });
  };

  const afterDone = (rating) => {
    setSelected(null);
    load(); // reload to refresh avgs and my ratings
  };

  // Filter stores
  const filteredStores = stores.filter(s => {
    if (!filter.q) return true;
    const q = filter.q.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q);
  });

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      <h2 className="page-title text-secondary border-secondary">User Dashboard</h2>

      <div className="mb-8 flex gap-4">
        <input
          placeholder="Search Stores by Name or Address..."
          className="input-field w-full max-w-md shadow-sm"
          value={filter.q}
          onChange={e => setFilter({ ...filter, q: e.target.value })}
        />
      </div>

      {filteredStores.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg">No stores found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStores.map(s => {
            const myRating = myRatings.find(r => r.storeId === s.id);
            return (
              <StoreCard key={s.id} store={s} onRateClick={openRate} myRating={myRating} />
            );
          })}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-neutral/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative transform transition-all scale-100">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-brand transition-colors text-2xl"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold text-secondary mb-1">Rate Store</h3>
            <p className="text-gray-500 mb-6 font-medium">{selected.store.name}</p>
            <RatingForm store={selected.store} initial={selected.existing} onDone={afterDone} />
          </div>
        </div>
      )}
    </div>
  );

}
