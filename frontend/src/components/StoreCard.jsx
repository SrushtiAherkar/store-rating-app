import React from "react";

export default function StoreCard({ store, onRateClick, myRating }) {
  return (
    <div className="store-card">
      <h3>{store.name}</h3>
      <div><strong>Address:</strong> {store.address}</div>
      <div><strong>Avg Rating:</strong> {store.averageRating} ({store.totalRatings})</div>
      <div><strong>Your Rating:</strong> {myRating ? myRating.value : "N/A"}</div>
      <button onClick={() => onRateClick(store)}>Rate / Edit</button>
    </div>
  );
}
