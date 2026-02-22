import React from "react";

export default function StoreCard({ store, onRateClick, myRating }) {
  return (
    <div className="card h-full flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
      <div>
        <h3 className="text-xl font-bold text-secondary mb-2">{store.name}</h3>
        <p className="text-gray-500 text-sm mb-4 flex items-start gap-2">
          <svg className="w-4 h-4 mt-0.5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          {store.address}
        </p>
      </div>

      <div className="mt-4 border-t border-gray-100 pt-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Average</span>
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-gray-800">{store.averageRating}</span>
            <span className="text-brand">★</span>
            <span className="text-xs text-gray-400 font-medium ml-1">({store.totalRatings})</span>
          </div>
        </div>
        <div className="flex justify-between items-center mb-5">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Your Rate</span>
          <span className={`text-sm font-bold ${myRating ? 'text-secondary' : 'text-gray-300 italic'}`}>
            {myRating ? `${myRating.value} ★` : "—"}
          </span>
        </div>

        <button
          onClick={() => onRateClick(store)}
          className={`w-full py-2.5 rounded-lg font-bold transition-all duration-200 shadow-sm ${myRating
              ? 'bg-white border-2 border-brand text-brand hover:bg-brand hover:text-white'
              : 'btn-primary'
            }`}
        >
          {myRating ? "Update Rating" : "Rate Store"}
        </button>
      </div>
    </div>
  );
}
