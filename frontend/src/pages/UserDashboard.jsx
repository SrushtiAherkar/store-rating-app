import React, { useEffect, useState } from "react";
import api from "../api/api";
import StoreCard from "../components/StoreCard";
import RatingForm from "../components/RatingForm";
import { useAuth } from "../context/AuthContext";

export default function UserDashboard(){
  const [stores, setStores] = useState([]);
  const [selected, setSelected] = useState(null);
  const { user } = useAuth();

  useEffect(()=>{ load(); }, []);

  const load = async () => {
    try {
      const res = await api.get("/stores");
      setStores(res.data.stores);
    } catch (err) { console.error(err); alert("Error loading stores"); }
  };

  const openRate = async (store) => {
    try {
      const res = await api.get(`/ratings/store/${store.id}`);
      const existing = res.data.ratings.find(r => r.userId === user.id || (r.user && r.user.id === user.id));
      setSelected({ store, existing });
    } catch (err) { console.error(err); setSelected({ store, existing: null }); }
  };

  const afterDone = (rating) => {
    setSelected(null);
    load();
  };

  return (
    <div style={{padding:20}}>
      <h2>User Dashboard</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12}}>
        {stores.map(s => (
          <StoreCard key={s.id} store={s} onRateClick={openRate} myRating={null} />
        ))}
      </div>

      {selected && (
        <div style={{position:"fixed",right:20,top:80}}>
          <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
            <button onClick={()=>setSelected(null)}>Close</button>
          </div>
          <RatingForm store={selected.store} initial={selected.existing} onDone={afterDone} />
        </div>
      )}
    </div>
  );
}
