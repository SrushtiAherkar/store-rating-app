import React, { useState } from "react";
import api from "../api/api";

export default function RatingForm({ store, initial, onDone }) {
  const [value, setValue] = useState(initial?.value || 5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(initial?.comment || "");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!value) return alert("Please select a rating.");
    setLoading(true);
    try {
      if (initial && initial.id) {
        // update
        const res = await api.put(`/ratings/${initial.id}`, { value, comment });
        onDone(res.data.rating);
      } else {
        // create
        const res = await api.post("/ratings", { storeId: store.id, value, comment });
        onDone(res.data.rating);
      }
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Your Rating</label>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`text-4xl transition-transform duration-200 hover:scale-110 focus:outline-none ${star <= (hover || value) ? "text-yellow-400" : "text-gray-200"
                }`}
              onClick={() => setValue(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </button>
          ))}
        </div>
        <p className="text-sm font-medium text-brand mt-2 h-5">
          {hover || value ? ["Terrible", "Bad", "Okay", "Good", "Excellent"][(hover || value) - 1] : ""}
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Comment (Optional)</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={4}
          className="input-field resize-none"
          placeholder="Share your experience..."
        />
      </div>

      <button
        onClick={submit}
        disabled={loading}
        className="btn-primary w-full py-3 text-lg font-bold shadow-brand/20 shadow-lg"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </span>
        ) : (
          initial ? "Update Rating" : "Submit Rating"
        )}
      </button>
    </div>
  );
}
