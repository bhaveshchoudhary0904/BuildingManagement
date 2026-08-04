import React from 'react';

const RevenueCard = ({ amount = '₹1,84,200' }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-500">Revenue</h3>
      <p className="mt-4 text-4xl font-bold text-slate-900">{amount}</p>
      <p className="mt-2 text-sm text-slate-500">Total dues collected this month.</p>
    </div>
  );
};

export default RevenueCard;
