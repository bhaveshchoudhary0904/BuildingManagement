import React from 'react';

const VisitorsCard = ({ visitorsToday = 24 }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-500">Visitors Today</h3>
      <p className="mt-4 text-4xl font-bold text-slate-900">{visitorsToday}</p>
      <p className="mt-2 text-sm text-slate-500">Guest entries recorded for the current day.</p>
    </div>
  );
};

export default VisitorsCard;
