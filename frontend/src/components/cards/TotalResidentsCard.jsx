import React from 'react';

const TotalResidentsCard = ({ total = 120 }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-500">Total Residents</h3>
      <p className="mt-4 text-4xl font-bold text-slate-900">{total}</p>
      <p className="mt-2 text-sm text-slate-500">Active residents currently registered in the community.</p>
    </div>
  );
};

export default TotalResidentsCard;
