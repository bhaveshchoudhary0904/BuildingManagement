import React from 'react';

const ComplaintsCard = ({ openCount = 7 }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-500">Open Complaints</h3>
      <p className="mt-4 text-4xl font-bold text-slate-900">{openCount}</p>
      <p className="mt-2 text-sm text-slate-500">Pending issues that require follow-up.</p>
    </div>
  );
};

export default ComplaintsCard;
