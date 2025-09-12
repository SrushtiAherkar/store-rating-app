import React, { useState } from "react";
import api from "../api/api";

export default function RatingForm({ store, initial, onDone }) {
  const [value, setValue] = useState(initial?.value || 5);
  const [comment, setComment] = useState(initial?.comment || "");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const res = await api.post("/ratings", { storeId: store.id, value, comment });
      onDone(res.data.rating);
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    } finally { setLoading(false); }
  };

  return (
    <div style={{padding:12,border:"1px solid #ddd",borderRadius:6, background:"#fff", minWidth:320}}>
      <h4>Rate {store.name}</h4>
      <div style={{marginBottom:8}}>
        <label>Value (1-5)</label><br/>
        <select value={value} onChange={e=>setValue(Number(e.target.value))}>
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <div style={{marginBottom:8}}>
        <label>Comment (optional)</label><br/>
        <textarea value={comment} onChange={e=>setComment(e.target.value)} rows={4} style={{width:"100%"}} />
      </div>
      <button onClick={submit} disabled={loading}>{loading ? "Saving..." : "Submit"}</button>
    </div>
  );
}
